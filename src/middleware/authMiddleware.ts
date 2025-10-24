import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    
    console.log("authMiddleware: authenticatToken Starting...");
    
    // Read token from cookie instead of Authorization header
    const token = req.cookies.token;

    console.log("authMiddleware: Token received from cookie:", token ? "present" : "missing");

    if (!token) {
        console.log("authMiddleware: ERROR - No token provided");
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    try {
        const user = verifyToken(token) as { userId: number };
        (req as AuthenticatedRequest).user = user;
        console.log("authMiddleware: Successfully authenticated user:", user.userId);
        next();
    } catch (error) {
        console.log("authMiddleware: ERROR - Invalid token", error);
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
}
