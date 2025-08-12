"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUser = exports.getUserProfile = exports.getUsers = exports.createUser = void 0;
const db_1 = __importDefault(require("../utils/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (firstName, lastName, username, email, role, password, city, state, country) => {
    console.log("userService: createUser starting...");
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await db_1.default.user.create({
        data: {
            firstName,
            lastName,
            username,
            email,
            role: role === 'ADMIN' ? 'ADMIN' : 'USER',
            password: hashedPassword,
            city,
            state,
            country
        }
    });
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        city: user.city,
        state: user.state,
        country: user.country,
        createdAt: user.createdAt,
    };
};
exports.createUser = createUser;
const getUsers = async () => {
    return await db_1.default.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            city: true,
            country: true,
            createdAt: true,
        },
    });
};
exports.getUsers = getUsers;
const getUserProfile = async (userId) => {
    console.log("userService: getUserProfile Starting...");
    return await db_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            city: true,
            state: true,
            country: true,
            createdAt: true,
        },
    });
};
exports.getUserProfile = getUserProfile;
const signInUser = async (email, password) => {
    console.log("userService: signInUser starting...");
    const user = await db_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        return 'Invalid Credentials';
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return 'Invalid Credentials';
    }
    else {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            city: user.city,
            state: user.state,
            country: user.country,
            createdAt: user.createdAt,
        };
    }
};
exports.signInUser = signInUser;
