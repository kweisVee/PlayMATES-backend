import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { 
    createUser, 
    getUsers,
    getUserProfile,
    updateUserProfile,
    signInUser
} from '../services/userService';


// Create User 
export const createUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("userController: createUserController Starting...");
    console.log("userController: API Version:", req.apiVersion);
    try {
        console.log("userController: createUserController req.body:", req.body);
        const {firstName, lastName, username, email, password, city, state, country, role} = req.body;

        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const user = await createUser(firstName, lastName, username, email, password, city, state, country, role);
        const token = generateToken(user.id, user.role);
        
        // Set token as httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,      // JavaScript cannot access this cookie
            secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
            sameSite: 'strict',  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: '/',           // Cookie available on all routes
        });
        
        res.status(201).json({
            message: 'User Created Successfully',
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
export const getUsersController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("userController: getUsersController starting...");
    console.log("userController: API Version:", req.apiVersion);
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
export const signInUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    
    console.log("userController: signInUserController Starting...");
    console.log("userController: API Version:", req.apiVersion);
    
    const {email, password} = req.body;
    try {
        const user = await signInUser(email, password);
        
        if (!user || typeof user === 'string') {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id, user.role);

        // Set token as httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,      // JavaScript cannot access this cookie
            secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
            sameSite: 'strict',  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: '/',           // Cookie available on all routes
        });

        res.status(200).json({
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

// Update User Profile
export const updateUserProfileController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("userController: updateUserProfileController Starting...");
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized. No user ID found.' });
            return;
        }

        const { firstName, lastName, city, state, country, role } = req.body;

        const updatedUser = await updateUserProfile(userId, {
            firstName,
            lastName,
            city,
            state,
            country,
            role,
        });

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('userController: updateUserProfileController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Sign Out User
export const signOutUserController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("userController: signOutUserController Starting...");
    try {
        // Clear the cookie by setting it to empty with immediate expiration
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0), // Expire immediately
            path: '/',
        });

        res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
        console.error('userController: signOutUserController ERROR:', {
            message: (error as Error).message,
            stack: (error as Error).stack,
        });
        res.status(500).json({ error: 'Internal server error' });
    }
}