import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const navItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Content', path: '/admin/content' },
  { label: 'Gallery', path: '/admin/gallery' },
  { label: 'Notices', path: '/admin/notices' },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking admin session…" />;
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Admin Dashboard</p>
            <p className="text-sm text-slate-600">Manage site content, gallery uploads, and notices.</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8 lg:flex-row">
        <aside className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft lg:w-80">
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-3xl px-4 py-3 text-sm font-semibold ${location.pathname === item.path ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
