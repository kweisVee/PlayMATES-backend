"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sportController_1 = require("../controllers/sportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Route for creating a meetup
router.post('/', authMiddleware_1.authenticateToken, sportController_1.createSportController);
// Route for getting all sports
router.get('/', sportController_1.getAllSportsController);
exports.default = router;
