import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'CivicSecure Prototype API is running',
        mode: 'PROTOTYPE',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 CivicSecure Prototype Server running on port ${PORT}`);
    console.log(`📝 Mode: PROTOTYPE (Mock Authentication)`);
    console.log(`🔧 MongoDB: ${process.env.MONGODB_URI}`);
});
