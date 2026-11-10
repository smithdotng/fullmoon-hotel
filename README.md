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
| `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA keys for the contact form |
| `RECAPTCHA_VERSION` | `v3` (invisible, default) or `v2` (checkbox) — must match the key type |
| `RECAPTCHA_MIN_SCORE` | v3 only: lowest score accepted (default `0.5`) |

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
  api/uploads/       serves disk uploads on self-hosted servers
lib/                 database, models, sessions, flash messages, email, booking rules
components/          layout pieces, admin forms, page CSS carried over from the EJS views
public/              theme CSS/JS/fonts/images (unchanged) + public/js/pages/* page scripts
public/uploads/      images uploaded before the move to Next.js
storage/uploads/     new uploads when self-hosting (git-ignored)
```

### Theme scripts

The jQuery theme (owl carousel, datepicker, magnific popup, guest picker) is
loaded once the page has hydrated (`components/theme-loader.js`), and each
page's original inline script lives in `public/js/pages/`. Site links are plain
`<a>` tags so every page is a full load and the theme initialises exactly as it
did on the Express site.

### Uploads

- **On Vercel** add a Blob store (Project → Storage → Blob). Vercel then sets
  `BLOB_READ_WRITE_TOKEN` and new admin uploads go to Vercel Blob; the full Blob
  URL is saved on the room/blog/facility.
- **Self-hosted** (`next start` on a VPS): without that token uploads are written
  to `storage/uploads` (or `UPLOAD_DIR`) and served at `/uploads/...` by
  `app/api/uploads/[...path]/route.js`. Keep that folder on persistent disk.
- Images uploaded before the Next.js move ship in `public/uploads`, so their
  existing `/uploads/...` URLs keep working either way.

## Deploying to Vercel

1. Vercel → **Add New → Project** → import `smithdotng/fullmoon-hotel`
   (framework is detected as Next.js; no build settings to change).
   To deploy before merging, set the production branch to `nextjs`, or merge the PR first.
2. **Environment variables**: `MONGODB_URI`, `SESSION_SECRET` (32+ chars), `SITE_URL`,
   the `EMAIL_*` / `CONTACT_EMAIL` / `GYM_ENQUIRY_EMAIL` values and the `RECAPTCHA_*`
   values from `.env.example`.
3. **Storage → Create → Blob**, connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
4. MongoDB must accept connections from Vercel: with Atlas, allow `0.0.0.0/0`
   under Network Access (Vercel has no fixed IPs on standard plans).
5. Deploy, then add the domain under **Settings → Domains**.

### Contact form protection

The contact form checks Google reCAPTCHA on the server before any email is sent,
and also has a hidden honeypot field and length limits. Messages that fail are
refused with a friendly error and the visitor's text is kept in the form. If the
reCAPTCHA keys are missing the form still works (a warning is logged), so set them
in every environment where the form should be protected.

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
