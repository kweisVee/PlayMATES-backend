import { Router } from 'express';
import { 
    createUserController, 
    getUsersController, 
    getUserProfileController,
    signInUserController 
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Route for creating a new user
router.post('/users', createUserController);

// Route for fetching all users
router.get('/users', getUsersController);

// Route for signing in a user
router.post('/users/signin', signInUserController);

// Route for fetching user's profile
router.get('/profile', authenticateToken, getUserProfileController);

export default router;