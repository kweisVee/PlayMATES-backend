import { Router } from 'express';
import { createSportController, getAllSportsController } from '../controllers/sportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Route for creating a meetup
router.post('/', authenticateToken, createSportController);

// Route for getting all sports
router.get('/', getAllSportsController);

export default router;