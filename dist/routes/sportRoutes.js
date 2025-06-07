"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sportController_1 = require("../controllers/sportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticateToken, sportController_1.createSportController);
exports.default = router;
