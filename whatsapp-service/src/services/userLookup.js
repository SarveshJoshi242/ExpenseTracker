import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const UserSchema = new mongoose.Schema({
  phone: String,
  name: String,
}, { collection: 'users' });

let User;
try {
  User = mongoose.model('User');
} catch (e) {
  User = mongoose.model('User', UserSchema);
}

export const findUserByPhone = async (phone) => {
  try {
    // Basic formatting handling, e.g., if phone is '919876543210', we might want to check exact or regex
    const user = await User.findOne({ phone: new RegExp(phone + '$') });
    return user;
  } catch (error) {
    logger.error('Error finding user by phone:', error);
    return null;
  }
};
