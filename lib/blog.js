import dbConnect, { plain } from './db';
import Blog from './models/Blog';

export async function getBlogListing(filter = {}) {
  await dbConnect();
  const blogs = await Blog.find({ published: true, ...filter }).sort({ createdAt: -1 }).lean();
  const popularPosts = await Blog.find({ published: true }).sort({ views: -1 }).limit(5).select('title slug createdAt').lean();
  const categories = await Blog.distinct('category', { published: true });
  return { blogs: plain(blogs), popularPosts: plain(popularPosts), categories: categories.filter(Boolean).sort() };
}
