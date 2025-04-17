import { Router } from 'express';
import { createUserController, getUsersController } from '../controllers/userController';

const router = Router();

// Route for creating a new user
router.post('/users', createUserController);

// Route for fetching all users
router.get('/users', getUsersController);

export default router;