import { redirect } from 'next/navigation';
import { requireManagerPage } from '@/lib/auth';
import dbConnect, { isValidId } from '@/lib/db';
import Reservation from '@/lib/models/Reservation';
import { naira, shortDate, dateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Invoice' };

// Printable invoice (the Express app linked here but never had this view)
export default async function InvoicePage({ params }) {
  await requireManagerPage();
  const { id } = await params;
  if (!isValidId(id)) redirect('/admin/reservations');
  await dbConnect();
  const reservation = await Reservation.findById(id).populate('room', 'roomNumber type price');
  if (!reservation) redirect('/admin/reservations');
  if (!reservation.invoiceNumber) {
    reservation.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await reservation.save();
  }
  const r = reservation.toObject();
  const nights = r.nights || Math.ceil((r.checkOut - r.checkIn) / 86400000);
  const balance = Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0));

  return (
    <div className="card" style={{ maxWidth: 820, margin: '0 auto' }}>
      <style>{`@media print { .admin-sidebar, .no-print, .alert { display: none !important; } .admin-content { background: #fff !important; } }`}</style>
      <div className="card-body p-5">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <img src="/assets/images/logo-dark.png" alt="Full Moon Hotels" style={{ height: 60 }} />
            <p className="mt-2 mb-0 small text-muted">
              Plot H-1 Fullmoon Avenue, Housing Area C, New Owerri, Imo State
              <br />
              +234 (0) 812 313 9279 · reservations@fullmoon-hotels.com
            </p>
          </div>
          <div className="text-end">
            <h2 className="h4 mb-1">INVOICE</h2>
            <div className="small">#{r.invoiceNumber}</div>
            <div className="small text-muted">Issued {dateTime(new Date())}</div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-sm-6">
            <h6 className="text-muted">Billed to</h6>
            <strong>{r.guestName}</strong>
            <div>{r.guestEmail}</div>
            <div>{r.guestPhone}</div>
          </div>
          <div className="col-sm-6 text-sm-end">
            <h6 className="text-muted">Reservation</h6>
            <div>{r.confirmationCode || String(r._id)}</div>
            <div>
              {shortDate(r.checkIn)} – {shortDate(r.checkOut)}
            </div>
            <div>
              {r.guests} guest(s) · Room {r.room?.roomNumber || 'N/A'}
            </div>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-end">Rate</th>
              <th className="text-end">Qty</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{r.room?.type || 'Room'} (all-inclusive rate)</td>
              <td className="text-end">{naira(r.roomRate)}</td>
              <td className="text-end">{nights} night(s)</td>
              <td className="text-end">{naira(r.roomRate * nights)}</td>
            </tr>
            {r.extraCharges > 0 && (
              <tr>
                <td>Extra nights / late check-out</td>
                <td />
                <td className="text-end">{r.extraNights || ''}</td>
                <td className="text-end">{naira(r.extraCharges)}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3} className="text-end">Total</th>
              <th className="text-end">{naira(r.totalAmount)}</th>
            </tr>
            <tr>
              <td colSpan={3} className="text-end">Paid ({r.paymentStatus})</td>
              <td className="text-end">{naira(r.paidAmount)}</td>
            </tr>
            {r.refundAmount > 0 && (
              <tr>
                <td colSpan={3} className="text-end">Refunded</td>
                <td className="text-end">{naira(r.refundAmount)}</td>
              </tr>
            )}
            <tr>
              <th colSpan={3} className="text-end">Balance due</th>
              <th className="text-end">{naira(balance)}</th>
            </tr>
          </tfoot>
        </table>
        <p className="small text-muted mb-0">Rates include 7.5% VAT, 5% Consumption Tax, 10% service charge and breakfast.</p>
        <div className="mt-4 no-print d-flex gap-2">
          <button className="btn btn-primary" data-onclick="window.print()">
            <i className="fas fa-print me-2" />
            Print
          </button>
          <a href={`/admin/reservations/${r._id}`} className="btn btn-outline-secondary">
            Back to reservation
          </a>
        </div>
      </div>
    </div>
  );
}
