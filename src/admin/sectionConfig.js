import { fallbackContent } from '../data.js';

/** Lightweight CMS section metadata — drives admin form fields and serialization. */
export const SECTION_CONFIG = {
  brand: {
    label: 'Brand & Header',
    contentType: 'json',
    showTitle: true,
    showSubtitle: true,
    showImage: true,
    imageLabel: 'Logo image',
    contentLabel: 'Brand details (JSON)',
    contentHint: 'JSON with tagline and description. Example: {"tagline":"...","description":"..."}',
  },
  hero: {
    label: 'Hero',
    contentType: 'json',
    showTitle: true,
    showSubtitle: true,
    showImage: true,
    imageLabel: 'Background image',
    contentLabel: 'Hero stats (JSON)',
    contentHint: 'JSON array of stats. Example: [{"value":"1500+","label":"Students enrolled"}]',
  },
  benefits: {
    label: 'Why Choose Us',
    contentType: 'json',
    showTitle: true,
    showSubtitle: true,
    showImage: false,
    contentLabel: 'Benefit cards (JSON)',
    contentHint: 'JSON array. Example: [{"title":"...","description":"..."}]',
  },
  about: {
    label: 'About',
    contentType: 'lines',
    lineField: 'paragraphs',
    showTitle: true,
    showSubtitle: true,
    showImage: true,
    imageLabel: 'About section image',
    contentLabel: 'Paragraphs',
    contentHint: 'Enter one paragraph per line. Each line becomes a separate paragraph on the website.',
  },
  academic: {
    label: 'Academics',
    contentType: 'lines',
    lineField: 'highlights',
    secondaryLineField: 'achievements',
    showTitle: true,
    showSubtitle: true,
    showImage: false,
    contentLabel: 'Highlights',
    contentHint: 'Enter one highlight per line. Each line appears as a bullet point on the website.',
    secondaryContentLabel: 'Achievement chips',
    secondaryContentHint: 'Enter one achievement per line. Shown as cards in the academics section.',
  },
  facilities: {
    label: 'Facilities',
    contentType: 'repeater',
    repeaterItemLabel: 'Facility',
    repeaterFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    showTitle: true,
    showSubtitle: true,
    showImage: false,
  },
  studentLife: {
    label: 'Student Life',
    contentType: 'repeater',
    repeaterItemLabel: 'Activity',
    repeaterFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
    showTitle: true,
    showSubtitle: true,
    showImage: false,
  },
  leadership: {
    label: 'Leadership',
    contentType: 'repeater',
    repeaterItemLabel: 'Profile',
    repeaterFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'position', label: 'Position', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'image', label: 'Photo', type: 'image' },
    ],
    showTitle: true,
    showSubtitle: true,
    showImage: false,
  },
  admissions: {
    label: 'Admissions',
    contentType: 'json',
    showTitle: true,
    showSubtitle: true,
    showImage: false,
    contentLabel: 'Admission steps (JSON)',
    contentHint: 'JSON object with steps array. Example: {"steps":[{"label":"01","title":"...","description":"..."}]}',
  },
  contact: {
    label: 'Contact & Footer',
    contentType: 'json',
    showTitle: false,
    showSubtitle: true,
    showImage: false,
    contentLabel: 'Contact details (JSON)',
    contentHint: 'JSON object. Example: {"phone":"...","altPhone":"...","email":"...","address":"..."}',
  },
};

export const SECTION_KEYS = Object.keys(SECTION_CONFIG);

/** Map static fallback data into the same shape as a DB site_content row. */
export function fallbackToSectionRow(sectionKey) {
  const fallback = fallbackContent[sectionKey];
  if (!fallback) {
    return { title: '', subtitle: '', content: null, image_url: '', status: 'published' };
  }

  switch (sectionKey) {
    case 'brand':
      return {
        title: fallback.title,
        subtitle: fallback.subtitle,
        content: { tagline: fallback.tagline, description: fallback.description },
        image_url: fallback.logo || '',
      };
    case 'hero':
      return {
        title: '',
        subtitle: '',
        content: fallback.stats,
        image_url: fallback.background || '',
      };
    case 'benefits':
      return {
        title: 'Why Parents Choose Us',
        subtitle: 'A school built around affordability, facilities, and trust.',
        content: fallback,
        image_url: '',
      };
    case 'about':
      return {
        title: fallback.title,
        subtitle: '',
        content: { paragraphs: fallback.paragraphs },
        image_url: fallback.image || '',
      };
    case 'academic':
      return {
        title: fallback.title,
        subtitle: fallback.description,
        content: {
          highlights: fallback.highlights,
          achievements: [
            '1500+ students guided',
            'CBSE-pattern KG classes',
            'Free summer sports camp',
            'Play zone for young learners',
          ],
        },
        image_url: '',
      };
    case 'facilities':
      return {
        title: 'Spaces and services designed around student wellbeing.',
        subtitle: 'Every facility is chosen to support learning, play, health and the strong cultural identity of the school.',
        content: fallback,
        image_url: '',
      };
    case 'studentLife':
      return {
        title: 'A lively campus day where learning meets culture and sports.',
        subtitle: 'The school brings together academic learning, performances, competitions and community celebrations in one active environment.',
        content: fallback,
        image_url: '',
      };
    case 'leadership':
      return {
        title: 'Guiding every child with care, discipline and conviction.',
        subtitle: 'The school leadership shares a clear vision for success and character-building at every stage of learning.',
        content: fallback,
        image_url: '',
      };
    case 'admissions':
      return {
        title: fallback.title,
        subtitle: fallback.description,
        content: { steps: fallback.steps },
        image_url: '',
      };
    case 'contact':
      return {
        title: '',
        subtitle: 'Our admissions team is ready to answer questions about fees, transport, student life and enrollment.',
        content: fallback,
        image_url: '',
      };
    default:
      return { title: '', subtitle: '', content: fallback, image_url: '' };
  }
}

export function withDefaultStatus(row) {
  return { status: 'published', ...row };
}

/** Resolve section data for admin: DB row if present, otherwise static fallback. */
export function resolveSectionData(sectionKey, sections) {
  const row = sections[sectionKey] ?? fallbackToSectionRow(sectionKey);
  return withDefaultStatus(row);
}

/** Ensure every configured section exists in the admin sections map. */
export function mergeSectionsWithFallbacks(dbSections) {
  return SECTION_KEYS.reduce((acc, key) => {
    acc[key] = withDefaultStatus(dbSections[key] ?? fallbackToSectionRow(key));
    return acc;
  }, {});
}

export function getSectionConfig(sectionKey) {
  return SECTION_CONFIG[sectionKey] ?? SECTION_CONFIG.hero;
}
