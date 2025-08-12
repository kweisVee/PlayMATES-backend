"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeetupController = void 0;
const meetupService_1 = require("../services/meetupService");
const sportService_1 = require("../services/sportService");
const createMeetupController = async (req, res) => {
    console.log("meetupController: createMeetupController Starting...");
    try {
        const { name, maxParticipants, sportId, scheduledAt, description, location } = req.body;
        if (!name || !maxParticipants || !sportId || !scheduledAt) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        if (!req.user?.userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const createdBy = req.user.userId;
        const existingSport = await (0, sportService_1.getSport)(sportId);
        if (!existingSport) {
            res.status(404).json({ message: 'Sport not found' });
            return;
        }
        const meetup = await (0, meetupService_1.createMeetup)(name, maxParticipants, sportId, createdBy, scheduledAt, description, location);
        res.status(201).json({
            message: 'Meetup created successfully',
            meetup: meetup
        });
    }
    catch (error) {
        console.error('meetupController: createMeetupController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createMeetupController = createMeetupController;
