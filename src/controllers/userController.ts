import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt';
import { 
    createUser, 
    getUsers,
    getUserProfile,
    signInUser
} from '../services/userService';

export interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

// Create User 
export const createUserController = async (req: Request, res: Response): Promise<void> => {
    console.log("createUserController starting...");
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
    console.log("getUsersController starting...");
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}

// Sign In User
export const signInUserController = async (req: Request, res: Response): Promise<void> => {
    console.log("signInUserController starting...");
    const {email, password} = req.body;
    try {
        const user = await signInUser(email, password);
        
        if (!user || typeof user === 'string') {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id);

        res.status(200).json({
        message: 'Sign-in successful',
        token,
        user: user,
        });
    } catch (error) {
        res.status(500).json({ error: 'Invalid Credentials' });
    }
}

// Get User
export const getUserProfileController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("getUserProfileController starting...");
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
          }

        const user = await getUserProfile(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
}