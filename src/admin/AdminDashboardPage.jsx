import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecentActivity } from '../services/activityService.js';
import { fetchGallery, fetchNotices } from '../services/contentService.js';
import { useAuth } from '../hooks/useAuth';

const actionLabels = {
  section_updated: 'Section updated',
  section_draft_saved: 'Section draft saved',
  notice_created: 'Notice published',
  notice_updated: 'Notice updated',
  notice_deleted: 'Notice deleted',
  gallery_uploaded: 'Gallery upload',
  gallery_deleted: 'Gallery delete',
};

export default function AdminDashboardPage() {
  const { session, role } = useAuth();
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({ notices: 0, gallery: 0 });

  useEffect(() => {
    Promise.all([
      fetchRecentActivity(8),
      fetchNotices(),
      fetchGallery(),
    ]).then(([recent, notices, gallery]) => {
      setActivity(recent);
      setStats({ notices: notices.length, gallery: gallery.length });
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="max-w-2xl text-slate-600">
          Signed in as {session?.user?.email} ({role}). Use the quick links below or review recent activity.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Notices</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.notices}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Gallery images</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.gallery}</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Recent actions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{activity.length}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Link to="content" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Content</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Edit website sections</h2>
          <p className="mt-3 text-slate-600">Update hero text, admissions info, contact and section copy across the homepage.</p>
        </Link>
        <Link to="gallery" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Gallery</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Manage image uploads</h2>
          <p className="mt-3 text-slate-600">Upload new gallery images and keep the campus gallery fresh.</p>
        </Link>
        <Link to="notices" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition hover:-translate-y-1">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Notices</p>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Publish announcements</h2>
          <p className="mt-3 text-slate-600">Create and manage school notices for parents and students.</p>
        </Link>
      </div>

      <section className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
          <Link to="activity" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No recent actions yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {activity.map((item) => (
              <li key={item.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <span className="font-semibold text-slate-900">{actionLabels[item.action] ?? item.action}</span>
                {item.details ? <span className="text-slate-600"> — {item.details}</span> : null}
                <span className="mt-1 block text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
