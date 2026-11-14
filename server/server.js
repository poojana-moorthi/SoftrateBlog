import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import articleRoutes from './routes/articleRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/softrate_blog';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', articleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1
  });
});

// Serve React frontend build (for production on Railway)
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// All non-API routes → serve React app (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.warn(`[MongoDB Warning] Could not connect to local MongoDB (${err.message}).`);
    console.warn(`[MongoDB Tip] The API is running in resilient in-memory mode so the frontend works immediately.`);
    console.warn(`[MongoDB Tip] To connect to MongoDB, ensure mongod is running locally or provide a MONGO_URI in server/.env.`);
  });

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Softrate Blog API Server listening on port ${PORT}`);
  console.log(`🔗 REST API endpoints: http://localhost:${PORT}/api/articles`);
  console.log(`====================================================`);
});

