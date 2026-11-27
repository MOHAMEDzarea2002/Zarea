const { model } = require('mongoose');
const User = require('../models/auth.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register a new user
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      phone,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userData } = user.toObject();

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Account created successfully",
      user: userData,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userData } = user.toObject();

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: userData,

    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
module.exports = { register, login, logout, getMe }

