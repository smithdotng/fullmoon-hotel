import { readFlash } from '@/lib/flash';
import Flash from '@/components/Flash';
import ThemeScripts from '@/components/ThemeScripts';
import FlashClear from '@/components/FlashClear';

export const metadata = {
  title: { template: '%s - Full Moon Hotel Admin', default: 'Admin Dashboard - Full Moon Hotel Admin' },
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.ico' },
};

const adminCss = `
.admin-sidebar { min-height: 100vh; background: #2c3e50; padding-top: 20px; }
.admin-sidebar .nav-link { color: #ecf0f1; padding: 10px 20px; }
.admin-sidebar .nav-link:hover { background: #34495e; }
.admin-content { background: #ecf0f1; min-height: 100vh; padding: 20px; }
`;

export default async function AdminLayout({ children }) {
  const messages = await readFlash();
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet" />
        <link href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: adminCss }} />
      </head>
      <body>
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-3 col-lg-2 admin-sidebar">
              <div className="position-sticky pt-3">
                <h4 className="text-white p-3 border-bottom">Full Moon Hotel Admin</h4>
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link" href="/admin">
                      <i className="fas fa-tachometer-alt me-2" />
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/admin/rooms">
                      <i className="fas fa-bed me-2" />
                      Manage Rooms
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/">
                      <i className="fas fa-home me-2" />
                      Back to Site
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <main className="col-md-9 ms-sm-auto col-lg-10 admin-content">
              <Flash messages={messages} bs={5} />
              {children}
            </main>
          </div>
        </div>
        <ThemeScripts kind="admin" />
        <FlashClear />
      </body>
    </html>
  );
}

