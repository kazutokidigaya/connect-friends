import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { username, password, interests } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please input username and password" });
    }

    const exsistingUser = await User.findOne({ username });
    if (exsistingUser) {
      return res.status(401).json({ message: "Username already exsists" });
    }

    const newUser = new User({ username, password, interests });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      username: username,
      interests: interests,
    });
  } catch (error) {
    res.status(400).json({ message: "Error registering User" });
    console.log("Error in registerController", error);
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please input username and password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ token, username: user.username, interests: user.interests });
  } catch (error) {
    console.log("Error In LoginController", error);
    res.status(400).json({ message: "Error logging In User" });
  }
};
