"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetupController_1 = require("../controllers/meetupController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authenticateToken, meetupController_1.createMeetupController);
exports.default = router;
