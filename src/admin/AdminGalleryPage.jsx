import { useEffect, useState } from 'react';
import { createGalleryImage, deleteGalleryItem, fetchGallery, uploadStorageImage } from '../services/contentService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Campus');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchGallery();
        setItems(list);
      } catch (err) {
        setError(err.message || 'Unable to load gallery.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Choose an image file first.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const path = `gallery/${Date.now()}-${file.name}`;
      const publicUrl = await uploadStorageImage(file, path);
      const newItem = await createGalleryImage(publicUrl, category);
      setItems((current) => [newItem, ...current]);
      setFile(null);
      setCategory('Campus');
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this gallery image?')) {
      return;
    }

    try {
      await deleteGalleryItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Unable to delete image.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading gallery items…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Gallery management</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Upload and manage school images</h1>
        <p className="mt-2 text-slate-600">Add new gallery photos and remove outdated images from the public gallery.</p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <form className="grid gap-6" onSubmit={handleUpload}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Choose image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-3 w-full text-sm text-slate-700"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option>Campus</option>
                <option>Events</option>
                <option>Students</option>
                <option>Facilities</option>
              </select>
            </label>
          </div>

          {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? 'Uploading…' : 'Upload Image'}
          </button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <img src={item.image_url} alt={item.category} className="h-64 w-full object-cover" />
            <div className="space-y-3 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">{item.category}</p>
              <p className="text-sm text-slate-600">Uploaded {new Date(item.created_at).toLocaleDateString()}</p>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
