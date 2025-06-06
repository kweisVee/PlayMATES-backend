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
    console.log("userController: createUserController Starting...");
    try {
        const {firstName, lastName, username, email, password, city, state, country, role} = req.body;

        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const user = await createUser(firstName, lastName, username, email, password, city, state, country, role);
        const token = generateToken(user.id);
        res.status(200).json({
            message: 'User Created Successfully',
            token,
            user: user,
        });
    } catch (error) {
        console.error('userController: createUserController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get Users 
export const getUsersController = async (req: Request, res: Response): Promise<void> => {
    console.log("userController: getUsersController starting...");
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('userController: getUsersController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Sign In User
export const signInUserController = async (req: Request, res: Response): Promise<void> => {
    
    console.log("userController: signInUserController Starting...");
    
    const {email, password} = req.body;
    try {
        const user = await signInUser(email, password);
        
        if (!user || typeof user === 'string') {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id);

        res.status(200).json({
            token,
            user: user,
        });
    } catch (error) {
        console.error('userController: signInUserController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get User
export const getUserProfileController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("userController: getUserProfileController Starting...");
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
        console.error('userController: getUserProfileController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}