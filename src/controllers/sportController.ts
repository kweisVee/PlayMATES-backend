import { Request, Response } from 'express';
import { createSport } from '../services/sportService';
import { AuthenticatedRequest } from './userController'; // Assuming this is where the interface is defined

export const createSportController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("sportController: createSportController Starting...");
    try {
        const {name, definition} = req.body;

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

        const sport = await createSport(name, createdBy, definition);
        
        res.status(201).json({ message: 'Sport created successfully', sport });
    } catch (error) {
        console.error('sportController: createSportController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ message: 'Internal server error' });
    }
}