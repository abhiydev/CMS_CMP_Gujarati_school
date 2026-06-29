import { getSectionConfig } from '../admin/sectionConfig.js';
import { parseStoragePathFromUrl } from '../utils/storage.js';
import { validateImageFile } from '../utils/validation.js';
import { supabase, storageBucket } from './supabaseClient.js';

export const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [trimmed];
      } catch {
        // fall through to newline split
      }
    }
    return trimmed.split('\n').map((line) => line.trim()).filter(Boolean);
  }
  if (value && typeof value === 'object') {
    if (Array.isArray(value.paragraphs)) return value.paragraphs;
    if (Array.isArray(value.highlights)) return value.highlights;
    if (typeof value.paragraphs === 'string') return asArray(value.paragraphs);
    if (typeof value.highlights === 'string') return asArray(value.highlights);
  }
  return [];
};

const parseContent = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/** Normalize textarea line input into a string array for CMS fields. */
export const linesToArray = (text) =>
  String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

/** Build the JSON string stored in site_content.content for a given section. */
export const serializeSectionContent = (
  sectionKey,
  formContent,
  existingContent = null,
  formContentSecondary = '',
  repeaterItems = null,
) => {
  const config = getSectionConfig(sectionKey);

  if (config.contentType === 'repeater') {
    return JSON.stringify(Array.isArray(repeaterItems) ? repeaterItems : []);
  }

  if (config.contentType === 'lines') {
    const base = existingContent && typeof existingContent === 'object' && !Array.isArray(existingContent)
      ? existingContent
      : {};
    const payload = { ...base, [config.lineField]: linesToArray(formContent) };
    if (config.secondaryLineField) {
      payload[config.secondaryLineField] = linesToArray(formContentSecondary);
    }
    return JSON.stringify(payload);
  }

  let parsed;
  try {
    parsed = typeof formContent === 'string' ? JSON.parse(formContent) : formContent;
  } catch {
    throw new Error('Content must be valid JSON. Check brackets, quotes, and commas.');
  }
  return JSON.stringify(parsed);
};

/** Convert parsed DB content into repeater items array. */
export const contentToRepeaterItems = (sectionKey, content) => {
  const config = getSectionConfig(sectionKey);
  if (config.contentType !== 'repeater') return [];
  return asArray(content);
};

/** Convert parsed DB content into the admin primary textarea value. */
export const contentToFormValue = (sectionKey, content) => {
  const config = getSectionConfig(sectionKey);

  if (config.contentType === 'repeater') {
    return '';
  }

  if (config.contentType === 'lines') {
    return asArray(content?.[config.lineField] ?? content).join('\n');
  }
  return JSON.stringify(content ?? {}, null, 2);
};

/** Convert parsed DB content into the admin secondary textarea value (if configured). */
export const contentToFormSecondaryValue = (sectionKey, content) => {
  const config = getSectionConfig(sectionKey);
  if (!config.secondaryLineField) return '';
  return asArray(content?.[config.secondaryLineField]).join('\n');
};

const normalizeRows = (rows) => {
  return rows.reduce((acc, row) => {
    acc[row.section_key] = {
      title: row.title,
      subtitle: row.subtitle,
      content: parseContent(row.content),
      image_url: row.image_url,
      status: row.status || 'published',
      updated_at: row.updated_at,
    };
    return acc;
  }, {});
};

export const fetchSiteContent = async () => {
  const { data, error } = await supabase.from('site_content').select('*');
  if (error) {
    throw error;
  }
  return normalizeRows(data ?? []);
};

export const fetchGallery = async () => {
  const { data, error } = await supabase.from('gallery').select('id, image_url, category, created_at').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const fetchNotices = async ({ publishedOnly = false } = {}) => {
  let query = supabase.from('notices').select('*').order('publish_date', { ascending: false });
  if (publishedOnly) {
    query = query.eq('status', 'published');
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
};

const normalizeContentPayload = (payload) => {
  const normalized = { ...payload };
  if (normalized.content !== undefined && typeof normalized.content !== 'string') {
    normalized.content = JSON.stringify(normalized.content);
  }
  return normalized;
};

const formatSectionRow = (row) => ({
  ...row,
  content: parseContent(row.content),
  status: row.status || 'published',
});

export const updateSiteContent = async (section_key, payload) => {
  const normalized = normalizeContentPayload(payload);

  const { data, error } = await supabase
    .from('site_content')
    .update(normalized)
    .eq('section_key', section_key)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return formatSectionRow(data);
};

/** Insert or update a section — used when DB row may not exist yet (e.g. facilities). */
export const upsertSiteContent = async (section_key, payload) => {
  const normalized = normalizeContentPayload(payload);

  const { data, error } = await supabase
    .from('site_content')
    .upsert({ section_key, ...normalized }, { onConflict: 'section_key' })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return formatSectionRow(data);
};

export const uploadStorageImage = async (file, path) => {
  const fileError = validateImageFile(file);
  if (fileError) {
    throw new Error(fileError);
  }

  const { error } = await supabase.storage.from(storageBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'image/jpeg',
  });
  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteStorageImage = async (publicUrl) => {
  const path = parseStoragePathFromUrl(publicUrl);
  if (!path) return { removed: false };

  const { error } = await supabase.storage.from(storageBucket).remove([path]);
  if (error) {
    if (import.meta.env.DEV) {
      console.warn('Storage cleanup failed for path:', path, error.message);
    }
    return { removed: false, error };
  }
  return { removed: true };
};

export const createGalleryImage = async (image_url, category) => {
  const { data, error } = await supabase.from('gallery').insert({ image_url, category }).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteGalleryItem = async (id, imageUrl = null) => {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) {
    throw error;
  }

  if (imageUrl) {
    await deleteStorageImage(imageUrl);
  }
};

export const createNotice = async ({ title, description, publish_date }) => {
  const { data, error } = await supabase.from('notices').insert({ title, description, publish_date }).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateNotice = async (id, payload) => {
  const { data, error } = await supabase.from('notices').update(payload).eq('id', id).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteNotice = async (id) => {
  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) {
    throw error;
  }
};
