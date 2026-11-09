# Full Moon Hotels — Next.js

Website, room booking and hotel management system for Full Moon Hotels, Owerri.
This is the Next.js (App Router) version of the original Express + EJS app. It
uses the same MongoDB database and collections, so it can be pointed at the
live data without a migration, and the public site keeps the existing Colina
theme, images and behaviour.

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in MONGODB_URI, SESSION_SECRET, email settings
npm run dev                     # http://localhost:3000
```

Production:

```bash
npm run build
npm start                       # PORT=3000 by default (next start -p 8080 to change)
```

Requires Node 18.18+.

### First admin account

```bash
npm run create-admin -- <username> <email> <password>
```

In development (not production) logging in as `superadmin` / `Admin@123` still
creates that super-admin automatically, as before.

`node scripts/seed-sample-rooms.mjs` adds one sample room per class for local testing.

## Environment

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (same database as the Express app) |
| `SESSION_SECRET` | 32+ character secret for the encrypted login cookie |
| `SITE_URL` | Public URL used in Open Graph tags |
| `UPLOAD_DIR` | Where admin uploads are stored (default `storage/uploads`) |
| `EMAIL_*`, `CONTACT_EMAIL`, `GYM_ENQUIRY_EMAIL` | SMTP settings, unchanged from before |

## How it is organised

```
app/
  (site)/            public site — root layout with the theme header/footer
    page.js          home
    rooms/...        listing, categories, room detail, availability, booking flow
    facilities/ gym/ laundry/ gallery/ about/ contact/ blog/ privacy-policy/ login/
    */route.js       form handlers (check availability, book, contact, gym, subscribe…)
  (admin)/admin/     admin panel — its own root layout (Bootstrap 5 sidebar)
    */route.js       admin actions (create/update/delete, check-in/out, payments…)
  api/               JSON endpoints (login, subscriber list)
  uploads/[...path]  serves admin-uploaded images
lib/                 database, models, sessions, flash messages, email, booking rules
components/          layout pieces, admin forms, page CSS carried over from the EJS views
public/              theme CSS/JS/fonts/images (unchanged) + public/js/pages/* page scripts
storage/uploads/     uploaded room/blog/facility images
```

### Theme scripts

The jQuery theme (owl carousel, datepicker, magnific popup, guest picker) is
loaded once the page has hydrated (`components/theme-loader.js`), and each
page's original inline script lives in `public/js/pages/`. Site links are plain
`<a>` tags so every page is a full load and the theme initialises exactly as it
did on the Express site.

### Uploads

Next.js only serves files that were in `public/` at build time, so uploads are
written to `storage/uploads` (or `UPLOAD_DIR`) and served by
`app/uploads/[...path]/route.js` at the same `/uploads/...` URLs as before.
Keep that folder on persistent disk (and outside the deploy directory if your
deploy wipes it). This needs a server with a writable disk — a VPS / `next start`,
not a read-only serverless host.

## Changes from the Express version

URLs are the same except:

- Search results now live at `GET /rooms/availability?...` (the booking widget still
  posts to `/rooms/check-availability`, which redirects there).
- The login form posts to `/api/auth/login`.
- Admin "create" forms post to `/admin/<thing>/create`.

Fixes made while porting:

- Admin-only subscriber endpoints (`/subscribe/export`, `/subscribe/stats`,
  `/subscribe/bulk`, `/api/subscribers`) now require an admin login; the
  unauthenticated `/subscribe/clear` (delete-all) endpoint was removed.
- Reservation confirmation codes (FMH-…) are now saved, so they appear in emails
  and admin search; the email shows the booked room type instead of always "Deluxe Room".
- Booking errors are shown on `/rooms` (they were set but never displayed).
- The guest reservation page shows its confirmation message and has one footer.
- Room detail page header image fixed (broken quoting meant it never loaded).
- Blog list and posts are driven by the database (the list was an unfinished
  theme placeholder and post pages had no view).
- Facility bookings are saved and show up under Admin → Facility Bookings.
- Admin links that pointed at missing pages now work: subscriber CSV export,
  invoice, user activate/deactivate, room assignment, and the payment/status forms
  on the reservation details page.
- Check-out late-stay charges use the right fields (previously always zero).
- User-supplied text in notification emails is HTML-escaped.

Not carried over: debug routes (`/debug-*`, `/test-*`), the `/register` page (its
view never existed), and the unused cab/menu/manage-reservations code.
