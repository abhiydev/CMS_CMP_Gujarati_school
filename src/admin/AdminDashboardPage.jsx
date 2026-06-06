import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome to school content management</h1>
        <p className="max-w-2xl text-slate-600">
          Use the navigation to update hero content, about section, facilities, admissions, gallery images, and published notices.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link
          to="content"
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Content</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Edit website sections</h2>
          <p className="mt-3 text-slate-600">Update hero text, admissions info, contact and section copy across the homepage.</p>
        </Link>

        <Link
          to="gallery"
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Gallery</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Manage image uploads</h2>
          <p className="mt-3 text-slate-600">Upload new gallery images, replace existing photos, and keep the campus gallery fresh.</p>
        </Link>

        <Link
          to="notices"
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Notices</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Publish announcements</h2>
          <p className="mt-3 text-slate-600">Create and manage school notices, events, and important updates for visitors.</p>
        </Link>
      </div>
    </div>
  );
}
