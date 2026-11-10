import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ThemeScripts from '@/components/ThemeScripts';
import PageScript from '@/components/PageScript';
import FlashClear from '@/components/FlashClear';
import layoutCss from '@/components/site-layout-css';
import { SITE_SCRIPTS } from '@/components/theme-scripts';

// Accepts "fullmoon-hotels.com" or "https://fullmoon-hotels.com"; a bad value must
// never break the build, so it falls back to the default.
function siteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return 'https://fullmoon-hotels.com';
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    console.warn(`SITE_URL "${raw}" is not a valid address; using https://fullmoon-hotels.com`);
    return 'https://fullmoon-hotels.com';
  }
}
const SITE_URL = siteUrl(process.env.SITE_URL);
const DEFAULT_TITLE = 'Full Moon Hotels - Luxury Accommodation in Owerri';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: 'Luxury hotel in Owerri with premium amenities',
  authors: [{ name: 'Full Moon Hotels' }],
  applicationName: 'Full Moon Hotels',
  manifest: '/site.webmanifest',
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: 'Full Moon', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description:
      'Experience luxury at Full Moon Hotels Owerri. Premium rooms, fine dining, spa, and exceptional service in the heart of Imo State.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Full Moon Hotels',
    locale: 'en_US',
    images: [{ url: 'https://found.ng/12.jpg', width: 1200, height: 630, alt: DEFAULT_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: 'Experience luxury at Full Moon Hotels Owerri. Premium rooms, fine dining, spa, and exceptional service.',
    images: ['https://found.ng/12.jpg'],
    site: '@fullmoonhotels',
    creator: '@fullmoonhotels',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1a365d',
    'msapplication-tap-highlight': 'no',
    'business:contact_data:street_address': 'Plot H-1 Fullmoon Avenue, Housing Area C, New Owerri',
    'business:contact_data:locality': 'Owerri',
    'business:contact_data:region': 'Imo State',
    'business:contact_data:postal_code': '460721',
    'business:contact_data:country_name': 'Nigeria',
    'place:location:latitude': '5.4833',
    'place:location:longitude': '7.0333',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a365d',
};

const THEME_CSS = [
  'bootstrap.css',
  'animate.css',
  'font-awesome.css',
  'linear-icons.css',
  'hotel-icons.css',
  'magnific-popup.css',
  'owl.carousel.css',
  'datepicker.css',
  'theme.css',
];

// Mobile menu behaviour from the original layout
const MENU_SCRIPT = `
$(document).ready(function() {
  const $nav = $('.navigation-block');
  const $overlay = $('.mobile-overlay');
  const close = function() { $nav.removeClass('open'); $overlay.removeClass('active'); $('body').removeClass('menu-open'); };
  $('.toggle-menu').on('click', function() { $nav.addClass('open'); $overlay.addClass('active'); $('body').addClass('menu-open'); });
  $('.mobile-menu-close').on('click', close);
  $overlay.on('click', close);
  $('.navigation-block .open-dropdown').on('click', function(e) { e.preventDefault(); e.stopPropagation(); $(this).closest('li').toggleClass('expanded'); });
  $('.navigation-block a').not('.open-dropdown').on('click', close);
  $(window).on('resize', function() { if ($(window).width() > 991) close(); });
});
`;

// If JavaScript fails entirely the spinner still clears after 4 seconds
const LOADER_FALLBACK_CSS = `
.page-loader { animation: fm-loader-out 0s linear 4s forwards; }
@keyframes fm-loader-out { to { width: 0; visibility: hidden; } }
`;

export default function SiteLayout({ children }) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <head>
        {THEME_CSS.map((f) => (
          <link key={f} rel="stylesheet" media="all" href={`/css/${f}`} />
        ))}
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,500&subset=latin-ext" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&subset=latin-ext" rel="stylesheet" />
        {SITE_SCRIPTS.map((src) => (
          <link key={src} rel="preload" as="script" href={src} />
        ))}
        <style dangerouslySetInnerHTML={{ __html: layoutCss + LOADER_FALLBACK_CSS }} />
      </head>
      <body>
        <div className="page-loader" />
        <div className="wrapper">
          <div className="mobile-overlay" />
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <ThemeScripts />
        <PageScript code={MENU_SCRIPT} />
        <FlashClear />
        <script
          dangerouslySetInnerHTML={{ __html: 'window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}' }}
        />
        <script
          id="zsiqscript"
          src="https://salesiq.zohopublic.com/widget?wc=siq31e1271cc04a3f3090b4ce8ef747f184e9313dde52fae02af503e50f45d8d11c"
          defer
        />
      </body>
    </html>
  );
}
