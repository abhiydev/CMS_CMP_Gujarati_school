export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export const isNonEmpty = (value) => String(value ?? '').trim().length > 0;

export const isValidImageUrl = (url) => {
  if (!isNonEmpty(url)) return true; // empty is allowed (fallback used)
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:', 'https:', 'blob:'].includes(parsed.protocol);
  } catch {
    return url.startsWith('/') || url.startsWith('data:image/');
  }
};

export const validateImageFile = (file) => {
  if (!file) return 'Please choose an image file.';
  if (!file.type.startsWith('image/')) return 'Only image files are allowed.';
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image is too large. Please use a file under 5 MB. WebP or compressed JPEG works best.';
  }
  return null;
};

export const validateNoticeForm = (form) => {
  if (!isNonEmpty(form.title)) return 'Please enter a notice title.';
  if (!isNonEmpty(form.description)) return 'Please enter a notice description.';
  if (!isNonEmpty(form.publish_date)) return 'Please choose a publish date.';
  return null;
};

export const validateSectionForm = (sectionKey, form, config) => {
  if (config.showTitle && config.requireTitle !== false && !isNonEmpty(form.title)) {
    return 'Please enter a section title before saving.';
  }
  if (form.image_url && !isValidImageUrl(form.image_url)) {
    return 'Image link does not look valid. Paste a full https:// URL or upload an image.';
  }
  if (config.contentType === 'repeater') {
    const items = form.repeaterItems ?? [];
    if (items.length === 0) return 'Add at least one item before saving.';
    const missingTitle = items.find((item) => !isNonEmpty(item.title) && !isNonEmpty(item.name));
    if (missingTitle) return 'Each item needs a title or name.';
  }
  return null;
};
