import { useEffect, useState } from 'react';
import { createNotice, deleteNotice, fetchNotices, updateNotice } from '../services/contentService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', publish_date: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotices();
        setNotices(data);
      } catch (err) {
        setError(err.message || 'Unable to load notices.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const newNotice = await createNotice(form);
      setNotices((current) => [newNotice, ...current]);
      setForm({ title: '', description: '', publish_date: '' });
      setMessage('Notice published successfully.');
    } catch (err) {
      setError(err.message || 'Unable to publish notice.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;

    try {
      await deleteNotice(id);
      setNotices((current) => current.filter((notice) => notice.id !== id));
    } catch (err) {
      setError(err.message || 'Unable to delete notice.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading notices…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Notices</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Publish school announcements</h1>
        <p className="mt-2 text-slate-600">Create notices for parents and students, then manage them from a single CMS panel.</p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Publish date</span>
              <input
                type="date"
                value={form.publish_date}
                onChange={(event) => handleChange('publish_date', event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => handleChange('description', event.target.value)}
              rows={5}
              className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              required
            />
          </label>

          {message ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? 'Publishing…' : 'Publish Notice'}
          </button>
        </form>
      </section>

      <section className="grid gap-6">
        {notices.map((notice) => (
          <article key={notice.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">{new Date(notice.publish_date).toLocaleDateString()}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{notice.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(notice.id)}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
            <p className="mt-4 text-slate-600">{notice.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
