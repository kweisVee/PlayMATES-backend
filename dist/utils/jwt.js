"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'your_super_secret_key'; // Replace with a strong secret key in production
// note: adding role to the token is optional, but it's a good practice to do so
// this is because we don't need to query the database to get the role of the user, we can just get it from the token
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, SECRET, {
        expiresIn: '7d', // token will expire in 7 days
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET);
};
exports.verifyToken = verifyToken;
