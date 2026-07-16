import { Helmet } from 'react-helmet-async';
import {
  AUTHOR,
  DEFAULT_OG_IMAGE,
  LANGUAGE,
  LOCALE,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
  SCHOOL_ADDRESS,
  THEME_COLOR,
  buildDescription,
  buildTitle,
  getPageUrl,
} from '../config/seo.js';

const SITE_GEO = {
  latitude: 22.7114389,
  longitude: 75.868951,
};

function buildSchoolSchema({ brand, contact, logo, image }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['School', 'EducationalOrganization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#school`,
    name: brand?.title || SITE_NAME,
    alternateName: [SITE_SHORT_NAME, SITE_ALTERNATE_NAME],
    description: buildDescription(brand?.description || brand?.tagline),
    url: SITE_URL,
    logo: logo ? getAbsoluteUrl(logo) : DEFAULT_OG_IMAGE,
    image: image ? getAbsoluteUrl(image) : logo ? getAbsoluteUrl(logo) : DEFAULT_OG_IMAGE,
    telephone: contact?.phone,
    email: contact?.email,
    address: {
      '@type': 'PostalAddress',
      ...SCHOOL_ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_GEO.latitude,
      longitude: SITE_GEO.longitude,
    },
    foundingDate: '1957',
    areaServed: {
      '@type': 'City',
      name: 'Indore',
    },
    priceRange: '₹',
  };

  return schema;
}

function getAbsoluteUrl(url) {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return url;
}

export default function SEO({
  title,
  description,
  image,
  url,
  noindex = false,
  schema,
  brand,
  contact,
  logo,
  preloadImage,
}) {
  const pageTitle = buildTitle(title);
  const pageDescription = buildDescription(description);
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : `${SITE_URL}/`);
  const canonicalBase = pageUrl.split('#')[0].replace(/\/$/, '') || SITE_URL;
  const normalizedCanonical = canonicalBase === SITE_URL ? `${SITE_URL}/` : pageUrl.split('#')[0];
  const ogImage = getAbsoluteUrl(image) || DEFAULT_OG_IMAGE;
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
  const jsonLd = schema ?? (brand || contact ? buildSchoolSchema({ brand, contact, logo, image }) : null);
  const preloadSrc = getAbsoluteUrl(preloadImage);

  return (
    <Helmet>
      <html lang={LANGUAGE} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content={AUTHOR} />
      <meta name="theme-color" content={THEME_COLOR} />
      <meta httpEquiv="content-language" content={LANGUAGE} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={normalizedCanonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${SITE_SHORT_NAME} campus and students`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SITE_SHORT_NAME} campus and students`} />

      {preloadSrc ? (
        <link rel="preload" as="image" href={preloadSrc} fetchPriority="high" />
      ) : null}

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
