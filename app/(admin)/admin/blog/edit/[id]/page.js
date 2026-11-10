import { redirect } from 'next/navigation';
import { requireAdminPage } from '@/lib/auth';
import dbConnect, { isValidId, plain } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import BlogForm from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit Blog Post' };

export default async function EditBlogPage({ params }) {
  await requireAdminPage();
  const { id } = await params;
  if (!isValidId(id)) redirect('/admin/blog');
  await dbConnect();
  const blog = plain(await Blog.findById(id).lean());
  if (!blog) redirect('/admin/blog');
  return <BlogForm blog={blog} />;
}
