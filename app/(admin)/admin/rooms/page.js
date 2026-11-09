import { Fragment } from 'react';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { plain } from '@/lib/db';
import Room from '@/lib/models/Room';

export const dynamic = 'force-dynamic';
export const metadata = { title: "Manage Rooms" };

export default async function Page() {
  const user = await requireManagerPage();
  await dbConnect();
  const messages = {}; // flash messages are shown by the admin layout
  const rooms = plain(await Room.find().sort({ type: 1 }).lean());
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">
          Manage Rooms
        </h1>
        <a href="/admin/rooms/add" className="btn btn-primary">
          <i className="fa fa-plus me-1" />
          {' '}Add New Room
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
                Room Number
              </th>
              <th>
                Type
              </th>
              <th>
                Price
              </th>
              <th>
                Status
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            
      {(rooms && rooms.length > 0) ? (<>
       
      {(rooms || []).map((room, __i) => (<Fragment key={__i}>
      
            <tr>
              <td>
                {room.roomNumber}
              </td>
              <td>
                {room.type}
              </td>
              <td>
                ₦{room.price.toLocaleString()}
              </td>
              <td>
                <span className={`badge ${room.available ? 'bg-success' : 'bg-danger'}`}>
                  {room.available ? 'Available' : 'Occupied'}
                </span>
              </td>
              <td>
                <a href={`/admin/rooms/edit/${room._id}`} className="btn btn-sm btn-outline-primary">
                  <i className="fa fa-edit" />
                  {' '}Edit
                </a>
                <form action={`/admin/rooms/delete/${room._id}`} method="POST" className="d-inline">
                  <button type="submit" className="btn btn-sm btn-outline-danger" data-onclick="return confirm('Are you sure you want to delete this room?')">
                    <i className="fa fa-trash" />
                    {' '}Delete
                  </button>
                </form>
              </td>
            </tr>
            
      </Fragment>))}
       
      </>) : (<>
      
            <tr>
              <td colSpan="5" className="text-center">
                No rooms found.{' '}
                <a href="/admin/rooms/add">
                  Add your first room
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
