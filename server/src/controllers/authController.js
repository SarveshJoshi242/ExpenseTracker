import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { config } from '../config/env.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

const generateTokens = (id) => {
  const token = jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiry });
  const refreshToken = jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.refreshExpiry });
  return { token, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 400, 'User already exists');
    }

    user = await User.create({ name, email, passwordHash: password, phone });
    
    // Seed default categories for this user
    await Category.seedDefaultCategories(user._id);

    const tokens = generateTokens(user._id);
    
    successResponse(res, 201, 'User registered successfully', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return errorResponse(res, 401, 'Invalid credentials or inactive account');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const tokens = generateTokens(user._id);
    
    successResponse(res, 200, 'Login successful', {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return errorResponse(res, 400, 'Refresh token is required');

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) return errorResponse(res, 401, 'Invalid token');

    const tokens = generateTokens(user._id);
    successResponse(res, 200, 'Token refreshed', tokens);
  } catch (error) {
    errorResponse(res, 401, 'Invalid or expired refresh token');
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    successResponse(res, 200, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, currency, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, currency, avatar },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    successResponse(res, 200, 'Profile updated', user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return errorResponse(res, 400, 'Incorrect old password');
    }

    user.passwordHash = newPassword;
    await user.save();

    successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
