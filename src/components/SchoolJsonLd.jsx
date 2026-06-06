import { Helmet } from 'react-helmet-async';

const SITE_URL = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || '';

export default function SchoolJsonLd({ brand, contact, logo }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['School', 'EducationalOrganization'],
    name: brand?.title || 'Shree Gujarati Samaj School',
    alternateName: 'CMP Gujarati Samaj School',
    description: brand?.description || brand?.tagline,
    url: SITE_URL || undefined,
    logo: logo || undefined,
    image: logo || undefined,
    telephone: contact?.phone,
    email: contact?.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1, Nasiya Road',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.7114389,
      longitude: 75.868951,
    },
    foundingDate: '1957',
    areaServed: 'Indore',
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
