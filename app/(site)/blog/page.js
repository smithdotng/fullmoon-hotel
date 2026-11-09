import BlogList from '@/components/BlogList';
import { getBlogListing } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog - Full Moon Hotels' };

export default async function BlogPage() {
  const data = await getBlogListing();
  return <BlogList {...data} />;
}
