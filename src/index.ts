import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { versionMiddleware } from './middleware/versionMiddleware';
import userRoutes from './routes/userRoutes';
import sportRoutes from './routes/sportRoutes';
import meetupRoutes from './routes/meetupRoutes';

// for dotenv to work.
dotenv.config();

const app = express();

// Add CORS configuration BEFORE your routes
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow cookies/credentials if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api-version', 'X-Requested-With']
}));

app.use(express.json());

// Apply versioning middleware to all API routes
app.use('/api', versionMiddleware);

app.use('/api/user', userRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/meetups', meetupRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;