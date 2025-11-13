import { Request, Response } from "express";
import { createMeetup, getAllMeetups, getUserMeetups } from "../services/meetupService";
import { getSportByName } from "../services/sportService";
import { AuthenticatedRequest } from './userController';
import { SkillLevel } from "@prisma/client";

export const createMeetupController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("meetupController: createMeetupController Starting...");
    console.log("meetupController: Request body:", req.body);

    try {
        // Extract fields from frontend payload
        const {
            title,
            description,
            sport,
            sportIcon,
            sportColor,
            location,
            city,
            state,
            date,
            time,
            maxParticipants,
            skillLevel
        } = req.body;

        // Validate required fields
        if (!title || !sport || !location || !date || !time || !maxParticipants) {
            res.status(400).json({ message: 'Required fields: title, sport, location, date, time, maxParticipants' });
            return;
        }

        if (!req.user?.userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }

        const createdBy = req.user.userId;

        // Look up sport by name to get sportId
        const existingSport = await getSportByName(sport);

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
        const normalizedSkillLevel = (skillLevel?.toUpperCase() || 'ALL') as SkillLevel;

        // Create the meetup with all fields
        const meetup = await createMeetup(
            title,
            maxParticipants,
            existingSport.id,
            createdBy,
            scheduledAt,
            description,
            location,
            city,
            state,
            sportIcon,
            sportColor,
            normalizedSkillLevel
        );
        
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

export const getAllMeetupsController = async (req: Request, res: Response): Promise<void> => {
    console.log("meetupController: getAllMeetupsController Starting...");
    try {
        const meetups = await getAllMeetups();
        res.status(200).json(meetups);
    } catch (error) {
        console.error('meetupController: getAllMeetupsController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserMeetupsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("meetupController: getUserMeetupsController Starting...");
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }

        const meetups = await getUserMeetups(userId);
        res.status(200).json(meetups);
    } catch (error) {
        console.error('meetupController: getUserMeetupsController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}