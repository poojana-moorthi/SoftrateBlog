import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import articleRoutes from './routes/articleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/softrate_blog';

// CORS — allow Vercel frontend + localhost dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.ALLOWED_ORIGIN, // set this to your Vercel URL in Render dashboard
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' })); // Allow larger payloads for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', articleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Softrate Blog API is running.', endpoints: ['/api/articles', '/api/health'] });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully`);
  })
  .catch((err) => {
    console.warn(`[MongoDB Warning] Could not connect: ${err.message}`);
    console.warn(`[MongoDB Tip] Running in resilient in-memory mode.`);
  });

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Softrate Blog API listening on port ${PORT}`);
  console.log(`====================================================`);
});
