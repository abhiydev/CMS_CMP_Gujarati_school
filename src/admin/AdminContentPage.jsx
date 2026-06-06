import { useEffect, useState } from 'react';
import { fetchSiteContent, updateSiteContent } from '../services/contentService';
import LoadingSpinner from '../components/LoadingSpinner';

const sectionLabels = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'academic', label: 'Academics' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'studentLife', label: 'Student Life' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'admissions', label: 'Admissions' },
  { key: 'contact', label: 'Contact' },
];

export default function AdminContentPage() {
  const [sections, setSections] = useState({});
  const [selected, setSelected] = useState('hero');
  const [form, setForm] = useState({ title: '', subtitle: '', content: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSiteContent();
        setSections(data);
        const initial = data.hero ?? {};
        setSelected('hero');
        setForm({
          title: initial.title || '',
          subtitle: initial.subtitle || '',
          content: JSON.stringify(initial.content ?? {}, null, 2),
          image_url: initial.image_url || '',
        });
      } catch (err) {
        setError(err.message || 'Unable to load content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!sections[selected]) return;
    const current = sections[selected];
    setForm({
      title: current.title || '',
      subtitle: current.subtitle || '',
      content: JSON.stringify(current.content ?? {}, null, 2),
      image_url: current.image_url || '',
    });
    setMessage('');
    setError(null);
  }, [selected, sections]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage('');

    try {
      await updateSiteContent(selected, {
        title: form.title,
        subtitle: form.subtitle,
        content: form.content,
        image_url: form.image_url,
      });
      setMessage('Content saved successfully.');
    } catch (err) {
      setError(err.message || 'Unable to save content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading content sections…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Content management</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Update website content sections</h1>
        <p className="mt-2 text-slate-600">Choose a section and edit the title, subtitle, content JSON, and image path for the homepage.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Sections</p>
          <div className="mt-4 space-y-3">
            {sectionLabels.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setSelected(section.key)}
                className={`block w-full rounded-3xl px-4 py-3 text-left text-sm font-semibold ${selected === section.key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Editing: {selected}</p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Subtitle / description</span>
              <input
                value={form.subtitle}
                onChange={(event) => handleChange('subtitle', event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Structured content (JSON)</span>
              <textarea
                value={form.content}
                onChange={(event) => handleChange('content', event.target.value)}
                rows={8}
                className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
              <p className="mt-2 text-sm text-slate-500">
                Use JSON for arrays and nested structured content. Example: {'[{"title":"...","description":"..."}]'}
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Image URL / path</span>
              <input
                value={form.image_url}
                onChange={(event) => handleChange('image_url', event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </label>

            {message ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
