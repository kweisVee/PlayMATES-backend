"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSportsController = exports.createSportController = void 0;
const sportService_1 = require("../services/sportService");
const createSportController = async (req, res) => {
    console.log("sportController: createSportController Starting...");
    try {
        const { name, definition, imageUrl, category, isActive } = req.body;
        // CHECK IF USER IS admin
        if (!name) {
            res.status(400).json({ message: 'Sport name is required' });
            return;
        }
        if (!req.user?.userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        if (req.user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Unauthorized. Only admins can create sports.' });
            return;
        }
        const createdBy = req.user.userId;
        // Ensure isActive is a boolean if provided, default to true
        /**
            {
                "name": "Tennis",
                "isActive": "yes"  // ← Wrong type, now defaults to true
            }
         */
        const isActiveBool = typeof isActive === 'boolean' ? isActive : true;
        const sport = await (0, sportService_1.createSport)(name, createdBy, definition, imageUrl, category, isActiveBool);
        res.status(201).json({ message: 'Sport created successfully', sport });
    }
    catch (error) {
        console.error('sportController: createSportController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createSportController = createSportController;
const getAllSportsController = async (req, res) => {
    console.log("sportController: getAllSportsController Starting...");
    try {
        const sports = await (0, sportService_1.getAllSports)();
        res.status(200).json(sports);
    }
    catch (error) {
        console.error('sportController: getAllSportsController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllSportsController = getAllSportsController;
