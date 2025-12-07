import { Router } from "express";
import { createMeetupController, 
        getAllMeetupsController, 
        getUserHostedMeetupsController,
        getUserJoinedMeetupsController,
        getMeetupController,
        updateMeetupController
    } from "../controllers/meetupController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Route for creating a meetup
router.post("/", authenticateToken, createMeetupController);

// Route for getting all meetups
router.get("/", getAllMeetupsController);

// Route for getting all user meetups
router.get('/user/hosted', authenticateToken, getUserHostedMeetupsController);

// Route for getting all user joined meetups
router.get('/user/joined', authenticateToken, getUserJoinedMeetupsController);

// Route for updating a meetup (MUST be before /:id route)
router.put("/:id", authenticateToken, updateMeetupController);

// Route for getting a specific meetup
router.get("/:id", authenticateToken, getMeetupController);
export default router;