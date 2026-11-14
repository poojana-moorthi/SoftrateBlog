import express from 'express';
import mongoose from 'mongoose';
import Article from '../models/Article.js';
import Category from '../models/Category.js';
import { INITIAL_ARTICLES, INITIAL_CATEGORIES } from '../data/seedData.js';

const router = express.Router();

// In-memory store fallback when MongoDB is not connected
let memoryArticles = JSON.parse(JSON.stringify(INITIAL_ARTICLES));
let memoryCategories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));

// Helper: Check if MongoDB connection is open (1 = connected)
const isDbConnected = () => mongoose.connection.readyState === 1;

// --------------------------------------------------------------------------
// 1. PUBLIC: GET /api/articles (with category, search, and section filters)
// --------------------------------------------------------------------------
router.get('/articles', async (req, res) => {
  try {
    const { category, search, featured, section, limit } = req.query;

    if (isDbConnected()) {
      const query = { status: 'published' };

      if (category && category !== 'All') {
        query.category = category;
      }

      if (featured === 'true') {
        query.isFeatured = true;
      }

      if (section) {
        query.section = section;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      let queryExec = Article.find(query).sort({ publishedAt: -1 });
      if (limit) {
        queryExec = queryExec.limit(parseInt(limit, 10));
      }

      const articles = await queryExec.exec();
      return res.json({ success: true, count: articles.length, articles });
    }

    // In-memory fallback
    let filtered = memoryArticles.filter((a) => a.status === 'published');

    if (category && category !== 'All') {
      filtered = filtered.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      filtered = filtered.filter((a) => a.isFeatured);
    }

    if (section) {
      filtered = filtered.filter((a) => a.section === section);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(s) ||
          a.description.toLowerCase().includes(s) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(s)))
      );
    }

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit, 10));
    }

    res.json({ success: true, count: filtered.length, articles: filtered, source: 'memory' });
  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    res.status(500).json({ success: false, message: 'Server error fetching articles' });
  }
});

// --------------------------------------------------------------------------
// 2. PUBLIC: GET /api/articles/:slug (Single article)
// --------------------------------------------------------------------------
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (isDbConnected()) {
      const article = await Article.findOneAndUpdate(
        { slug, status: 'published' },
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }

      return res.json({ success: true, article });
    }

    // In-memory fallback
    const found = memoryArticles.find((a) => a.slug === slug);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    found.views = (found.views || 0) + 1;
    res.json({ success: true, article: found, source: 'memory' });
  } catch (error) {
    console.error('Error in GET /api/articles/:slug:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --------------------------------------------------------------------------
// 3. ADMIN: GET /api/admin/articles (All articles including drafts & scheduled)
// --------------------------------------------------------------------------
router.get('/admin/articles', async (req, res) => {
  try {
    if (isDbConnected()) {
      const articles = await Article.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: articles.length, articles });
    }

    res.json({ success: true, count: memoryArticles.length, articles: memoryArticles, source: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --------------------------------------------------------------------------
// 4. ADMIN: POST /api/articles (Create new article)
// --------------------------------------------------------------------------
router.post('/articles', async (req, res) => {
  try {
    const data = req.body;

    // Generate slug if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (isDbConnected()) {
      // Check for duplicate slug
      const existing = await Article.findOne({ slug: data.slug });
      if (existing) {
        data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
      }

      const newArticle = new Article(data);
      const saved = await newArticle.save();
      return res.status(201).json({ success: true, article: saved });
    }

    // In-memory fallback
    const newArt = {
      id: `art-${Date.now()}`,
      ...data,
      publishedAt: data.status === 'published' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryArticles.unshift(newArt);

    res.status(201).json({ success: true, article: newArt, source: 'memory' });
  } catch (error) {
    console.error('Error in POST /api/articles:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to create article' });
  }
});

// --------------------------------------------------------------------------
// 5. ADMIN: PUT /api/articles/:id (Update article)
// --------------------------------------------------------------------------
router.put('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDbConnected() && mongoose.isValidObjectId(id)) {
      const updated = await Article.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.json({ success: true, article: updated });
    }

    // In-memory fallback (match by id or slug)
    const index = memoryArticles.findIndex((a) => (a.id || a._id) === id || a.slug === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    memoryArticles[index] = { ...memoryArticles[index], ...updates, updatedAt: new Date().toISOString() };
    res.json({ success: true, article: memoryArticles[index], source: 'memory' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to update' });
  }
});

// --------------------------------------------------------------------------
// 6. ADMIN: DELETE /api/articles/:id (Delete article)
// --------------------------------------------------------------------------
router.delete('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.isValidObjectId(id)) {
      const deleted = await Article.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.json({ success: true, message: 'Article deleted successfully' });
    }

    // In-memory fallback
    const initLen = memoryArticles.length;
    memoryArticles = memoryArticles.filter((a) => (a.id || a._id) !== id && a.slug !== id);

    if (memoryArticles.length === initLen) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({ success: true, message: 'Article deleted successfully', source: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --------------------------------------------------------------------------
// 7. PUBLIC: GET /api/categories (List all categories)
// --------------------------------------------------------------------------
router.get('/categories', async (req, res) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find().sort({ count: -1 });
      return res.json({ success: true, categories });
    }

    res.json({ success: true, categories: memoryCategories, source: 'memory' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --------------------------------------------------------------------------
// 8. ADMIN: POST /api/admin/login (Admin authentication verification)
// --------------------------------------------------------------------------
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@softrate.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === adminEmail && password === adminPassword) {
    return res.json({
      success: true,
      message: 'Authenticated successfully',
      user: { email: adminEmail, role: 'admin', name: 'Softrate Administrator' },
      token: 'softrate_admin_session_token_' + Date.now()
    });
  }

  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

export default router;

