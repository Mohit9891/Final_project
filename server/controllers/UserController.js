import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import Resume from "../models/Resume.js"; // ⚠️ make sure this path is correct

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ FIX: use bcrypt.compare directly instead of comparePassword instance method
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingUser._id);

    existingUser.password = undefined;

    res.status(200).json({
      message: "Login successful",
      token,
      user: existingUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ FIX: was `User.findById` (missing call) — now `User.findById(userId)`
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
