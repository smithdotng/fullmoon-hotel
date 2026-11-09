import Room from './models/Room';
import Reservation from './models/Reservation';

// Number of rooms the hotel has in each class. Every room type is booked as a
// class: a booking succeeds while fewer than this many overlap the dates.
export const ROOM_CAPACITY = {
  'Penthouse Double Suite': 1,
  'Penthouse Single Suite': 2,
  'Executive Room': 9,
  'Deluxe Room': 37,
  'Premiere Room': 20,
};

export const ROOM_TYPES = Object.keys(ROOM_CAPACITY);

// URL slug -> room type
export const CATEGORY_MAP = {
  premiere: 'Premiere Room',
  deluxe: 'Deluxe Room',
  executive: 'Executive Room',
  'penthouse-single': 'Penthouse Single Suite',
  'penthouse-double': 'Penthouse Double Suite',
  annex: 'Annex Room',
};

export const CATEGORY_OPTIONS = [
  { value: 'penthouse-double', label: 'Penthouse Double Suite' },
  { value: 'penthouse-single', label: 'Penthouse Single Suite' },
  { value: 'executive', label: 'Executive Room' },
  { value: 'deluxe', label: 'Deluxe Room' },
  { value: 'premiere', label: 'Premiere Room' },
];

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

// Accepts the theme datepicker's HTML value
// ("<span class='day'>9</span> <span class='month'>Nov</span> <span class='year'>2026</span>"),
// ISO "2026-11-09", or "9 Nov 2026". Returns a local-midnight Date or null.
export function parseBookingDate(input) {
  if (!input || typeof input !== 'string') return null;
  const day = input.match(/class=['"]?day['"]?>(\d+)</);
  const month = input.match(/class=['"]?month['"]?>([A-Za-z]+)</);
  const year = input.match(/class=['"]?year['"]?>(\d+)</);
  if (day && month && year) {
    const m = MONTHS[month[1].slice(0, 3).toLowerCase()];
    if (m !== undefined) return new Date(+year[1], m, +day[1]);
  }
  const clean = input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const iso = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const d = new Date(+iso[1], +iso[2] - 1, +iso[3]);
    return isNaN(d) ? null : d;
  }
  const parts = clean.split(' ');
  if (parts.length === 3) {
    let y = parseInt(parts[2], 10);
    if (y < 100) y += 2000;
    const m = MONTHS[parts[1].slice(0, 3).toLowerCase()];
    const d = parseInt(parts[0], 10);
    if (m !== undefined && d >= 1 && d <= 31 && !isNaN(y)) return new Date(y, m, d);
  }
  const parsed = new Date(clean);
  if (!isNaN(parsed)) return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  return null;
}

export function toISODate(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function nightsBetween(checkIn, checkOut) {
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
}

async function bookedCountsByType(checkInDate, checkOutDate) {
  const overlapping = await Reservation.find({
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
    status: { $ne: 'cancelled' },
  }).populate('room', 'type');
  const counts = Object.fromEntries(ROOM_TYPES.map((t) => [t, 0]));
  for (const r of overlapping) {
    const t = r.room?.type;
    if (t && counts[t] !== undefined) counts[t]++;
  }
  return counts;
}

// Rooms that can be booked for the dates (class capacity not yet reached), cheapest first
export async function getAvailableRooms(checkInDate, checkOutDate) {
  const allRooms = await Room.find({ available: true }).sort({ price: 1 });
  const booked = await bookedCountsByType(checkInDate, checkOutDate);
  return allRooms.filter((room) => (booked[room.type] || 0) < (ROOM_CAPACITY[room.type] || 0));
}

export async function canBookRoom(roomId, checkInDate, checkOutDate) {
  const room = await Room.findById(roomId);
  if (!room) return { canBook: false, reason: 'Room not found' };
  if (!room.available) return { canBook: false, reason: 'Room is not available' };
  const booked = await bookedCountsByType(checkInDate, checkOutDate);
  const capacity = ROOM_CAPACITY[room.type] || 0;
  if ((booked[room.type] || 0) >= capacity) {
    return { canBook: false, reason: `All ${room.type} rooms are booked for the selected dates.` };
  }
  return { canBook: true, room };
}

const FALLBACK_IMAGES = [
  ['Penthouse Single', '/assets/images/room-penthouse-single.jpg'],
  ['Penthouse Double', '/assets/images/room-penthouse-double.jpg'],
  ['Premiere', '/assets/images/room-premiere.jpg'],
  ['Deluxe', '/assets/images/room-deluxe.jpg'],
  ['Executive', '/assets/images/room-executive.jpg'],
];

export function fallbackImageFor(type = '') {
  const hit = FALLBACK_IMAGES.find(([k]) => type.includes(k));
  return hit ? hit[1] : '/assets/images/room-default.jpg';
}

export function normalizeImage(img) {
  if (!img) return '/assets/images/room-default.jpg';
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return '/uploads/rooms/' + img;
}

// Ensure room.images is a non-empty list of usable URLs
export function withImages(room) {
  const images = Array.isArray(room.images) && room.images.length ? room.images.map(normalizeImage) : [fallbackImageFor(room.type)];
  return { ...room, images };
}
