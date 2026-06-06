import { useEffect, useMemo, useState } from 'react';
import { fetchGallery, fetchNotices, fetchSiteContent } from '../services/contentService';
import { fallbackContent } from '../data';

const mergeContent = (dbContent) => {
  return {
    brand: dbContent.brand ?? fallbackContent.brand,
    hero: dbContent.hero ?? fallbackContent.hero,
    benefits: dbContent.benefits?.content ?? fallbackContent.benefits,
    about: {
      ...fallbackContent.about,
      ...dbContent.about,
      paragraphs: dbContent.about?.content ?? fallbackContent.about.paragraphs,
    },
    academic: {
      ...fallbackContent.academic,
      ...dbContent.academic,
      highlights: dbContent.academic?.content?.highlights ?? fallbackContent.academic.highlights,
      description: dbContent.academic?.content?.description ?? fallbackContent.academic.description,
    },
    facilities: dbContent.facilities?.content ?? fallbackContent.facilities,
    studentLife: dbContent.studentLife?.content ?? fallbackContent.studentLife,
    leadership: dbContent.leadership?.content ?? fallbackContent.leadership,
    admissions: {
      ...fallbackContent.admissions,
      ...dbContent.admissions,
      steps: dbContent.admissions?.content?.steps ?? fallbackContent.admissions.steps,
      description: dbContent.admissions?.content?.description ?? fallbackContent.admissions.description,
    },
    contact: dbContent.contact?.content ?? fallbackContent.contact,
  };
};

export function useSiteData() {
  const [content, setContent] = useState(fallbackContent);
  const [gallery, setGallery] = useState(fallbackContent.galleryImages);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [dbContent, dbGallery, dbNotices] = await Promise.all([
          fetchSiteContent(),
          fetchGallery(),
          fetchNotices(),
        ]);

        if (!active) return;

        setContent(mergeContent(dbContent));
        setGallery(dbGallery.length > 0 ? dbGallery.map((item) => item.image_url) : fallbackContent.galleryImages);
        setNotices(dbNotices);
      } catch (err) {
        if (active) {
          setError(err);
          setContent(fallbackContent);
          setGallery(fallbackContent.galleryImages);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return useMemo(
    () => ({ content, gallery, notices, loading, error }),
    [content, gallery, notices, loading, error],
  );
}
