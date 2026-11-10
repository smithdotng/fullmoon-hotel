import { Fragment } from 'react';
import { requireAdminPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import Blog from '@/lib/models/Blog';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Manage Blog" };

export default async function Page() {
  const user = await requireAdminPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const blogs = plain(await Blog.find().sort({ createdAt: -1 }).lean());
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Manage Blog Posts
        </h1>
        <a href="/admin/blog/add" className="btn btn-primary">
          <i className="fa fa-plus me-1" />
          {' '}Add New Post
        </a>
      </div>
      
      {(messages.success) ? (<>
      
      <div className="alert alert-success alert-dismissible fade show" role="alert">
        {messages.success}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
       
      {(messages.error) ? (<>
      
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {messages.error}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                Title
              </th>
              <th>
                Category
              </th>
              <th>
                Author
              </th>
              <th>
                Status
              </th>
              <th>
                Featured
              </th>
              <th>
                Date
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            
      {(blogs && blogs.length > 0) ? (<>
       
      {(blogs || []).map((blog, __i) => (<Fragment key={__i}>
      
            <tr>
              <td>
                <strong>
                  {blog.title}
                </strong>
                {' '}
      {(blog.featured) ? (<>
      {' '}
                <span className="badge bg-warning ms-1">
                  Featured
                </span>
                {' '}
      </>) : null}
      
              </td>
              <td>
                {blog.category}
              </td>
              <td>
                {blog.author}
              </td>
              <td>
                <span className={`badge ${blog.published ? 'bg-success' : 'bg-secondary'}`}>
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>
                <span className={`badge ${blog.featured ? 'bg-warning' : 'bg-secondary'}`}>
                  {blog.featured ? 'Yes' : 'No'}
                </span>
              </td>
              <td>
                {new Date(blog.createdAt).toLocaleDateString()}
              </td>
              <td>
                <a href={`/blog/${blog.slug}`} target="_blank" className="btn btn-sm btn-outline-info">
                  <i className="fa fa-eye" />
                  {' '}View
                </a>
                {' '}
                <a href={`/admin/blog/edit/${blog._id}`} className="btn btn-sm btn-outline-primary">
                  <i className="fa fa-edit" />
                  {' '}Edit
                </a>
                <form action={`/admin/blog/delete/${blog._id}`} method="POST" className="d-inline">
                  <button type="submit" className="btn btn-sm btn-outline-danger" data-onclick="return confirm('Are you sure you want to delete this blog post?')">
                    <i className="fa fa-trash" />
                    {' '}Delete
                  </button>
                </form>
              </td>
            </tr>
            
      </Fragment>))}
       
      </>) : (<>
      
            <tr>
              <td colSpan="7" className="text-center">
                No blog posts found.{' '}
                <a href="/admin/blog/add">
                  Add your first blog post
                </a>
              </td>
            </tr>
            
      </>)}
      
          </tbody>
        </table>
      </div>
      
    </>
  );
}
