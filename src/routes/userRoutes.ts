import { Router } from 'express';
import { 
    createUserController, 
    getUsersController, 
    signInUserController 
} from '../controllers/userController';

const router = Router();

// Route for creating a new user
router.post('/users', createUserController);

// Route for fetching all users
router.get('/users', getUsersController);

// Route for signing in a user
router.post('/users/signin', signInUserController);

export default router;