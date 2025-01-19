import crypto from 'crypto';
export const generateTransactionId = (prefix = 'WITHDRAW') => {
  try {
    const randomBytes = crypto.randomBytes(15).toString('hex');
    const uniquePart = randomBytes.substring(0, 15).padEnd(15, '0');
    return `${prefix}${uniquePart}`;
  } catch (error) {
    throw new Error(`Failed to generate transaction ID: ${error.message}`);
  }
};
