import mongoose from 'mongoose';

export function slugify(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}

const blogSchema = new mongoose.Schema(
  {
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
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function (next) {
  if (!this.slug || this.isModified('title')) this.slug = slugify(this.title);
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
