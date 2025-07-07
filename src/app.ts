import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes'; // Import user routes

const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Basic route for testing
// API routes
app.use('/api/v1/auth', authRoutes);

// API routes
app.use('/api/v1/users', userRoutes); // Use user routes

app.get('/', (req, res) => {
  res.send('School Management Backend API is running!');
});

// Error handling middleware
app.use(errorHandler);

export default app;