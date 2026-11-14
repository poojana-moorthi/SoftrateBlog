import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'URL slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Article summary/description is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Article content body is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    author: {
      name: { type: String, default: 'Softrate Editorial Team' },
      role: { type: String, default: 'Technology Specialist' },
      avatar: { type: String, default: '' }
    },
    imageUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'published'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isSecondaryFeatured: {
      type: Boolean,
      default: false
    },
    section: {
      type: String,
      enum: ['featured', 'general', 'latest', 'trends', 'general-updates', 'product-updates'],
      default: 'general'
    },
    readTime: {
      type: String,
      default: '5 min read'
    },
    views: {
      type: Number,
      default: 0
    },
    tableOfContents: [
      {
        id: String,
        text: String
      }
    ],
    scheduledDate: {
      type: Date
    },
    seoTitle: {
      type: String
    },
    metaDescription: {
      type: String
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexing for search performance
ArticleSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });
ArticleSchema.index({ category: 1, status: 1 });

const Article = mongoose.model('Article', ArticleSchema);
export default Article;
