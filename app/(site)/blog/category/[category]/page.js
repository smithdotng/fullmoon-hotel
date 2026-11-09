import BlogList from '@/components/BlogList';
import { getBlogListing } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const category = decodeURIComponent((await params).category);
  return { title: `${category} - Full Moon Hotels Blog` };
}

export default async function BlogCategoryPage({ params }) {
  const category = decodeURIComponent((await params).category);
  const data = await getBlogListing({ category });
  return <BlogList {...data} heading={category} subheading="Blog category" activeCategory={category} />;
}
