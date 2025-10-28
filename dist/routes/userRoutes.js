"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Route for creating a new user
router.post('/', userController_1.createUserController);
// Route for fetching all users
router.get('/', userController_1.getUsersController);
// Route for signing in a user
router.post('/signin', userController_1.signInUserController);
// Route for signing out a user
router.post('/signout', userController_1.signOutUserController);
// Route for fetching user's profile
router.get('/profile', authMiddleware_1.authenticateToken, userController_1.getUserProfileController);
// Route for updating user's profile
router.put('/profile', authMiddleware_1.authenticateToken, userController_1.updateUserProfileController);
exports.default = router;
