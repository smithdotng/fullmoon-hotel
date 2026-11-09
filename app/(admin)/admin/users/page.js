import { Fragment } from 'react';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Manage Admin Users" };

export default async function Page() {
  const user = await requireManagerPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const users = plain(await User.find().select('-password').sort({ createdAt: -1 }).lean());
  const currentUserId = user._id;
  return (
    <>
      {/* Include your admin navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin">
            Full Moon Hotels Admin
          </a>
          {' '}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/admin">
                  <i className="bi bi-speedometer2" />
                  {' '}Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/admin/users">
                  <i className="bi bi-people" />
                  {' '}Users
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/reservations">
                  <i className="bi bi-calendar-check" />
                  {' '}Reservations
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/rooms">
                  <i className="bi bi-house-door" />
                  {' '}Rooms
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/facilities">
                  <i className="bi bi-building" />
                  {' '}Facilities
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admin/blog">
                  <i className="bi bi-newspaper" />
                  {' '}Blog
                </a>
              </li>
            </ul>
            <span className="navbar-text">
              Welcome, {user.username} |{' '}
              <a href="/logout" className="text-white">
                <i className="bi bi-box-arrow-right" />
                {' '}Logout
              </a>
            </span>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">
            <i className="bi bi-people" />
            {' '}Manage Admin Users
          </h1>
          <a href="/admin/users/add" className="btn btn-primary">
            <i className="bi bi-plus-circle" />
            {' '}Add New Admin
          </a>
        </div>
        
      {(messages && messages.error) ? (<>
      
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {messages.error}{' '}
          <button type="button" className="btn-close" data-bs-dismiss="alert" />
        </div>
        
      </>) : null}
       
      {(messages && messages.success) ? (<>
      
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {messages.success}{' '}
          <button type="button" className="btn-close" data-bs-dismiss="alert" />
        </div>
        
      </>) : null}
      
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      Username
                    </th>
                    <th>
                      Email
                    </th>
                    <th>
                      Role
                    </th>
                    <th>
                      Permissions
                    </th>
                    <th>
                      Status
                    </th>
                    <th>
                      Created
                    </th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  
      {(users || []).map((user, __i) => (<Fragment key={__i}>
      
                  <tr>
                    <td>
                      <strong>
                        {user.username}
                      </strong>
                      {' '}
      {(user._id.toString() === currentUserId.toString()) ? (<>
      {' '}
                      <span className="badge bg-info ms-1">
                        You
                      </span>
                      {' '}
      </>) : null}
      
                    </td>
                    <td>
                      {user.email}
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'super-admin' ? 'bg-danger' : user.role === 'admin' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      
      {(user.canCreateUsers) ? (<>
      {' '}
                      <span className="badge bg-warning">
                        Can Create Users
                      </span>
                      {' '}
      </>) : (<>
      {' '}
                      <span className="badge bg-secondary">
                        Standard
                      </span>
                      {' '}
      </>)}
      
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <a href={`/admin/users/edit/${user._id}`} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-pencil" />
                          {' '}Edit
                        </a>
                        {' '}
      {(user._id.toString() !== currentUserId.toString()) ? (<>
      
                        <form method="POST" action={`/admin/users/toggle-status/${user._id}`} style={{ display: "inline" }}>
                          <button type="submit" className={`btn btn-sm ${user.isActive ? 'btn-outline-warning' : 'btn-outline-success'} ms-1`}>
                            <i className={`bi ${user.isActive ? 'bi-person-x' : 'bi-person-check'}`} />
                            {' '}{user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </form>
                        <form method="POST" action={`/admin/users/delete/${user._id}`} style={{ display: "inline" }}>
                          <button type="submit" className="btn btn-sm btn-outline-danger ms-1" data-onclick="return confirm('Are you sure you want to delete this user?')">
                            <i className="bi bi-trash" />
                            {' '}Delete
                          </button>
                        </form>
                        
      </>) : (<>
      {' '}
                        <a href="/admin/profile" className="btn btn-sm btn-outline-info ms-1">
                          <i className="bi bi-person" />
                          {' '}Profile
                        </a>
                        {' '}
      </>)}
      
                      </div>
                    </td>
                  </tr>
                  
      </Fragment>))}
      
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
