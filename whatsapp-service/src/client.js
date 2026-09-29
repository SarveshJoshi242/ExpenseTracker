import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import logger from './utils/logger.js';
import qrcode from 'qrcode-terminal';
import { handleIncomingMessage } from './messageHandler.js';
import fs from 'fs';

let sock;
let qrCodeStr = '';
let connectionStatus = 'disconnected';

export const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version, isLatest } = await fetchLatestBaileysVersion();
  
  logger.info(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true,
    auth: state,
    generateHighQualityLinkPreview: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      qrCodeStr = qr;
      logger.info('QR Code generated. Scan to connect.');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.error(`connection closed due to ${lastDisconnect?.error}, reconnecting: ${shouldReconnect}`);
      connectionStatus = 'disconnected';
      if (shouldReconnect) {
        connectToWhatsApp();
      } else {
        logger.error('Connection logged out. Please delete auth_info and scan QR again.');
        // Optionally delete auth_info folder here
        if (fs.existsSync('auth_info')) {
          fs.rmSync('auth_info', { recursive: true, force: true });
        }
      }
    } else if (connection === 'open') {
      logger.info('opened connection to WhatsApp');
      connectionStatus = 'connected';
      qrCodeStr = ''; // clear qr code once connected
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    if (m.type !== 'notify') return;
    for (const msg of m.messages) {
      if (!msg.key.fromMe && msg.message) {
        await handleIncomingMessage(sock, msg);
      }
    }
  });
};

export const sendMessage = async (jid, text) => {
  if (connectionStatus !== 'connected' || !sock) {
    throw new Error('WhatsApp client is not connected');
  }
  await sock.sendMessage(jid, { text });
};

export const sendBroadcast = async (jids, text) => {
  if (connectionStatus !== 'connected' || !sock) {
    throw new Error('WhatsApp client is not connected');
  }
  for (const jid of jids) {
    try {
      await sock.sendMessage(jid, { text });
      // Add delay to prevent ban
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      logger.error(`Failed to send broadcast to ${jid}:`, err);
    }
  }
};

export const getConnectionStatus = () => connectionStatus;
export const getQR = () => qrCodeStr;
