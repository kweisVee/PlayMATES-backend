"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveMeetupController = exports.joinMeetupController = exports.updateMeetupController = exports.getMeetupController = exports.getUserJoinedMeetupsController = exports.getUserHostedMeetupsController = exports.getAllMeetupsController = exports.createMeetupController = void 0;
const meetupService_1 = require("../services/meetupService");
const sportService_1 = require("../services/sportService");
const createMeetupController = async (req, res) => {
    console.log("meetupController: createMeetupController Starting...");
    console.log("meetupController: Request body:", req.body);
    try {
        // Extract fields from frontend payload
        const { title, description, sport, sportIcon, sportColor, location, city, state, date, time, maxParticipants, skillLevel } = req.body;
        // Validate required fields
        if (!title || !sport || !location || !date || !time || !maxParticipants) {
            res.status(400).json({ message: 'Required fields: title, sport, location, date, time, maxParticipants' });
            return;
        }
        if (!req.user?.userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const userId = req.user.userId;
        // Look up sport by name to get sportId
        const existingSport = await (0, sportService_1.getSportByName)(sport);
        if (!existingSport) {
            res.status(404).json({ message: `Sport '${sport}' not found` });
            return;
        }
        // Combine date and time into a DateTime object
        const scheduledAt = new Date(`${date}T${time}`);
        // Validate the date
        if (isNaN(scheduledAt.getTime())) {
            res.status(400).json({ message: 'Invalid date or time format' });
            return;
        }
        // Convert skillLevel to uppercase to match enum (frontend sends lowercase)
        const normalizedSkillLevel = (skillLevel?.toUpperCase() || 'ALL');
        // Create the meetup with all fields
        // When creating, the creator is also the updater
        const meetup = await (0, meetupService_1.createMeetup)(title, maxParticipants, existingSport.id, userId, scheduledAt, userId, // updatedBy: set to creator's ID on creation
        description, location, city, state, sportIcon, sportColor, normalizedSkillLevel);
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
const getAllMeetupsController = async (req, res) => {
    console.log("meetupController: getAllMeetupsController Starting...");
    try {
        const meetups = await (0, meetupService_1.getAllMeetups)();
        // Transform the data to match frontend expectations
        const transformedMeetups = meetups.map((meetup) => {
            const scheduledDate = new Date(meetup.scheduledAt);
            return {
                id: meetup.id.toString(),
                title: meetup.title,
                description: meetup.description || "",
                sport: meetup.sport?.name || "",
                sportIcon: meetup.sportIcon,
                sportColor: meetup.sportColor,
                hostId: meetup.createdBy.toString(),
                hostName: meetup.creator?.username || "",
                location: meetup.location || "",
                city: meetup.city || "",
                state: meetup.state || "",
                date: scheduledDate.toISOString().split('T')[0], // YYYY-MM-DD format
                time: scheduledDate.toTimeString().slice(0, 5), // HH:MM format
                maxParticipants: meetup.maxParticipants,
                currentParticipants: 1, // Default to 1 (the creator)
                skillLevel: meetup.skillLevel?.toLowerCase() || "all",
                status: "upcoming",
                createdAt: meetup.createdAt,
                updatedAt: meetup.updatedAt
            };
        });
        res.status(200).json(transformedMeetups);
    }
    catch (error) {
        console.error('meetupController: getAllMeetupsController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllMeetupsController = getAllMeetupsController;
const getUserHostedMeetupsController = async (req, res) => {
    console.log("meetupController: getUserHostedMeetupsController Starting...");
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const meetups = await (0, meetupService_1.getUserHostedMeetups)(userId);
        // Transform the data to match frontend expectations
        const transformedMeetups = meetups.map((meetup) => {
            const scheduledDate = new Date(meetup.scheduledAt);
            return {
                id: meetup.id.toString(),
                title: meetup.title,
                description: meetup.description || "",
                sport: meetup.sport?.name || "",
                sportIcon: meetup.sportIcon,
                sportColor: meetup.sportColor,
                hostId: meetup.createdBy.toString(),
                hostName: meetup.creator?.username || "",
                location: meetup.location || "",
                city: meetup.city || "",
                state: meetup.state || "",
                date: scheduledDate.toISOString().split('T')[0], // YYYY-MM-DD format
                time: scheduledDate.toTimeString().slice(0, 5), // HH:MM format
                maxParticipants: meetup.maxParticipants,
                currentParticipants: 1, // Default to 1 (the creator)
                skillLevel: meetup.skillLevel?.toLowerCase() || "all",
                status: "upcoming",
                createdAt: meetup.createdAt,
                updatedAt: meetup.updatedAt
            };
        });
        res.status(200).json(transformedMeetups);
    }
    catch (error) {
        console.error('meetupController: getUserHostedMeetupsController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserHostedMeetupsController = getUserHostedMeetupsController;
const getUserJoinedMeetupsController = async (req, res) => {
    console.log("meetupController: getUserJoinedMeetupsController Starting...");
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const meetupParticipants = await (0, meetupService_1.getUserJoinedMeetups)(userId);
        console.log("getUserJoinedMeetupsController: meetupParticipants: ", meetupParticipants);
        // Extract meetups from participants and transform the data to match frontend expectations
        const transformedMeetups = meetupParticipants.map((participant) => {
            const meetup = participant.meetup;
            const scheduledDate = new Date(meetup.scheduledAt);
            return {
                id: meetup.id.toString(),
                title: meetup.title,
                description: meetup.description || "",
                sport: meetup.sport?.name || "",
                sportIcon: meetup.sportIcon,
                sportColor: meetup.sportColor,
                hostId: meetup.createdBy.toString(),
                hostName: meetup.creator?.username || "",
                location: meetup.location || "",
                city: meetup.city || "",
                state: meetup.state || "",
                date: scheduledDate.toISOString().split('T')[0], // YYYY-MM-DD format
                time: scheduledDate.toTimeString().slice(0, 5), // HH:MM format
                maxParticipants: meetup.maxParticipants,
                currentParticipants: 1, // Default to 1 (the creator)
                skillLevel: meetup.skillLevel?.toLowerCase() || "all",
                status: "upcoming",
                createdAt: meetup.createdAt,
                updatedAt: meetup.updatedAt
            };
        });
        res.status(200).json(transformedMeetups);
    }
    catch (error) {
        console.error('meetupController: getUserJoinedMeetupsController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserJoinedMeetupsController = getUserJoinedMeetupsController;
const getMeetupController = async (req, res) => {
    console.log("meetupController: getMeetupController Starting...");
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const meetupId = parseInt(req.params.id);
        // Validate that meetupId is a valid number
        if (isNaN(meetupId) || meetupId <= 0) {
            res.status(400).json({ message: 'Invalid meetup ID' });
            return;
        }
        const meetup = await (0, meetupService_1.getMeetup)(meetupId);
        if (!meetup) {
            res.status(404).json({ message: 'Meetup not found' });
            return;
        }
        // Transform the data to match frontend expectations
        const scheduledDate = new Date(meetup.scheduledAt);
        const transformedMeetup = {
            id: meetup.id.toString(),
            title: meetup.title,
            description: meetup.description || "",
            sport: meetup.sport?.name || "",
            sportIcon: meetup.sportIcon,
            sportColor: meetup.sportColor,
            hostId: meetup.createdBy.toString(),
            hostName: meetup.creator?.username || "",
            location: meetup.location || "",
            city: meetup.city || "",
            state: meetup.state || "",
            date: scheduledDate.toISOString().split('T')[0], // YYYY-MM-DD format
            time: scheduledDate.toTimeString().slice(0, 5), // HH:MM format
            maxParticipants: meetup.maxParticipants,
            currentParticipants: meetup.participants?.length || 0,
            skillLevel: meetup.skillLevel?.toLowerCase() || "all",
            status: "upcoming",
            participants: meetup.participants?.map((participant) => ({
                id: participant.user.id.toString(),
                firstName: participant.user.firstName,
                lastName: participant.user.lastName,
                joinedAt: participant.joinedAt
            })) || [],
            createdAt: meetup.createdAt,
            updatedAt: meetup.updatedAt
        };
        res.status(200).json(transformedMeetup);
    }
    catch (error) {
        console.error('meetupController: getMeetupController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMeetupController = getMeetupController;
const updateMeetupController = async (req, res) => {
    console.log("meetupController: updateMeetupController Starting...");
    console.log("meetupController: Request body:", req.body);
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const meetupId = parseInt(req.params.id);
        if (isNaN(meetupId) || meetupId <= 0) {
            res.status(400).json({ message: 'Invalid meetup ID' });
            return;
        }
        const existingMeetup = await (0, meetupService_1.getMeetup)(meetupId);
        if (!existingMeetup) {
            res.status(404).json({ message: 'Meetup not found' });
            return;
        }
        // Authorization: Only the creator can update
        if (existingMeetup.createdBy !== userId) {
            res.status(403).json({ message: 'Forbidden. You can only update meetups you created.' });
            return;
        }
        // Extract fields from request body
        const { title, description, sport, sportIcon, sportColor, location, city, state, date, time, maxParticipants, skillLevel } = req.body;
        // Build update parameters
        let sportId;
        if (sport) {
            const existingSport = await (0, sportService_1.getSportByName)(sport);
            if (!existingSport) {
                res.status(404).json({ message: `Sport '${sport}' not found` });
                return;
            }
            sportId = existingSport.id;
        }
        // Combine date and time if both are provided
        let scheduledAt;
        if (date && time) {
            scheduledAt = new Date(`${date}T${time}`);
            if (isNaN(scheduledAt.getTime())) {
                res.status(400).json({ message: 'Invalid date or time format' });
                return;
            }
        }
        // Normalize skillLevel if provided
        const normalizedSkillLevel = skillLevel
            ? skillLevel.toUpperCase()
            : undefined;
        // Call the service to update
        const updatedMeetup = await (0, meetupService_1.updateMeetup)(meetupId, userId, // updatedBy
        title, description, maxParticipants, sportId, scheduledAt, location, city, state, sportIcon, sportColor, normalizedSkillLevel);
        res.status(200).json({
            message: 'Meetup updated successfully',
            meetup: updatedMeetup
        });
    }
    catch (error) {
        console.error('meetupController: updateMeetupController ERROR:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateMeetupController = updateMeetupController;
const joinMeetupController = async (req, res) => {
    console.log("meetupController: joinMeetupController Starting...");
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const meetupId = parseInt(req.params.id);
        if (isNaN(meetupId) || meetupId <= 0) {
            res.status(400).json({ message: 'Invalid meetup ID' });
            return;
        }
        const meetup = await (0, meetupService_1.joinMeetup)(meetupId, userId);
        res.status(200).json({
            message: 'Successfully joined meetup',
            meetup: meetup
        });
    }
    catch (error) {
        const errorMessage = error.message;
        console.error('meetupController: joinMeetupController ERROR:', {
            message: errorMessage,
            stack: error.stack,
        });
        // Handle specific error cases
        if (errorMessage.includes("not found")) {
            res.status(404).json({ message: errorMessage });
        }
        else if (errorMessage.includes("already a participant") || errorMessage.includes("full")) {
            res.status(400).json({ message: errorMessage });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.joinMeetupController = joinMeetupController;
const leaveMeetupController = async (req, res) => {
    console.log("meetupController: leaveMeetupController Starting...");
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }
        const meetupId = parseInt(req.params.id);
        if (isNaN(meetupId) || meetupId <= 0) {
            res.status(400).json({ message: 'Invalid meetup ID' });
            return;
        }
        const meetup = await (0, meetupService_1.leaveMeetup)(meetupId, userId);
        res.status(200).json({
            message: 'Successfully left meetup',
            meetup: meetup
        });
    }
    catch (error) {
        const errorMessage = error.message;
        console.error('meetupController: leaveMeetupController ERROR:', {
            message: errorMessage,
            stack: error.stack,
        });
        // Handle specific error cases
        if (errorMessage.includes("not found") || errorMessage.includes("not a participant")) {
            res.status(404).json({ message: errorMessage });
        }
        else if (errorMessage.includes("creators cannot leave")) {
            res.status(400).json({ message: errorMessage });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.leaveMeetupController = leaveMeetupController;
