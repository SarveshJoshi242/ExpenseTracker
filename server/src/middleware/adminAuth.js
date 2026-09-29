import { errorResponse } from '../utils/responseHelper.js';

export const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 403, 'Not authorized as an admin');
  }
};
