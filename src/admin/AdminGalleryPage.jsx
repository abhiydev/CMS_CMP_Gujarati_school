import { useEffect, useRef, useState } from 'react';
import { createGalleryAlbum, deleteGalleryAlbum, fetchGalleryAlbums, uploadStorageImage } from '../services/contentService.js';
import { logActivity } from '../services/activityService.js';
import { validateImageFile } from '../utils/validation.js';
import { useAuth } from '../hooks/useAuth.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SafeImage from '../components/SafeImage.jsx';

export default function AdminGalleryPage() {
  const { session } = useAuth();
  const inputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [filePreviews, setFilePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchGalleryAlbums();
        setAlbums(list);
      } catch (err) {
        setError(err.message || 'Unable to load gallery albums.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const selectFiles = (files) => {
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    const validFiles = [];
    const previews = [];

    for (const file of newFiles) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setError(null);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const selectCoverFile = (file) => {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearCover = () => {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFiles([]);
    setCoverFile(null);
    setCoverPreview(null);
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    setFilePreviews([]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter an album title.');
      return;
    }

    if (selectedFiles.length === 0 && !coverFile) {
      setError('Please add at least one image.');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const albumSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const timestamp = Date.now();
      
      // Upload cover image if provided
      let coverImageUrl = null;
      if (coverFile) {
        const coverPath = `gallery/${albumSlug}/${timestamp}-cover-${coverFile.name.replace(/\s+/g, '-')}`;
        coverImageUrl = await uploadStorageImage(coverFile, coverPath);
      }

      // Upload all images
      const uploadedImages = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const imagePath = `gallery/${albumSlug}/${timestamp}-${i}-${file.name.replace(/\s+/g, '-')}`;
        const publicUrl = await uploadStorageImage(file, imagePath);
        uploadedImages.push(publicUrl);
      }

      // If no cover was uploaded, use first image as cover
      const finalCover = coverImageUrl || uploadedImages[0] || null;

      const newAlbum = await createGalleryAlbum({
        title: title.trim(),
        description: description.trim() || null,
        coverImage: finalCover,
        images: uploadedImages,
      });

      setAlbums((current) => [newAlbum, ...current]);
      resetForm();
      setMessage('Album created successfully.');
      
      await logActivity({
        action: 'gallery_album_created',
        entityType: 'gallery',
        entityId: newAlbum.id,
        details: title,
        actorEmail: session?.user?.email,
      });
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (album) => {
    if (!confirm(`Delete album "${album.title}"? This will remove all images in this album.`)) return;

    try {
      await deleteGalleryAlbum(album.id);
      setAlbums((current) => current.filter((item) => item.id !== album.id));
      setMessage('Album deleted.');
      
      await logActivity({
        action: 'gallery_album_deleted',
        entityType: 'gallery',
        entityId: album.id,
        details: album.title,
        actorEmail: session?.user?.email,
      });
    } catch (err) {
      setError(err.message || 'Unable to delete album.');
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    selectFiles(event.dataTransfer.files);
  };

  if (loading) {
    return <LoadingSpinner message="Loading gallery albums…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Gallery management</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Create and manage photo albums</h1>
        <p className="mt-2 text-slate-600">Upload multiple images to create event albums for the school gallery.</p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <form className="grid gap-6" onSubmit={handleUpload}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Album Title *</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Day 2026"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description (optional)</span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the event"
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>

          {/* Cover Image Upload */}
          <div>
            <span className="text-sm font-medium text-slate-700">Cover Image (optional)</span>
            <p className="mt-1 text-xs text-slate-500">If not set, the first image will be used as cover</p>
            <div className="mt-3 flex items-center gap-4">
              {coverPreview ? (
                <div className="relative h-32 w-32 flex-shrink-0">
                  <SafeImage src={coverPreview} alt="Cover preview" className="h-full w-full rounded-2xl object-cover" />
                  <button
                    type="button"
                    onClick={clearCover}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="h-32 w-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              <input ref={coverInputRef} type="file" accept="image/*,.webp" className="hidden" onChange={(e) => selectCoverFile(e.target.files?.[0])} />
            </div>
          </div>

          {/* Multiple Image Upload */}
          <div>
            <span className="text-sm font-medium text-slate-700">Album Images *</span>
            <p className="mt-1 text-xs text-slate-500">Upload multiple images for the album</p>
            <div
              onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`mt-3 rounded-[1.5rem] border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50'}`}
            >
              <p className="text-sm font-medium text-slate-700">Drag and drop images here</p>
              <p className="mt-2 text-xs text-slate-500">WebP or JPEG under 5 MB each</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-4 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Browse files
              </button>
              <input ref={inputRef} type="file" accept="image/*,.webp" multiple className="hidden" onChange={(e) => selectFiles(e.target.files)} />
            </div>

            {/* Image Previews */}
            {filePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <SafeImage src={preview} alt={`Preview ${index + 1}`} className="h-full w-full rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          {saving ? (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-500" />
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || selectedFiles.length === 0}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? 'Creating Album…' : 'Create Album'}
            </button>
            {selectedFiles.length > 0 || coverFile ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {albums.map((album) => (
          <article key={album.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <SafeImage src={album.coverImage} alt={album.title} className="h-48 w-full object-cover" lazy />
            <div className="space-y-3 p-5">
              <h3 className="text-lg font-semibold text-slate-900">{album.title}</h3>
              {album.description && (
                <p className="text-sm text-slate-600 line-clamp-2">{album.description}</p>
              )}
              <p className="text-xs text-slate-500">{album.images?.length || 0} photos</p>
              <p className="text-xs text-slate-500">Created {new Date(album.createdAt).toLocaleDateString()}</p>
              <button
                type="button"
                onClick={() => handleDelete(album)}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Delete Album
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
