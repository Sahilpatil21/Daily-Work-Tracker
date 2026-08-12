import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = '7d';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password || !companyName) {
      res.status(400);
      throw new Error('Please provide name, email, password, and company name');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400);
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const identifier = email?.trim();

    if (!identifier || !password) {
      res.status(400);
      throw new Error('Please provide email or username and password');
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { name: identifier }
      ]
    });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email/username or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401);
      throw new Error('Invalid email/username or password');
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    res.json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        companyName: req.user.companyName
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, companyName, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (companyName) user.companyName = companyName;
    if (password) user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        companyName: updatedUser.companyName
      }
    });
  } catch (error) {
    next(error);
  }
};
