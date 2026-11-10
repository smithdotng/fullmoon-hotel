
export default function UserForm({ currentUser, user = currentUser, title = 'Add New Admin User' }) {
  const messages = {}; // flash messages are shown by the admin layout
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
                <a className="nav-link" href="/admin/users">
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
            <i className="bi bi-person-plus" />
            {' '}{title}
          </h1>
          <a href="/admin/users" className="btn btn-secondary">
            <i className="bi bi-arrow-left" />
            {' '}Back to Users
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
            <form method="POST" action="/admin/users/create">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Username *
                    </label>
                    {' '}
                    <input type="text" name="username" className="form-control" defaultValue={user ? user.username : ''} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Email *
                    </label>
                    {' '}
                    <input type="email" name="email" className="form-control" defaultValue={user ? user.email : ''} required />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Password *
                    </label>
                    {' '}
                    <input type="password" name="password" className="form-control" required />
                    {' '}
                    <small className="text-muted">
                      Minimum 6 characters
                    </small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Confirm Password *
                    </label>
                    {' '}
                    <input type="password" name="confirmPassword" className="form-control" required />
                  </div>
                </div>
              </div>
              {/* Add this section after the password fields in user-form.ejs */}
              
      {(currentUser.role === 'super-admin') ? (<>
      
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Role *
                    </label>
                    {' '}
                    <select name="role" className="form-select" required>
                      <option value="admin">
                        Admin
                      </option>
                      <option value="super-admin">
                        Super Admin
                      </option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Permissions
                    </label>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="canCreateUsers" value="true" id="canCreateUsers" />
                      {' '}
                      <label className="form-check-label" htmlFor="canCreateUsers">
                        Can create other users
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
      </>) : (<>
      {' '}
              <input type="hidden" name="role" value="admin" />
              {' '}
      </>)}
      
              <div className="alert alert-info">
                <i className="bi bi-info-circle" />
                {' '}This user will be created with full admin privileges.
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <a href="/admin/users" className="btn btn-secondary me-md-2">
                  Cancel
                </a>
                {' '}
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-save" />
                  {' '}Create Admin User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </>
  );
}
