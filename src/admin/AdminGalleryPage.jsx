import { useEffect, useRef, useState } from 'react';
import { createGalleryImage, deleteGalleryItem, fetchGallery, uploadStorageImage } from '../services/contentService';
import { logActivity } from '../services/activityService';
import { validateImageFile } from '../utils/validation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import SafeImage from '../components/SafeImage';

export default function AdminGalleryPage() {
  const { session } = useAuth();
  const inputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState('Campus');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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

  const selectFile = (nextFile) => {
    if (!nextFile) return;
    const validationError = validateImageFile(nextFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  };

  const clearSelection = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Choose an image file first.');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const publicUrl = await uploadStorageImage(file, path);
      const newItem = await createGalleryImage(publicUrl, category);
      setItems((current) => [newItem, ...current]);
      clearSelection();
      setCategory('Campus');
      setMessage('Image uploaded successfully.');
      await logActivity({
        action: 'gallery_uploaded',
        entityType: 'gallery',
        entityId: newItem.id,
        details: category,
        actorEmail: session?.user?.email,
      });
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm('Delete this gallery image?')) return;

    try {
      await deleteGalleryItem(item.id, item.image_url);
      setItems((current) => current.filter((row) => row.id !== item.id));
      setMessage('Image deleted.');
      await logActivity({
        action: 'gallery_deleted',
        entityType: 'gallery',
        entityId: item.id,
        actorEmail: session?.user?.email,
      });
    } catch (err) {
      setError(err.message || 'Unable to delete image.');
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFile(event.dataTransfer.files?.[0]);
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
          <div
            onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`rounded-[1.5rem] border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50'}`}
          >
            <p className="text-sm font-medium text-slate-700">Drag and drop an image here</p>
            <p className="mt-2 text-xs text-slate-500">WebP or JPEG under 5 MB recommended</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-4 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Browse files
            </button>
            <input ref={inputRef} type="file" accept="image/*,.webp" className="hidden" onChange={(e) => selectFile(e.target.files?.[0])} />
          </div>

          {preview ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <SafeImage src={preview} alt="Upload preview" className="h-48 w-full max-w-xs rounded-2xl object-cover" />
              <div className="space-y-3">
                <p className="text-sm text-slate-600">{file?.name}</p>
                <button type="button" onClick={clearSelection} className="text-sm font-semibold text-red-600 hover:text-red-700">
                  Remove selection
                </button>
              </div>
            </div>
          ) : null}

          <label className="block max-w-xs">
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

          {message ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          {saving ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-500" />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saving || !file}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? 'Uploading…' : 'Upload Image'}
          </button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <SafeImage src={item.image_url} alt={item.category} className="h-64 w-full object-cover" lazy />
            <div className="space-y-3 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">{item.category}</p>
              <p className="text-sm text-slate-600">Uploaded {new Date(item.created_at).toLocaleDateString()}</p>
              <button
                type="button"
                onClick={() => handleDelete(item)}
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
