"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSportController = void 0;
const sportService_1 = require("../services/sportService");
const createSportController = async (req, res) => {
    console.log("sportController: createSportController Starting...");
    try {
        const { name, definition } = req.body;
        // CHECK IF USER IS AUTHENTICATED
        if (!name) {
            res.status(400).json({ message: 'Sport name is required' });
            return;
        }
        if (!req.user?.userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const createdBy = req.user.userId;
        const sport = await (0, sportService_1.createSport)(name, createdBy, definition);
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
