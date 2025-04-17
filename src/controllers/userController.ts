import { Request, Response } from 'express';
import { createUser, getUsers } from '../services/userService';

// Create User 
export const createUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const {firstName, lastName, username, email, password, city, country} = req.body;

        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const user = await createUser(firstName, lastName, username, email, password, city, country);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
}

// Get Users 
export const getUsersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}