import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token invalid'));
  }
};
