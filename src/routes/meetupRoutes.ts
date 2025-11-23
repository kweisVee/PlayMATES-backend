import { Router } from "express";
import { createMeetupController, 
        getAllMeetupsController, 
        getUserMeetupsController,
        getMeetupController 
    } from "../controllers/meetupController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Route for creating a meetup
router.post("/", authenticateToken, createMeetupController);

// Route for getting all meetups
router.get("/", getAllMeetupsController);

// Route for getting all user meetups
router.get('/user', authenticateToken, getUserMeetupsController);

// Route for getting a specific meetup
router.get("/:id", authenticateToken, getMeetupController);
export default router;