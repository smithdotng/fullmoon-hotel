import dbConnect, { isValidId } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { guardAdmin } from '@/lib/auth';
import { flashRedirect } from '@/lib/http';

export async function POST(request, { params }) {
  const { response } = await guardAdmin(request);
  if (response) return response;
  const { id } = await params;
  try {
    if (isValidId(id)) {
      await dbConnect();
      await Blog.findByIdAndDelete(id);
    }
    return flashRedirect(request, '/admin/blog', 'success', 'Blog post deleted successfully');
  } catch (error) {
    console.error(error);
    return flashRedirect(request, '/admin/blog', 'error', 'Failed to delete blog post');
  }
}
