// Theme scripts for the public site, in execution order. Minified builds of the same
// library versions (the unminified jQuery UI alone is 520 KB). Shared by the site layout
// (which preloads them) and the client-side theme loader.
export const SITE_SCRIPTS = [
  '/js/jquery.min.js',
  '/js/jquery-ui.min.js',
  '/js/jquery.bootstrap.min.js',
  '/js/jquery.magnific-popup.min.js',
  '/js/jquery.owl.carousel.js', // the .min copy is an older build that throws on clicks
  '/js/main.js',
];
