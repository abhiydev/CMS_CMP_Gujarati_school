export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://cmpgujaratischool.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Smt. C.M.P Gujarati Primary and Middle School';
export const SITE_SHORT_NAME = 'CMP Gujarati Samaj School';
export const SITE_ALTERNATE_NAME = 'Shree Gujarati Samaj School';

export const DEFAULT_TITLE = `${SITE_SHORT_NAME} | Indore Admissions & Heritage Education`;
export const DEFAULT_DESCRIPTION =
  'Smt. C.M.P Gujarati Primary and Middle School in Indore offers affordable heritage Gujarati education, CBSE-aligned KG classes, modern facilities, and trusted admissions support since 1957.';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;
export const THEME_COLOR = '#4f46e5';
export const AUTHOR = 'Shree Gujarati Samaj, Indore';
export const LOCALE = 'en_IN';
export const LANGUAGE = 'en';

export const SCHOOL_ADDRESS = {
  streetAddress: '1, Nasiya Road',
  addressLocality: 'Indore',
  addressRegion: 'Madhya Pradesh',
  postalCode: '452001',
  addressCountry: 'IN',
};

export const SCHOOL_GEO = {
  latitude: 22.7114389,
  longitude: 75.868951,
};

export const PUBLIC_SECTIONS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/#about', priority: '0.9', changefreq: 'monthly' },
  { path: '/#why', priority: '0.8', changefreq: 'monthly' },
  { path: '/#academics', priority: '0.9', changefreq: 'monthly' },
  { path: '/#achievements', priority: '0.8', changefreq: 'monthly' },
  { path: '/#facilities', priority: '0.8', changefreq: 'monthly' },
  { path: '/#student-life', priority: '0.7', changefreq: 'monthly' },
  { path: '/#leadership', priority: '0.7', changefreq: 'monthly' },
  { path: '/#gallery', priority: '0.7', changefreq: 'weekly' },
  { path: '/#admissions', priority: '0.9', changefreq: 'weekly' },
  { path: '/#contact', priority: '0.8', changefreq: 'monthly' },
];

export const getPageUrl = (path = '/') => {
  if (path.startsWith('http')) return path;
  if (path.startsWith('/#')) return `${SITE_URL}${path}`;
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const buildTitle = (title) => {
  const trimmed = String(title ?? '').trim();
  if (!trimmed) return DEFAULT_TITLE;
  if (
    trimmed.includes('CMP Gujarati') ||
    trimmed.includes('Gujarati Samaj') ||
    trimmed.includes(SITE_NAME)
  ) {
    return trimmed;
  }
  return `${trimmed} | ${SITE_SHORT_NAME}, Indore`;
};

export const buildDescription = (description) => {
  const trimmed = String(description ?? '').trim();
  return trimmed || DEFAULT_DESCRIPTION;
};
