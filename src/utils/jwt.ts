import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; // Replace with a strong secret key in production

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, {
    expiresIn: '7d', // token will expire in 7 days
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};