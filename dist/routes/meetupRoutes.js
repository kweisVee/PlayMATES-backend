"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetupController_1 = require("../controllers/meetupController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Route for creating a meetup
router.post("/", authMiddleware_1.authenticateToken, meetupController_1.createMeetupController);
// Route for getting all meetups
router.get("/", meetupController_1.getAllMeetupsController);
// Route for getting all user meetups
router.get('/user/hosted', authMiddleware_1.authenticateToken, meetupController_1.getUserHostedMeetupsController);
// Route for getting all user joined meetups
router.get('/user/joined', authMiddleware_1.authenticateToken, meetupController_1.getUserJoinedMeetupsController);
// Route for updating a meetup (MUST be before /:id route)
router.put("/:id", authMiddleware_1.authenticateToken, meetupController_1.updateMeetupController);
// Route for joining a meetup (MUST be before /:id route)
router.post("/:id/join", authMiddleware_1.authenticateToken, meetupController_1.joinMeetupController);
// Route for leaving a meetup (MUST be before /:id route)
router.post("/:id/leave", authMiddleware_1.authenticateToken, meetupController_1.leaveMeetupController);
// Route for getting a specific meetup
router.get("/:id", authMiddleware_1.authenticateToken, meetupController_1.getMeetupController);
exports.default = router;
