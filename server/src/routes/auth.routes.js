import express from 'express';
import { register, login, refreshToken, getProfile, updateProfile, changePassword } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../middleware/validator.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', apiLimiter, validate(registerSchema), register);
router.post('/login', apiLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshToken);

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
