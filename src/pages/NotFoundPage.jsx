import { Link } from 'react-router-dom';
import SeoMeta from '../components/SeoMeta.jsx';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-24 text-slate-900">
      <SeoMeta title="Page Not Found" description="The requested page could not be found." noindex />
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-12 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Page not found</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">We couldn’t find that page.</h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
          The school website is still available from the homepage or the admin dashboard if you are signed in.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to="/" className="rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700">
            Back to Home
          </Link>
          <Link to="/admin/login" className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
