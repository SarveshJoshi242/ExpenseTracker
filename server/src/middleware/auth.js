import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/responseHelper.js';

export const auth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return errorResponse(res, 401, 'Not authorized to access this route');
    }
    
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'User no longer exists');
    }
    if (!user.isActive) {
      return errorResponse(res, 401, 'User account is deactivated');
    }
    
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized to access this route');
  }
};
