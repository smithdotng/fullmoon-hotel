import { Fragment } from 'react';

export default function RoomForm({ room }) {
  const messages = {}; // flash messages are shown by the admin layout
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          {room ? 'Edit Room' : 'Add New Room'}
        </h1>
        <a href="/admin/rooms" className="btn btn-secondary">
          Back to Rooms
        </a>
      </div>
      
      {(messages.error) ? (<>
      
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {messages.error}{' '}
        <button type="button" className="btn-close" data-bs-dismiss="alert" />
      </div>
      
      </>) : null}
      
      <form action={room ? `/admin/rooms/update/${room._id}` : '/admin/rooms/create'} method="POST" encType="multipart/form-data" className="row g-3">
        <div className="col-md-6">
          <label htmlFor="roomNumber" className="form-label">
            Room Number *
          </label>
          {' '}
          <input type="text" className="form-control" id="roomNumber" name="roomNumber" defaultValue={room ? room.roomNumber : ''} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="type" className="form-label">
            Room Type *
          </label>
          {' '}
          <select className="form-select" id="type" name="type" required defaultValue={room?.type ?? ''}>
            <option value="">
              Select Room Type
            </option>
            <option value="Annex Room" >
              Annex Room
            </option>
            <option value="Premiere Room" >
              Premiere Room
            </option>
            <option value="Deluxe Room" >
              Deluxe Room
            </option>
            <option value="Executive Room" >
              Executive Room
            </option>
            <option value="Penthouse Single Suite" >
              Penthouse Single Suite
            </option>
            <option value="Penthouse Double Suite" >
              Penthouse Double Suite
            </option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="category" className="form-label">
            Category (URL Slug) *
          </label>
          {' '}
          <select className="form-select" id="category" name="category" required defaultValue={room?.category ?? ''}>
            <option value="">
              Select Category
            </option>
            <option value="premiere" >
              Premiere Room
            </option>
            <option value="deluxe" >
              Deluxe Room
            </option>
            <option value="executive" >
              Executive Room
            </option>
            <option value="penthouse-single" >
              Penthouse Single Suite
            </option>
            <option value="penthouse-double" >
              Penthouse Double Suite
            </option>
          </select>
          <div className="form-text">
            This is used for URL routing (e.g., /rooms/category/premiere)
          </div>
        </div>
        <div className="col-md-6">
          <label htmlFor="price" className="form-label">
            Price per Night (₦) *
          </label>
          {' '}
          <input type="number" className="form-control" id="price" name="price" defaultValue={room ? room.price : ''} step="0.01" min="0" required />
        </div>
        <div className="col-md-6">
          <label htmlFor="available" className="form-label">
            Availability
          </label>
          {' '}
          <select className="form-select" id="available" name="available" defaultValue={room && room.available === false ? 'false' : room && room.available ? 'true' : undefined}>
            <option value="true">
              Available
            </option>
            <option value="false">
              Occupied
            </option>
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          {' '}
          <textarea className="form-control" id="description" name="description" rows="3" defaultValue={room ? room.description : ''} />
        </div>
        <div className="col-12">
          <label htmlFor="amenities" className="form-label">
            Amenities (comma separated)
          </label>
          {' '}
          <input type="text" className="form-control" id="amenities" name="amenities" defaultValue={room ? (room.amenities || []).join(', ') : ''} placeholder="WiFi, Air Conditioning, TV, Mini Bar, etc." />
        </div>
        <div className="col-12">
          <label htmlFor="images" className="form-label">
            Room Images
          </label>
          {' '}
          <input type="file" className="form-control" id="images" name="images" multiple accept="image/*" />
          <div className="form-text">
            You can select multiple images. Maximum file size: 5MB each.
          </div>
          
      {(room && room.images && room.images.length > 0) ? (<>
      
          <div className="mt-3">
            <h6>
              Current Images:
            </h6>
            <div className="row">
              
      {(room.images || []).map((image, __i) => (<Fragment key={__i}>
      
              <div className="col-md-2 mb-2">
                <img src={image} className="img-thumbnail" style={{ height: "100px", objectFit: "cover" }} />
              </div>
              
      </Fragment>))}
      
            </div>
          </div>
          
      </>) : null}
      
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {room ? 'Update Room' : 'Create Room'}
          </button>
          {' '}
          <a href="/admin/rooms" className="btn btn-secondary">
            Cancel
          </a>
        </div>
      </form>
      
    </>
  );
}
