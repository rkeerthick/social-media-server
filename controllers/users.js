import mongoose from "mongoose";
import User from "../modals/User.js";


// Read

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = await friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Update

export const addRemoveFriend = async (req, res) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;

    const { id, friendId } = req.params;

    const userId = new ObjectId(id); // Convert to ObjectId
    const user = await User.findById(userId);

    const frndId = new ObjectId(friendId); // Convert to ObjectId
    const friend = await User.findById(frndId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== friendId
      );
      friend.friends = friend.friends.filter(
        (friend) => friend.toString() !== id
      );
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((friend) => User.findById(friend))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

