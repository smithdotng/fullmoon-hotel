import PageScript from '@/components/PageScript';

export default function FacilityForm({ facility, title = facility ? 'Edit Facility' : 'Add New Facility' }) {
  const messages = {}; // flash messages are shown by the admin layout
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {title}
        </h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <a href="/admin/facilities-config" className="btn btn-sm btn-outline-secondary">
            <i className="fa fa-arrow-left me-1" />
            Back to Facilities
          </a>
        </div>
      </div>
      
      {(messages.error) ? (<>
      
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {messages.error}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            Facility Details
          </h5>
        </div>
        <div className="card-body">
          <form action={facility ? `/admin/facilities-config/update/${facility._id}` : '/admin/facilities-config/create'} method="POST" encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Facility Name *
                  </label>
                  {' '}
                  <input type="text" className="form-control" id="name" name="name" defaultValue={facility ? facility.name : ''} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Facility Type *
                  </label>
                  {' '}
                  <select className="form-select" id="type" name="type" required defaultValue={facility?.type ?? ''}>
                    <option value="">
                      Select Type
                    </option>
                    <option value="dining" >
                      Dining
                    </option>
                    <option value="wellness" >
                      Wellness
                    </option>
                    <option value="business" >
                      Business
                    </option>
                    <option value="recreation" >
                      Recreation
                    </option>
                    <option value="entertainment" >
                      Entertainment
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="shortDescription" className="form-label">
                Short Description
              </label>
              {' '}
              <textarea className="form-control" id="shortDescription" name="shortDescription" rows="2" maxLength="150" placeholder="Brief description (max 150 characters)" defaultValue={facility ? facility.shortDescription : ''} />
              <div className="form-text">
                This will be displayed in facility cards.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Full Description *
              </label>
              {' '}
              <textarea className="form-control" id="description" name="description" rows="4" required placeholder="Detailed description of the facility" defaultValue={facility ? facility.description : ''} />
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="capacity" className="form-label">
                    Capacity *
                  </label>
                  {' '}
                  <input type="number" className="form-control" id="capacity" name="capacity" defaultValue={facility ? facility.capacity : ''} min="1" required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="operatingHours" className="form-label">
                    Operating Hours *
                  </label>
                  {' '}
                  <input type="text" className="form-control" id="operatingHours" name="operatingHours" defaultValue={facility ? facility.operatingHours : ''} placeholder="e.g., 9:00 AM - 6:00 PM" required />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="pricePerHour" className="form-label">
                    Price per Hour (₦)
                  </label>
                  {' '}
                  <input type="number" className="form-control" id="pricePerHour" name="pricePerHour" defaultValue={facility ? facility.pricePerHour : '0'} min="0" step="0.01" />
                  <div className="form-text">
                    Set to 0 for free facilities
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  {' '}
                  <input type="text" className="form-control" id="location" name="location" defaultValue={facility ? facility.location : ''} placeholder="e.g., Ground Floor, West Wing" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Facility Image
                  </label>
                  {' '}
                  <input type="file" className="form-control" id="image" name="image" accept="image/*" />
                  {' '}
      {(facility && facility.image) ? (<>
      
                  <div className="mt-2">
                    <img src={facility.image} alt="Current image" style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "4px" }} />
                    <div className="form-text">
                      Current image
                    </div>
                  </div>
                  
      </>) : null}
      
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="amenities" className="form-label">
                    Amenities
                  </label>
                  {' '}
                  <textarea className="form-control" id="amenities" name="amenities" rows="3" placeholder="Enter amenities separated by commas" defaultValue={facility && facility.amenities ? facility.amenities.join(', ') : ''} />
                  <div className="form-text">
                    e.g., WiFi, Air Conditioning, Parking, etc.
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="rules" className="form-label">
                    Rules & Policies
                  </label>
                  {' '}
                  <textarea className="form-control" id="rules" name="rules" rows="3" placeholder="Enter rules separated by commas" defaultValue={facility && facility.rules ? facility.rules.join(', ') : ''} />
                  <div className="form-text">
                    e.g., No smoking, Reservation required, etc.
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="contactPhone" className="form-label">
                    Contact Phone
                  </label>
                  {' '}
                  <input type="tel" className="form-control" id="contactPhone" name="contactPhone" defaultValue={facility && facility.contactInfo ? facility.contactInfo.phone : ''} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="contactEmail" className="form-label">
                    Contact Email
                  </label>
                  {' '}
                  <input type="email" className="form-control" id="contactEmail" name="contactEmail" defaultValue={facility && facility.contactInfo ? facility.contactInfo.email : ''} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" id="bookable" name="bookable" value="true" defaultChecked={Boolean(facility && facility.bookable)} />
                  {' '}
                  <label className="form-check-label" htmlFor="bookable">
                    Bookable
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" id="requiresGuests" name="requiresGuests" value="true" defaultChecked={Boolean(facility && facility.requiresGuests)} />
                  {' '}
                  <label className="form-check-label" htmlFor="requiresGuests">
                    Requires Guests
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" id="featured" name="featured" value="true" defaultChecked={Boolean(facility && facility.featured)} />
                  {' '}
                  <label className="form-check-label" htmlFor="featured">
                    Featured
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" id="available" name="available" value="true" defaultChecked={Boolean(!facility || facility.available)} />
                  {' '}
                  <label className="form-check-label" htmlFor="available">
                    Available
                  </label>
                </div>
              </div>
            </div>
            <div className="row" id="guestsSection" style={{ display: facility && facility.requiresGuests ? 'block' : 'none' }}>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="maxGuests" className="form-label">
                    Maximum Guests
                  </label>
                  {' '}
                  <input type="number" className="form-control" id="maxGuests" name="maxGuests" defaultValue={facility ? facility.maxGuests : '1'} min="1" />
                  <div className="form-text">
                    Maximum number of guests allowed
                  </div>
                </div>
              </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <a href="/admin/facilities-config" className="btn btn-secondary me-md-2">
                Cancel
              </a>
              {' '}
              <button type="submit" className="btn btn-primary">
                {facility ? 'Update Facility' : 'Create Facility'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <PageScript kind="admin" src="/js/pages/admin_facility-form.js" />
    </>
  );
}
