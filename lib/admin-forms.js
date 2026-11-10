// Turn admin form fields into model data (same rules as the Express routes)
const list = (v) => (v ? String(v).split(',').map((x) => x.trim()).filter(Boolean) : []);

export function roomData(body) {
  return {
    roomNumber: body.roomNumber,
    type: body.type,
    category: body.category,
    price: parseFloat(body.price),
    description: body.description || '',
    amenities: list(body.amenities),
    available: body.available === 'true',
    floor: body.floor || '',
    maxGuests: parseInt(body.maxGuests) || 2,
  };
}

export function blogData(body) {
  return {
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    category: body.category,
    tags: list(body.tags),
    published: body.published === 'true',
    featured: body.featured === 'true',
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
  };
}

export function facilityData(body) {
  const data = {
    name: body.name,
    type: body.type,
    description: body.description,
    shortDescription: body.shortDescription,
    capacity: parseInt(body.capacity),
    operatingHours: body.operatingHours,
    pricePerHour: parseFloat(body.pricePerHour) || 0,
    requiresGuests: body.requiresGuests === 'true',
    maxGuests: parseInt(body.maxGuests) || 1,
    bookable: body.bookable === 'true',
    featured: body.featured === 'true',
    available: body.available === 'true',
    location: body.location,
    contactInfo: { phone: body.contactPhone, email: body.contactEmail },
  };
  if (body.amenities) data.amenities = list(body.amenities);
  if (body.rules) data.rules = list(body.rules);
  return data;
}
