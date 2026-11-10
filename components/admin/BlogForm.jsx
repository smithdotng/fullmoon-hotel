
export default function BlogForm({ blog }) {
  const messages = {}; // flash messages are shown by the admin layout
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {blog ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h1>
        <a href="/admin/blog" className="btn btn-secondary">
          Back to Blog
        </a>
      </div>
      
      {(messages.error) ? (<>
      
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {messages.error}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
      
      <form action={blog ? `/admin/blog/update/${blog._id}` : '/admin/blog/create'} method="POST" encType="multipart/form-data" className="row g-3">
        <div className="col-12">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          {' '}
          <input type="text" className="form-control" id="title" name="title" defaultValue={blog ? blog.title : ''} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="category" className="form-label">
            Category *
          </label>
          {' '}
          <select className="form-select" id="category" name="category" required defaultValue={blog?.category ?? ''}>
            <option value="">
              Select Category
            </option>
            <option value="Hotel News" >
              Hotel News
            </option>
            <option value="Travel Tips" >
              Travel Tips
            </option>
            <option value="Local Attractions" >
              Local Attractions
            </option>
            <option value="Business Travel" >
              Business Travel
            </option>
            <option value="Special Offers" >
              Special Offers
            </option>
            <option value="Events" >
              Events
            </option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          {' '}
          <input type="text" className="form-control" id="author" name="author" defaultValue={blog ? blog.author : 'Administrator'} />
        </div>
        <div className="col-12">
          <label htmlFor="excerpt" className="form-label">
            Excerpt
          </label>
          {' '}
          <textarea className="form-control" id="excerpt" name="excerpt" rows="3" placeholder="Brief description of the blog post" defaultValue={blog ? blog.excerpt : ''} />
        </div>
        <div className="col-12">
          <label htmlFor="content" className="form-label">
            Content *
          </label>
          {' '}
          <textarea className="form-control" id="content" name="content" rows="10" required placeholder="Full blog post content" defaultValue={blog ? blog.content : ''} />
        </div>
        <div className="col-12">
          <label htmlFor="tags" className="form-label">
            Tags (comma separated)
          </label>
          {' '}
          <input type="text" className="form-control" id="tags" name="tags" defaultValue={blog ? (blog.tags || []).join(', ') : ''} placeholder="travel, hotel, luxury, business, etc." />
        </div>
        <div className="col-12">
          <label htmlFor="featuredImage" className="form-label">
            Featured Image
          </label>
          {' '}
          <input type="file" className="form-control" id="featuredImage" name="featuredImage" accept="image/*" />
          <div className="form-text">
            Recommended size: 1200x630px. Maximum file size: 5MB.
          </div>
          
      {(blog && blog.featuredImage) ? (<>
      
          <div className="mt-3">
            <h6>
              Current Featured Image:
            </h6>
            <img src={blog.featuredImage} className="img-thumbnail" style={{ maxHeight: "200px" }} />
          </div>
          
      </>) : null}
      
        </div>
        <div className="col-md-6">
          <label htmlFor="published" className="form-label">
            Status
          </label>
          {' '}
          <select className="form-select" id="published" name="published" defaultValue={blog && blog.published === false ? 'false' : blog && blog.published ? 'true' : undefined}>
            <option value="true">
              Published
            </option>
            <option value="false">
              Draft
            </option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="featured" className="form-label">
            Featured Post
          </label>
          {' '}
          <select className="form-select" id="featured" name="featured" defaultValue={blog && blog.featured === false ? 'false' : blog && blog.featured ? 'true' : undefined}>
            <option value="false">
              No
            </option>
            <option value="true">
              Yes
            </option>
          </select>
        </div>
        <div className="col-12">
          <h5>
            SEO Settings
          </h5>
        </div>
        <div className="col-12">
          <label htmlFor="metaTitle" className="form-label">
            Meta Title
          </label>
          {' '}
          <input type="text" className="form-control" id="metaTitle" name="metaTitle" defaultValue={blog ? blog.metaTitle : ''} placeholder="Optional - defaults to blog title" />
        </div>
        <div className="col-12">
          <label htmlFor="metaDescription" className="form-label">
            Meta Description
          </label>
          {' '}
          <textarea className="form-control" id="metaDescription" name="metaDescription" rows="3" placeholder="Optional - brief description for search engines" defaultValue={blog ? blog.metaDescription : ''} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {blog ? 'Update Blog Post' : 'Create Blog Post'}
          </button>
          {' '}
          <a href="/admin/blog" className="btn btn-secondary">
            Cancel
          </a>
        </div>
      </form>
      
    </>
  );
}
