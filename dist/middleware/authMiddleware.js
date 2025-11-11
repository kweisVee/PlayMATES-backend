"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
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
        const user = (0, jwt_1.verifyToken)(token);
        req.user = {
            userId: user.userId,
            role: user.role
        };
        console.log("authMiddleware: Successfully authenticated user:", user.userId);
        next();
    }
    catch (error) {
        console.log("authMiddleware: ERROR - Invalid token", error);
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
