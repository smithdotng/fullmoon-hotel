// /robots.txt - public pages are crawlable; admin, API and booking-step pages are not
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/login', '/rooms/booking-confirmation', '/rooms/guest-reservation/', '/reservations/'] }],
  };
}
