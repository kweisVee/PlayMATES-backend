import { Router } from 'express';
import { 
    createUserController, 
    getUsersController, 
    getUserProfileController,
    updateUserProfileController,
    signInUserController,
    signOutUserController
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Route for creating a new user
router.post('/', createUserController);

// Route for fetching all users
router.get('/', getUsersController);

// Route for signing in a user
router.post('/signin', signInUserController);

// Route for signing out a user
router.post('/signout', signOutUserController);

// Route for fetching user's profile
router.get('/profile', authenticateToken, getUserProfileController);

// Route for updating user's profile
router.put('/profile', authenticateToken, updateUserProfileController);

export default router;