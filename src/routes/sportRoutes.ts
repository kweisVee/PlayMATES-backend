import { Router } from 'express';
import { createSportController, getAllSportsController } from '../controllers/sportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createSportController);
router.get('/', getAllSportsController);

export default router;