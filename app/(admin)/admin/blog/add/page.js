import { requireAdminPage } from '@/lib/auth';
import BlogForm from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Add New Blog Post' };

export default async function AddBlogPage() {
  await requireAdminPage();
  return <BlogForm blog={null} />;
}
