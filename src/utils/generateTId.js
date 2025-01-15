import crypto from 'crypto';
export const generateTransactionId = () => {
  try {
    const randomBytes = crypto.randomBytes(15).toString('hex');
    const uniquePart = randomBytes.substring(0, 15).padEnd(15, '0');
    return `WITHDRAW${uniquePart}`;
  } catch (error) {
    throw new Error(`Failed to generate transaction ID: ${error.message}`);
  }
};
