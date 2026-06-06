import { supabase, storageBucket } from './supabaseClient';

const parseContent = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeRows = (rows) => {
  return rows.reduce((acc, row) => {
    acc[row.section_key] = {
      title: row.title,
      subtitle: row.subtitle,
      content: parseContent(row.content),
      image_url: row.image_url,
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

export const fetchNotices = async () => {
  const { data, error } = await supabase.from('notices').select('*').order('publish_date', { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const updateSiteContent = async (section_key, payload) => {
  const { data, error } = await supabase.from('site_content').update(payload).eq('section_key', section_key).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const uploadStorageImage = async (file, path) => {
  const { error } = await supabase.storage.from(storageBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
  return data.publicUrl;
};

export const createGalleryImage = async (image_url, category) => {
  const { data, error } = await supabase.from('gallery').insert({ image_url, category }).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteGalleryItem = async (id) => {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) {
    throw error;
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
