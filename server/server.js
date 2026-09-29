import app from './src/app.js';
import connectDB from './src/config/database.js';
import { config } from './src/config/env.js';
import logger from './src/utils/logger.js';
import User from './src/models/User.js';

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: config.admin.email });
    
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: config.admin.email,
        passwordHash: config.admin.password, // will be hashed by pre-save hook
        role: 'admin',
        isActive: true
      });
      logger.info('Admin user seeded successfully.');
    }
  } catch (error) {
    logger.error('Error seeding admin user:', error);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connection established');

    await seedAdmin();

    const PORT = config.port || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running in ${config.env} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});
