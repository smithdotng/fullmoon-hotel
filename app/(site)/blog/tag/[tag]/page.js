import BlogList from '@/components/BlogList';
import { getBlogListing } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const tag = decodeURIComponent((await params).tag);
  return { title: `Posts tagged with "${tag}" - Full Moon Hotels Blog` };
}

export default async function BlogTagPage({ params }) {
  const tag = decodeURIComponent((await params).tag);
  const data = await getBlogListing({ tags: tag });
  return <BlogList {...data} heading={`#${tag}`} subheading="Posts tagged" />;
}
