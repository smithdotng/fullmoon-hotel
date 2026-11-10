export const naira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
export const num = (n) => Number(n || 0).toLocaleString('en-NG');

const toDate = (d) => (d instanceof Date ? d : d ? new Date(d) : null);

// "Monday, November 9, 2026"
export function longDate(d) {
  const date = toDate(d);
  if (!date || isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// "9 Nov 2026"
export function shortDate(d) {
  const date = toDate(d);
  if (!date || isNaN(date)) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// "09/11/2026"
export function slashDate(d) {
  const date = toDate(d);
  if (!date || isNaN(date)) return '';
  return date.toLocaleDateString('en-GB');
}

// "9 Nov 2026, 14:05"
export function dateTime(d) {
  const date = toDate(d);
  if (!date || isNaN(date)) return '';
  return date.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// The computed date labels the original Reservation model exposed as virtuals
export function withReservationLabels(r) {
  if (!r) return r;
  const gb = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  return {
    ...r,
    formattedCheckIn: gb(r.checkIn),
    formattedCheckOut: gb(r.checkOut),
    formattedCreatedAt: r.createdAt
      ? new Date(r.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '',
    displayCheckIn: longDate(r.checkIn),
    displayCheckOut: longDate(r.checkOut),
    shortCheckIn: slashDate(r.checkIn),
    shortCheckOut: slashDate(r.checkOut),
  };
}
