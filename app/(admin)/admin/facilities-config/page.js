import { Fragment } from 'react';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import Facility from '@/lib/models/Facility';
import pageCss from '@/components/page-css/admin_facilities-config';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Manage Facilities" };

export default async function Page() {
  const user = await requireManagerPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const facilities = plain(await Facility.find().sort({ type: 1, name: 1 }).lean());
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Manage Facilities
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <a href="/admin/facilities-config/add" className="btn btn-sm btn-primary">
              <i className="fa fa-plus me-1" />
              Add New Facility
            </a>
            {' '}
            <a href="/admin/facilities" className="btn btn-sm btn-outline-secondary">
              <i className="fa fa-calendar me-1" />
              View Bookings
            </a>
            {' '}
            <a href="/admin" className="btn btn-sm btn-outline-dark">
              <i className="fa fa-dashboard me-1" />
              Dashboard
            </a>
          </div>
        </div>
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
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            All Facilities
          </h5>
        </div>
        <div className="card-body">
          
      {(facilities && facilities.length > 0) ? (<>
      
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>
                    Image
                  </th>
                  <th>
                    Name
                  </th>
                  <th>
                    Type
                  </th>
                  <th>
                    Capacity
                  </th>
                  <th>
                    Price
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Features
                  </th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                
      {(facilities || []).map((facility, __i) => (<Fragment key={__i}>
      
                <tr>
                  <td>
                    <img src={facility.image} alt={facility.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
                  </td>
                  <td>
                    <strong>
                      {facility.name}
                    </strong>
                    {' '}
                    <br />
                    {' '}
                    <small className="text-muted">
                      {facility.shortDescription || facility.description.slice(0, 50)}...
                    </small>
                  </td>
                  <td>
                    <span className={`badge 
                                          ${facility.type === 'dining' ? 'bg-primary' : 
                                              facility.type === 'wellness' ? 'bg-success' : 
                                              facility.type === 'business' ? 'bg-info' : 
                                              facility.type === 'recreation' ? 'bg-warning' : 'bg-secondary'}`}>
                      {facility.type}
                    </span>
                  </td>
                  <td>
                    {facility.capacity} people
                  </td>
                  <td>
                    
      {(facility.pricePerHour > 0) ? (<>
      {' '}
                    <strong>
                      ₦{facility.pricePerHour}
                    </strong>
                    /hour 
      </>) : (<>
      {' '}
                    <span className="text-muted">
                      Free
                    </span>
                    {' '}
      </>)}
      
                  </td>
                  <td>
                    <span className={`badge ${facility.available ? 'bg-success' : 'bg-danger'}`}>
                      {facility.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      
      {(facility.bookable) ? (<>
      {' '}
                      <span className="badge bg-primary" title="Bookable">
                        <i className="fa fa-calendar" />
                      </span>
                      {' '}
      </>) : null}
       
      {(facility.featured) ? (<>
      {' '}
                      <span className="badge bg-warning" title="Featured">
                        <i className="fa fa-star" />
                      </span>
                      {' '}
      </>) : null}
       
      {(facility.requiresGuests) ? (<>
      {' '}
                      <span className="badge bg-info" title="Requires Guests">
                        <i className="fa fa-users" />
                      </span>
                      {' '}
      </>) : null}
      
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <a href={`/admin/facilities-config/edit/${facility._id}`} className="btn btn-outline-primary">
                        <i className="fa fa-edit" />
                      </a>
                      <form action={`/admin/facilities-config/toggle-status/${facility._id}`} method="POST" className="d-inline">
                        <button type="submit" className={`btn ${facility.available ? 'btn-outline-warning' : 'btn-outline-success'}`} title={facility.available ? 'Deactivate' : 'Activate'}>
                          <i className={`fa ${facility.available ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </button>
                      </form>
                      <form action={`/admin/facilities-config/delete/${facility._id}`} method="POST" className="d-inline">
                        <button type="submit" className="btn btn-outline-danger" data-onclick="return confirm('Are you sure you want to delete this facility? This action cannot be undone.')">
                          <i className="fa fa-trash" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
                
      </Fragment>))}
      
              </tbody>
            </table>
          </div>
          
      </>) : (<>
      
          <div className="text-center py-5">
            <i className="fa fa-building fa-4x text-muted mb-3" />
            <h4 className="text-muted">
              No Facilities Configured
            </h4>
            <p className="text-muted">
              Get started by adding your first facility.
            </p>
            <a href="/admin/facilities-config/add" className="btn btn-primary">
              <i className="fa fa-plus me-2" />
              Add Your First Facility
            </a>
          </div>
          
      </>)}
      
        </div>
      </div>
      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h3 className="text-primary">
                {facilities ? facilities.length : 0}
              </h3>
              <p className="text-muted mb-0">
                Total Facilities
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h3 className="text-success">
                {facilities ? facilities.filter(f => f.available).length : 0}
              </h3>
              <p className="text-muted mb-0">
                Available
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h3 className="text-info">
                {facilities ? facilities.filter(f => f.bookable).length : 0}
              </h3>
              <p className="text-muted mb-0">
                Bookable
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h3 className="text-warning">
                {facilities ? facilities.filter(f => f.featured).length : 0}
              </h3>
              <p className="text-muted mb-0">
                Featured
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
