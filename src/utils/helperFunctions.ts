import * as crypto from 'crypto';
import env from '../config/environment.config';

const secretKey = env.app.encryptionKey;
if (!secretKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
}

const algorithm = 'aes-256-ctr';
const iv = Buffer.alloc(16, 0);

export const encryptionOfKey = (dataToEncrypt: string): string => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(dataToEncrypt, 'utf8'), cipher.final()]);
    return `${encrypted.toString('hex')}`;
};

export const apiKeyGenerator = (userId: string): string => {
    const prefix = `${userId.substring(0, 8)}`; // first 6 character of user ID for make it unique
    let randomPart = crypto.randomBytes(16).toString('hex'); // 32 character hex string
    randomPart = randomPart.match(/.{1,8}/g)?.join('-') || randomPart; // separated by - for readable format
    const rawApiKey = `${prefix}-${randomPart}`;

    const encryptedKey = encryptionOfKey(rawApiKey);
    return encryptedKey;
};

export const decryptionOfKey = (encryptedKey: string): string => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedKey, 'hex')), decipher.final()]);

    return decrypted.toString();
};

export const getIPv4 = (ip: string): string => {
  // Handle IPv4 address
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
    return ip;
  }
  
  // Handle IPv6 format that contains IPv4
  const ipv4Match = ip.match(/::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
  if (ipv4Match) {
    return ipv4Match[1];
  }

  return ip;
};
