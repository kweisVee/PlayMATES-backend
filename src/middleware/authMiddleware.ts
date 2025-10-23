import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    
    console.log("authMiddleware: authenticatToken Starting...");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("authMiddleware: Token received:", token);

    if (!token) {
        console.log("authMiddleware: ERROR - No token provided");
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const user = verifyToken(token) as { userId: number };
        (req as AuthenticatedRequest).user = user;
        next();
        console.log("authMiddleware: Successfully exiting - calling next()");
    } catch (error) {
        console.log("authMiddleware: ERROR - Invalid token", error);
        res.status(403).json({ message: 'Invalid token.' });
        return;
    }
}
