import { Router } from "express";
import { createMeetupController } from "../controllers/meetupController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createMeetupController);

export default router;