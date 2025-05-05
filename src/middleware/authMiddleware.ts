import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const user = verifyToken(token) as { userId: number };
        (req as AuthenticatedRequest).user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
        return;
    }
}
