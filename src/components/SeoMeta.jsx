import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Shree Gujarati Samaj School';
const DEFAULT_DESCRIPTION =
  'Shree Gujarati Samaj School in Indore offers affordable heritage Gujarati education, CBSE-aligned KG classes, modern facilities, and trusted admissions support since 1957.';

const getSiteUrl = () => {
  if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
};

const buildTitle = (title) => {
  const trimmed = String(title ?? '').trim();
  if (!trimmed) return `${SITE_NAME} | Indore Admissions & Heritage Education`;
  if (trimmed.includes('Shree Gujarati') || trimmed.includes(SITE_NAME)) return trimmed;
  return `${trimmed} | ${SITE_NAME}, Indore`;
};

const buildDescription = (description) => {
  const trimmed = String(description ?? '').trim();
  return trimmed || DEFAULT_DESCRIPTION;
};

export default function SeoMeta({ title, description, image, url, noindex = false }) {
  const pageTitle = buildTitle(title);
  const pageDescription = buildDescription(description);
  const siteUrl = getSiteUrl();
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const ogImage = image || (siteUrl ? `${siteUrl}/favicon.svg` : undefined);

  return (
    <Helmet>
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={pageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
    </Helmet>
  );
}
