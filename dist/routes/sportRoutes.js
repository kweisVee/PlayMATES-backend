"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sportController_1 = require("../controllers/sportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticateToken, sportController_1.createSportController);
router.get('/', sportController_1.getAllSportsController);
exports.default = router;
