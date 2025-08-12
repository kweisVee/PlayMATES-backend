import { Request, Response } from "express";
import { createMeetup } from "../services/meetupService";
import { getSport } from "../services/sportService";
import { AuthenticatedRequest } from './userController';
import { create } from "domain";

export const createMeetupController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("meetupController: createMeetupController Starting...");

    try {
        const {name, maxParticipants, sportId, scheduledAt, description, location} = req.body;
        if (!name || !maxParticipants || !sportId || !scheduledAt) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        if (!req.user?.userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }

        const createdBy = req.user.userId;
        const existingSport = await getSport(sportId);

        if (!existingSport) {
            res.status(404).json({ message: 'Sport not found' });
            return;
        }

        const meetup = await createMeetup(name, maxParticipants, sportId, createdBy, scheduledAt, description, location)
        
        res.status(201).json({
            message: 'Meetup created successfully',
            meetup: meetup
        });
    } catch (error) {
        console.error('meetupController: createMeetupController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }   
}