// Blog listing in the theme's "blog-category" layout (the original view was an
// unfinished copy of the theme template; this is the same markup fed from the database).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function DateParts({ date }) {
  const d = new Date(date);
  return (
    <div className="time">
      <span>{String(d.getDate()).padStart(2, '0')}</span> <span>{String(d.getMonth() + 1).padStart(2, '0')}</span>{' '}
      <span>{d.getFullYear()}</span>
    </div>
  );
}

export default function BlogList({ heading = 'Blog', subheading = 'Events & culture', blogs, popularPosts, categories, activeCategory }) {
  return (
    <section className="page">
      <div className="page-header" style={{ backgroundImage: 'url(/assets/images/header-1.jpg)' }}>
        <div className="container">
          <h2 className="title">{heading}</h2>
          <p>{subheading}</p>
        </div>
      </div>
      <div className="blog blog-category">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-9">
              <div className="row">
                {blogs.length === 0 && (
                  <div className="col-sm-12">
                    <p className="text-muted" style={{ padding: '40px 0' }}>
                      No posts have been published yet. Please check back soon.
                    </p>
                  </div>
                )}
                {blogs.map((blog, i) => (
                  <div key={blog._id} className={i < 2 ? 'col-sm-6 col-md-6' : 'col-sm-6 col-md-4'}>
                    <a href={`/blog/${blog.slug}`}>
                      <article>
                        <div className="image">
                          <img src={blog.featuredImage || '/assets/images/activity-1.jpg'} alt={blog.title} />
                        </div>
                        <div className="text">
                          <DateParts date={blog.createdAt} />
                          <h2 className="h4 title">{blog.title}</h2>
                        </div>
                      </article>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-sm-4 col-md-3">
              <aside>
                <div className="booking booking-default-theme">
                  <div className="booking-wrapper">
                    <h5>Check availability</h5>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12">
                        <a href="/rooms" className="btn btn-clean">
                          Book now <small>Best Prices Guaranteed</small>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {categories.length > 0 && (
                  <div className="box box-categories">
                    <h4 className="title">Blog categories</h4>
                    <ul>
                      {categories.map((c) => (
                        <li key={c} className={c === activeCategory ? 'active' : undefined}>
                          <a href={`/blog/category/${encodeURIComponent(c)}`}>{c}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {popularPosts.length > 0 && (
                  <div className="box box-posts">
                    <h4 className="title">Popular posts</h4>
                    <ul>
                      {popularPosts.map((post) => {
                        const d = new Date(post.createdAt);
                        return (
                          <li key={post._id}>
                            <a href={`/blog/${post.slug}`}>
                              <span className="date">
                                <span>{MONTHS[d.getMonth()]}</span> <span>{d.getDate()}</span>
                              </span>
                              <span className="text">{post.title}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
