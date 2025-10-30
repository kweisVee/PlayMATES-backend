import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; // Replace with a strong secret key in production

// note: adding role to the token is optional, but it's a good practice to do so
// this is because we don't need to query the database to get the role of the user, we can just get it from the token
export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, SECRET, {
    expiresIn: '7d', // token will expire in 7 days
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};