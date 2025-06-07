import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import sportRoutes from './routes/sportRoutes';

// for dotenv to work.
dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/sports', sportRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;