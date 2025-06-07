import { Router } from 'express';
import { createSportController } from '../controllers/sportController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createSportController);

export default router;