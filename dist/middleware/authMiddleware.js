"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }
    try {
        const user = (0, jwt_1.verifyToken)(token);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
