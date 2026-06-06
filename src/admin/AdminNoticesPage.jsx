import { useEffect, useState } from 'react';
import { createNotice, deleteNotice, fetchNotices, updateNotice } from '../services/contentService';
import { logActivity } from '../services/activityService';
import { validateNoticeForm } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const EMPTY_FORM = { title: '', description: '', publish_date: '', status: 'published' };

export default function AdminNoticesPage() {
  const { session } = useAuth();
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [statusById, setStatusById] = useState({});

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

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleEdit = (notice) => {
    setEditingId(notice.id);
    setForm({
      title: notice.title,
      description: notice.description,
      publish_date: notice.publish_date,
      status: notice.status || 'published',
    });
    setMessage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateNoticeForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (editingId) {
        const updated = await updateNotice(editingId, form);
        setNotices((current) => current.map((notice) => (notice.id === editingId ? updated : notice)));
        setStatusById((current) => ({ ...current, [editingId]: 'updated' }));
        setMessage(form.status === 'draft' ? 'Draft saved.' : 'Notice updated and published.');
        await logActivity({
          action: form.status === 'draft' ? 'notice_draft_saved' : 'notice_updated',
          entityType: 'notice',
          entityId: editingId,
          details: form.title,
          actorEmail: session?.user?.email,
        });
        resetForm();
      } else {
        const newNotice = await createNotice(form);
        setNotices((current) => [newNotice, ...current]);
        setStatusById((current) => ({ ...current, [newNotice.id]: 'created' }));
        setForm(EMPTY_FORM);
        setMessage(form.status === 'draft' ? 'Draft notice saved.' : 'Notice published successfully.');
        await logActivity({
          action: form.status === 'draft' ? 'notice_draft_created' : 'notice_created',
          entityType: 'notice',
          entityId: newNotice.id,
          details: form.title,
          actorEmail: session?.user?.email,
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to save notice.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;

    try {
      await deleteNotice(id);
      setNotices((current) => current.filter((notice) => notice.id !== id));
      if (editingId === id) resetForm();
      setStatusById((current) => ({ ...current, [id]: 'deleted' }));
      setMessage('Notice deleted.');
      await logActivity({
        action: 'notice_deleted',
        entityType: 'notice',
        entityId: id,
        actorEmail: session?.user?.email,
      });
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
        <p className="mt-2 text-slate-600">Create, edit, and remove notices for parents and students.</p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">
          {editingId ? 'Editing notice' : 'New notice'}
        </p>
        <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
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

          <label className="block max-w-sm">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="published">Published — visible on website</option>
              <option value="draft">Draft — hidden from visitors</option>
            </select>
          </label>

          {message ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? 'Saving…' : editingId ? (form.status === 'draft' ? 'Save Draft' : 'Update & Publish') : (form.status === 'draft' ? 'Save Draft' : 'Publish Notice')}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="grid gap-6">
        {notices.map((notice) => (
          <article
            key={notice.id}
            className={`rounded-[2rem] border bg-white p-6 shadow-soft ${editingId === notice.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">
                  {new Date(notice.publish_date).toLocaleDateString()}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{notice.title}</h2>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${notice.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {notice.status === 'draft' ? 'Draft' : 'Published'}
                </span>
                {statusById[notice.id] === 'updated' ? (
                  <p className="mt-2 text-sm text-emerald-600">Updated just now</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(notice)}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(notice.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 text-slate-600">{notice.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
