import Reservation from './models/Reservation';
import Room from './models/Room';
import { plain } from './db';
import { ROOM_CAPACITY } from './rooms';
import { withReservationLabels } from './format';

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MISSING_ROOM = { roomNumber: 'N/A', type: 'Room removed', price: 0 };
const prep = (list) => plain(list).map((r) => withReservationLabels({ ...r, room: r.room || MISSING_ROOM }));

// Everything the admin reservations list shows (filters, today's movements, class occupancy, stats)
export async function loadReservationsAdmin(query) {
  const { status, payment, date, search, roomNumber, roomType } = query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (payment && payment !== 'all') filter.paymentStatus = payment;
  if (date) {
    const start = new Date(date);
    if (!isNaN(start)) {
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.checkIn = { $gte: start, $lt: end };
    }
  }
  if (roomNumber) {
    const room = await Room.findOne({ roomNumber: { $regex: escapeRegex(roomNumber), $options: 'i' } });
    filter.room = room ? room._id : null;
  }
  if (roomType && roomType !== 'all') {
    const rooms = await Room.find({ type: roomType }).select('_id');
    filter.room = { $in: rooms.map((r) => r._id) };
  }
  if (search) {
    const rx = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ guestName: rx }, { guestEmail: rx }, { guestPhone: rx }, { confirmationCode: rx }];
  }

  const reservations = await Reservation.find(filter).populate('room', 'roomNumber type price').sort({ createdAt: -1 }).lean();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const active = { $in: ['confirmed', 'checked-in'] };
  const todaysCheckIns = await Reservation.find({ checkIn: { $gte: today, $lt: tomorrow }, status: active }).populate('room', 'roomNumber type').lean();
  const todaysCheckOuts = await Reservation.find({ checkOut: { $gte: today, $lt: tomorrow }, status: active }).populate('room', 'roomNumber type').lean();
  const upcomingArrivals = await Reservation.find({ checkIn: { $gte: tomorrow, $lt: nextWeek }, status: { $in: ['confirmed', 'pending'] } })
    .populate('room', 'roomNumber type')
    .sort({ checkIn: 1 })
    .lean();

  // Class-based occupancy for tonight
  const tonight = await Reservation.find({ checkIn: { $lt: tomorrow }, checkOut: { $gt: today }, status: active }).populate('room', 'type').lean();
  const booked = Object.fromEntries(Object.keys(ROOM_CAPACITY).map((t) => [t, 0]));
  for (const r of tonight) if (r.room?.type && booked[r.room.type] !== undefined) booked[r.room.type]++;
  const availabilityByType = {};
  for (const [type, capacity] of Object.entries(ROOM_CAPACITY)) {
    const b = booked[type] || 0;
    availabilityByType[type] = { capacity, booked: b, available: Math.max(0, capacity - b), percentage: capacity > 0 ? Math.round((b / capacity) * 100) : 0 };
  }
  const occupiedRooms = Object.values(booked).reduce((a, b) => a + b, 0);
  const totalRooms = Object.values(ROOM_CAPACITY).reduce((a, b) => a + b, 0);

  const count = (q) => Reservation.countDocuments(q);
  const stats = {
    total: await count({}),
    pending: await count({ status: 'pending' }),
    confirmed: await count({ status: 'confirmed' }),
    cancelled: await count({ status: 'cancelled' }),
    checkedIn: await count({ status: 'checked-in' }),
    completed: await count({ status: 'completed' }),
    unpaid: await count({ paymentStatus: 'unpaid' }),
    paid: await count({ paymentStatus: 'paid' }),
    partiallyPaid: await count({ paymentStatus: 'partially-paid' }),
  };

  return {
    reservations: prep(reservations),
    todaysCheckIns: prep(todaysCheckIns),
    todaysCheckOuts: prep(todaysCheckOuts),
    upcomingArrivals: prep(upcomingArrivals),
    stats,
    occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
    occupiedRooms,
    totalRooms,
    availabilityByType,
    ROOM_CAPACITY,
  };
}
