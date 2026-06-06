import { useCallback, useEffect, useState } from 'react';
import {
  contentToFormSecondaryValue,
  contentToFormValue,
  contentToRepeaterItems,
  fetchSiteContent,
  serializeSectionContent,
  upsertSiteContent,
} from '../services/contentService';
import { logActivity } from '../services/activityService';
import { validateSectionForm } from '../utils/validation';
import AdminImageField from './AdminImageField';
import RepeaterEditor from './RepeaterEditor';
import {
  getSectionConfig,
  mergeSectionsWithFallbacks,
  resolveSectionData,
  SECTION_KEYS,
} from './sectionConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  content: '',
  contentSecondary: '',
  image_url: '',
  status: 'published',
  repeaterItems: [],
};

const buildFormState = (sectionKey, sectionData = {}) => ({
  title: sectionData.title || '',
  subtitle: sectionData.subtitle || '',
  content: contentToFormValue(sectionKey, sectionData.content),
  contentSecondary: contentToFormSecondaryValue(sectionKey, sectionData.content),
  image_url: sectionData.image_url || '',
  status: sectionData.status || 'published',
  repeaterItems: contentToRepeaterItems(sectionKey, sectionData.content),
});

export default function AdminContentPage() {
  const { session } = useAuth();
  const [sections, setSections] = useState({});
  const [selected, setSelected] = useState('hero');
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const hydrateForm = useCallback((sectionKey, sectionMap) => {
    const data = resolveSectionData(sectionKey, sectionMap);
    setForm(buildFormState(sectionKey, data));
    setFieldErrors({});
    setMessage('');
    setError(null);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSiteContent();
        const merged = mergeSectionsWithFallbacks(data);
        setSections(merged);
        setSelected('hero');
        hydrateForm('hero', merged);
      } catch (err) {
        setError(err.message || 'Unable to load content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [hydrateForm]);

  const handleSelectSection = (sectionKey) => {
    setSelected(sectionKey);
    hydrateForm(sectionKey, sections);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = getSectionConfig(selected);
    const validationError = validateSectionForm(selected, form, config);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setMessage('');

    try {
      const serializedContent = serializeSectionContent(
        selected,
        form.content,
        sections[selected]?.content,
        form.contentSecondary,
        form.repeaterItems,
      );

      const updated = await upsertSiteContent(selected, {
        title: form.title,
        subtitle: form.subtitle,
        content: serializedContent,
        image_url: form.image_url,
        status: form.status,
      });

      const nextSections = {
        ...sections,
        [selected]: {
          title: updated.title,
          subtitle: updated.subtitle,
          content: updated.content,
          image_url: updated.image_url,
          status: updated.status || form.status,
          updated_at: updated.updated_at,
        },
      };

      setSections(nextSections);
      setForm(buildFormState(selected, nextSections[selected]));
      setMessage(form.status === 'draft' ? 'Draft saved. Visitors will still see the previous published version.' : 'Content saved and published.');

      await logActivity({
        action: form.status === 'draft' ? 'section_draft_saved' : 'section_updated',
        entityType: 'site_content',
        entityId: selected,
        details: config.label,
        actorEmail: session?.user?.email,
      });
    } catch (err) {
      setError(err.message || 'Unable to save content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading content sections…" />;
  }

  const config = getSectionConfig(selected);
  const isRepeater = config.contentType === 'repeater';
  const isLines = config.contentType === 'lines';

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Content management</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Update website content sections</h1>
        <p className="mt-2 text-slate-600">Choose a section and edit the title, subtitle, content, and image for the homepage.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Sections</p>
          <div className="mt-4 space-y-3">
            {SECTION_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectSection(key)}
                className={`block w-full rounded-3xl px-4 py-3 text-left text-sm font-semibold ${selected === key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                {getSectionConfig(key).label}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Editing: {config.label}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${form.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {form.status === 'draft' ? 'Draft' : 'Published'}
            </span>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Publishing status</span>
              <select
                value={form.status}
                onChange={(event) => handleChange('status', event.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="published">Published — visible on website</option>
                <option value="draft">Draft — hidden from visitors</option>
              </select>
            </label>

            {config.showTitle ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                  className={`mt-3 w-full rounded-3xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none ${fieldErrors.title ? 'border-red-300' : 'border-slate-300'}`}
                />
              </label>
            ) : null}

            {config.showSubtitle ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Subtitle / description</span>
                <input
                  value={form.subtitle}
                  onChange={(event) => handleChange('subtitle', event.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </label>
            ) : null}

            {isRepeater ? (
              <RepeaterEditor
                items={form.repeaterItems}
                fields={config.repeaterFields}
                itemLabel={config.repeaterItemLabel}
                onChange={(items) => handleChange('repeaterItems', items)}
                uploadPrefix={`sections/${selected}`}
              />
            ) : (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">{config.contentLabel}</span>
                <textarea
                  value={form.content}
                  onChange={(event) => handleChange('content', event.target.value)}
                  rows={isLines ? 10 : 8}
                  className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                {config.contentHint ? <p className="mt-2 text-sm text-slate-500">{config.contentHint}</p> : null}
              </label>
            )}

            {config.secondaryLineField ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">{config.secondaryContentLabel}</span>
                <textarea
                  value={form.contentSecondary}
                  onChange={(event) => handleChange('contentSecondary', event.target.value)}
                  rows={6}
                  className="mt-3 w-full rounded-[1.5rem] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
                <p className="mt-2 text-sm text-slate-500">{config.secondaryContentHint}</p>
              </label>
            ) : null}

            {config.showImage ? (
              <AdminImageField
                label={config.imageLabel}
                value={form.image_url}
                onChange={(url) => handleChange('image_url', url)}
                uploadPrefix={`sections/${selected}`}
              />
            ) : null}

            {message ? <p className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? 'Saving…' : form.status === 'draft' ? 'Save Draft' : 'Save & Publish'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
