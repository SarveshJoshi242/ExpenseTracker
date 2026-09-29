import logger from '../utils/logger.js';
import { errorResponse } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 400, 'Validation Error', errors);
  }

  if (err.code === 11000) {
    return errorResponse(res, 400, 'Duplicate Field Value Entered');
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 400, `Resource not found with id of ${err.value}`);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return errorResponse(res, statusCode, err.message || 'Internal Server Error');
};
