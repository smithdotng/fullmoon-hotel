const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, default: 'Administrator' },
  featuredImage: { type: String },
  images: [String],
  tags: [String],
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  metaTitle: { type: String },
  metaDescription: { type: String },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  }
  next();
});

// Alternative: Generate slug if not provided
blogSchema.pre('validate', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);