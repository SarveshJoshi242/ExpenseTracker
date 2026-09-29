import { welcomeMessage } from './templates/welcome.js';
import { generateExpenseReport } from './services/reportGenerator.js';
import { findUserByPhone } from './services/userLookup.js';
import logger from './utils/logger.js';

export const handleIncomingMessage = async (sock, msg) => {
  try {
    const sender = msg.key.remoteJid;
    const messageContent = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
    
    if (!messageContent) return;
    
    const text = messageContent.trim().toLowerCase();
    logger.info(`Received message from ${sender}: ${text}`);

    // Extract phone number from JID
    const phone = sender.split('@')[0];

    // Find user in DB
    const user = await findUserByPhone(phone);

    if (!user) {
      // First time contact or unregistered
      await sock.sendMessage(sender, { text: welcomeMessage() });
      return;
    }

    if (text === 'help') {
      const helpMsg = `🤖 *ExpenseTracker Help*\n\nAvailable commands:\n- *report* or *summary*: Get your expense summary\n- *help*: Show this menu\n\nVisit our app to track more expenses!`;
      await sock.sendMessage(sender, { text: helpMsg });
    } else if (text === 'report' || text === 'summary') {
      const report = await generateExpenseReport(user._id);
      await sock.sendMessage(sender, { text: report });
    } else {
      // Default response for registered users
      await sock.sendMessage(sender, { text: `I didn't quite get that. Type *help* to see available commands.` });
    }

  } catch (error) {
    logger.error('Error handling message:', error);
  }
};
