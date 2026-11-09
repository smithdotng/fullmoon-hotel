import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';
import { blogData } from '@/lib/admin-forms';
import { saveImages } from '@/lib/uploads';

export async function POST(request) {
  const { response } = await guardAdmin(request);
  if (response) return response;
  const body = await readForm(request);
  try {
    await dbConnect();
    const data = blogData(body);
    const [image] = await saveImages(body.__formData, 'featuredImage', 'blog', 1);
    if (image) data.featuredImage = image;
    await new Blog(data).save();
    return flashRedirect(request, '/admin/blog', 'success', 'Blog post created successfully');
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/blog/add', 'error', 'Failed to create blog post: ' + error.message);
  }
}
