import { useRef, useState } from 'react';
import { uploadStorageImage } from '../services/contentService';
import { validateImageFile } from '../utils/validation';
import SafeImage from '../components/SafeImage';

export default function AdminImageField({ label, value, onChange, uploadPrefix = 'sections' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);
    setUploadError(null);

    try {
      const path = `${uploadPrefix}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const publicUrl = await uploadStorageImage(file, path);
      onChange(publicUrl);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
    }
  };

  const onInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
    event.target.value = '';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const displaySrc = previewUrl || value;

  return (
    <div className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <p className="mt-1 text-xs text-slate-500">
        Tip: WebP or compressed JPEG under 5 MB loads fastest on the school website.
      </p>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste image URL or upload below"
        className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
      />

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4"
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          </button>
          {value ? (
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange('')}
              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove image
            </button>
          ) : null}
          <input ref={inputRef} type="file" accept="image/*,.webp" className="hidden" onChange={onInputChange} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Drag and drop an image here, or use the upload button.</p>
      </div>

      {uploading ? (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-500" />
        </div>
      ) : null}

      {uploadError ? (
        <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{uploadError}</p>
      ) : null}

      {displaySrc ? (
        <SafeImage
          src={displaySrc}
          alt="Preview"
          className="mt-4 h-40 w-full rounded-2xl border border-slate-200 object-cover"
        />
      ) : (
        <div className="mt-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          No image selected
        </div>
      )}
    </div>
  );
}
