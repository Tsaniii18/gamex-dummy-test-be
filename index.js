import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import usersRoutes from './routes/users.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(cookieParser());
app.use(express.json());

// Sync database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Database sync error:', error);
  }
})();

// Routes
app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);
app.use('/users', usersRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));

// Export the app for testing purposes
//huan is here