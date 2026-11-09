import { notFound } from 'next/navigation';
import dbConnect, { plain } from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { longDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

async function getPost(slug) {
  await dbConnect();
  return Blog.findOne({ slug, published: true }).lean();
}

export async function generateMetadata({ params }) {
  const blog = await getPost((await params).slug);
  if (!blog) return { title: 'Blog Post Not Found' };
  return {
    title: blog.metaTitle || `${blog.title} - Full Moon Hotels`,
    description: blog.metaDescription || blog.excerpt,
    openGraph: blog.featuredImage ? { images: [blog.featuredImage] } : undefined,
  };
}

// Posts are written by staff in the admin panel; plain text is turned into paragraphs,
// HTML is shown as written.
function Content({ text }) {
  if (/<\/?[a-z][\s\S]*>/i.test(text)) return <div className="text" dangerouslySetInnerHTML={{ __html: text }} />;
  return (
    <div className="text">
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getPost(slug);
  if (!blog) notFound();
  await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } });
  const related = plain(
    await Blog.find({ _id: { $ne: blog._id }, category: blog.category, published: true }).limit(3).select('title slug featuredImage createdAt').lean()
  );

  return (
    <section className="page">
      <div className="page-header" style={{ backgroundImage: `url(${blog.featuredImage || '/assets/images/header-1.jpg'})` }}>
        <div className="container">
          <h2 className="title">{blog.title}</h2>
          <p>
            {blog.category} · {longDate(blog.createdAt)}
          </p>
        </div>
      </div>
      <div className="image-blocks image-blocks-category">
        <div className="container">
          <div className="about">
            <div className="text-block">
              <div className="row">
                <div className="col-md-8 col-md-offset-2">
                  {blog.excerpt && (
                    <p>
                      <strong>{blog.excerpt}</strong>
                    </p>
                  )}
                  <Content text={blog.content} />
                  {blog.tags?.length > 0 && (
                    <p style={{ marginTop: 30 }}>
                      {blog.tags.map((t) => (
                        <a key={t} href={`/blog/tag/${encodeURIComponent(t)}`} className="btn btn-sm btn-clean-dark" style={{ marginRight: 8 }}>
                          #{t}
                        </a>
                      ))}
                    </p>
                  )}
                  <p style={{ marginTop: 30 }}>
                    <a href="/blog" className="btn btn-main">
                      ← Back to Blog
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="blog blog-category">
          <div className="container">
            <div className="row">
              {related.map((post) => (
                <div key={post._id} className="col-sm-4">
                  <a href={`/blog/${post.slug}`}>
                    <article>
                      <div className="image">
                        <img src={post.featuredImage || '/assets/images/activity-1.jpg'} alt={post.title} />
                      </div>
                      <div className="text">
                        <h2 className="h4 title">{post.title}</h2>
                      </div>
                    </article>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
