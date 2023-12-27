import Post from "../modals/Post.js";
import User from "../modals/User.js";

// Create

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

// Read

export const getFeedPost = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(404).json(post);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const likePosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.params;
    const post = await Post.find({ id });
    const isLiked = post.likes.get(userId);
    isLiked ? post.likes.delete(userId) : post.likes.set(userId, true);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(404).json(updatedPost);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
