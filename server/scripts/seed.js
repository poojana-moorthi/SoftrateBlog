import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../models/Article.js';
import Category from '../models/Category.js';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from '../data/seedData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/softrate_blog';

async function seedDatabase() {
  try {
    console.log(`[SEED] Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('[SEED] Connected to MongoDB.');

    // 1. Clear existing documents
    await Article.deleteMany({});
    await Category.deleteMany({});
    console.log('[SEED] Cleared existing Articles and Categories.');

    // 2. Insert Categories
    const insertedCategories = await Category.insertMany(INITIAL_CATEGORIES);
    console.log(`[SEED] Inserted ${insertedCategories.length} categories.`);

    // 3. Insert Articles
    const insertedArticles = await Article.insertMany(INITIAL_ARTICLES);
    console.log(`[SEED] Inserted ${insertedArticles.length} articles.`);

    console.log('[SEED] Database seeding complete! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();

