import { Request, Response } from "express";
import { createMeetup, 
        getAllMeetups, 
        getUserHostedMeetups, 
        getUserJoinedMeetups,
        getMeetup,
        updateMeetup
    } from "../services/meetupService";
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

        const userId = req.user.userId;

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
        // When creating, the creator is also the updater
        const meetup = await createMeetup(
            title,
            maxParticipants,
            existingSport.id,
            userId,
            scheduledAt,
            userId, // updatedBy: set to creator's ID on creation
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
        
        // Transform the data to match frontend expectations
        const transformedMeetups = meetups.map((meetup: any) => {
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
    } catch (error) {
        console.error('meetupController: getAllMeetupsController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserHostedMeetupsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("meetupController: getUserHostedMeetupsController Starting...");
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }

        const meetups = await getUserHostedMeetups(userId);
        
        // Transform the data to match frontend expectations
        const transformedMeetups = meetups.map((meetup: any) => {
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
    } catch (error) {
        console.error('meetupController: getUserHostedMeetupsController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserJoinedMeetupsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("meetupController: getUserJoinedMeetupsController Starting...");
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }

        const meetupParticipants = await getUserJoinedMeetups(userId);
        console.log("getUserJoinedMeetupsController: meetupParticipants: ", meetupParticipants);
        
        // Extract meetups from participants and transform the data to match frontend expectations
        const transformedMeetups = meetupParticipants.map((participant: any) => {
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
    } catch (error) {
        console.error('meetupController: getUserJoinedMeetupsController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMeetupController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

        const meetup = await getMeetup(meetupId);

        if (!meetup) {
            res.status(404).json({ message: 'Meetup not found' });
            return;
        }

        res.status(200).json(meetup);
    } catch (error) {
        console.error('meetupController: getMeetupController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateMeetupController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

        const existingMeetup = await getMeetup(meetupId);
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

        // Build update parameters
        let sportId: number | undefined;
        if (sport) {
            const existingSport = await getSportByName(sport);
            if (!existingSport) {
                res.status(404).json({ message: `Sport '${sport}' not found` });
                return;
            }
            sportId = existingSport.id;
        }

        // Combine date and time if both are provided
        let scheduledAt: Date | undefined;
        if (date && time) {
            scheduledAt = new Date(`${date}T${time}`);
            if (isNaN(scheduledAt.getTime())) {
                res.status(400).json({ message: 'Invalid date or time format' });
                return;
            }
        }

        // Normalize skillLevel if provided
        const normalizedSkillLevel = skillLevel 
            ? (skillLevel.toUpperCase() as SkillLevel)
            : undefined;

        // Call the service to update
        const updatedMeetup = await updateMeetup(
            meetupId,
            userId,  // updatedBy
            title,
            description,
            maxParticipants,
            sportId,
            scheduledAt,
            location,
            city,
            state,
            sportIcon,
            sportColor,
            normalizedSkillLevel
        );

        res.status(200).json({
            message: 'Meetup updated successfully',
            meetup: updatedMeetup
        });
    } catch (error) {
        console.error('meetupController: updateMeetupController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}