import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchRecentActivity } from '../services/activityService.js';
import { useAuth } from '../hooks/useAuth.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const actionLabels = {
  section_updated: 'Section updated',
  section_draft_saved: 'Section draft saved',
  notice_created: 'Notice published',
  notice_draft_created: 'Notice draft created',
  notice_updated: 'Notice updated',
  notice_draft_saved: 'Notice draft saved',
  notice_deleted: 'Notice deleted',
  gallery_uploaded: 'Gallery image uploaded',
  gallery_deleted: 'Gallery image deleted',
};

export default function AdminActivityPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetchRecentActivity(50).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [isAdmin]);

  if (authLoading) {
    return <LoadingSpinner message="Loading…" />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading activity…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Activity log</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Recent admin actions</h1>
        <p className="mt-2 text-slate-600">A simple record of content, notice, and gallery changes.</p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-slate-600">
          No activity recorded yet. Actions will appear here after content is saved.
        </p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-slate-900">{actionLabels[item.action] ?? item.action}</p>
                <p className="text-sm text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              {item.details ? <p className="mt-1 text-sm text-slate-600">{item.details}</p> : null}
              {item.actor_email ? <p className="mt-1 text-xs text-slate-500">By {item.actor_email}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
