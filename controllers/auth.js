import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modals/User.js";

// Register User

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const hasher = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, hasher);

    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist..." });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ msg: "User does not exist..." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);
    delete user.password;
    return res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
