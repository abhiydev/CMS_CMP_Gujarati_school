import { Helmet } from 'react-helmet-async';

export default function SeoMeta({ title, description, image, url }) {
  const pageTitle = title || 'Shree Gujarati Samaj School';
  const pageDescription = description || 'Affordable Gujarati education in Indore with strong community values, modern facilities, and trusted admissions support.';
  const pageUrl = url || window.location.href;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {image ? <meta name="twitter:image" content={image} /> : null}
    </Helmet>
  );
}
