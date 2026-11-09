import dbConnect, { isValidId } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { guardAdmin } from '@/lib/auth';
import { readForm, flashRedirect } from '@/lib/http';
import { blogData } from '@/lib/admin-forms';
import { saveImages } from '@/lib/uploads';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request);
  if (response) return response;
  const { id } = await params;
  if (!isValidId(id)) return flashRedirect(request, '/admin/blog', 'error', 'Blog post not found');
  const body = await readForm(request);
  try {
    await dbConnect();
    const blog = await Blog.findById(id);
    if (!blog) return flashRedirect(request, '/admin/blog', 'error', 'Blog post not found');
    blog.set(blogData(body));
    const [image] = await saveImages(body.__formData, 'featuredImage', 'blog', 1);
    if (image) blog.featuredImage = image;
    await blog.save(); // keeps the slug in step with the title
    return flashRedirect(request, '/admin/blog', 'success', 'Blog post updated successfully');
  } catch (error) {
    console.error(error);
    return flashRedirect(request, `/admin/blog/edit/${id}`, 'error', 'Failed to update blog post: ' + error.message);
  }
}
