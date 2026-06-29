import { useEffect, useMemo, useState } from 'react';

import { asArray, fetchGallery, fetchNotices, fetchSiteContent } from '../services/contentService.js';

import { fallbackContent } from '../data.js';



const mergeSectionArray = (content, fallback) =>

  Array.isArray(content) ? content : fallback;



const isPublished = (section) => !section || section.status !== 'draft';



const mergeContent = (dbContent) => {

  const aboutContent = dbContent.about?.content;

  const academicContent = dbContent.academic?.content;

  const admissionsContent = dbContent.admissions?.content;

  const heroContent = dbContent.hero?.content;



  return {

    brand: isPublished(dbContent.brand)

      ? {

          ...fallbackContent.brand,

          ...dbContent.brand?.content,

          title: dbContent.brand?.title ?? fallbackContent.brand.title,

          subtitle: dbContent.brand?.subtitle ?? fallbackContent.brand.subtitle,

          logo: dbContent.brand?.image_url || fallbackContent.brand.logo,

        }

      : fallbackContent.brand,

    hero: isPublished(dbContent.hero)

      ? {

          ...fallbackContent.hero,

          title: dbContent.hero?.title ?? fallbackContent.hero.title,

          subtitle: dbContent.hero?.subtitle ?? fallbackContent.hero.subtitle,

          background: dbContent.hero?.image_url || fallbackContent.hero.background,

          stats: mergeSectionArray(heroContent, fallbackContent.hero.stats),

        }

      : fallbackContent.hero,

    benefits: isPublished(dbContent.benefits)

      ? mergeSectionArray(dbContent.benefits?.content, fallbackContent.benefits)

      : fallbackContent.benefits,

    about: isPublished(dbContent.about)

      ? {

          ...fallbackContent.about,

          title: dbContent.about?.title ?? fallbackContent.about.title,

          image: dbContent.about?.image_url || fallbackContent.about.image,

          paragraphs: asArray(aboutContent?.paragraphs ?? aboutContent ?? fallbackContent.about.paragraphs),

        }

      : fallbackContent.about,

    academic: isPublished(dbContent.academic)

      ? {

          ...fallbackContent.academic,

          title: dbContent.academic?.title ?? fallbackContent.academic.title,

          description: dbContent.academic?.subtitle ?? dbContent.academic?.content?.description ?? fallbackContent.academic.description,

          highlights: asArray(academicContent?.highlights ?? fallbackContent.academic.highlights),

          achievements: asArray(academicContent?.achievements ?? [

            '1500+ students guided',

            'CBSE-pattern KG classes',

            'Free summer sports camp',

            'Play zone for young learners',

          ]),

        }

      : fallbackContent.academic,

    facilities: isPublished(dbContent.facilities)

      ? mergeSectionArray(dbContent.facilities?.content, fallbackContent.facilities)

      : fallbackContent.facilities,

    studentLife: isPublished(dbContent.studentLife)

      ? mergeSectionArray(dbContent.studentLife?.content, fallbackContent.studentLife)

      : fallbackContent.studentLife,

    leadership: isPublished(dbContent.leadership)

      ? mergeSectionArray(dbContent.leadership?.content, fallbackContent.leadership)

      : fallbackContent.leadership,

    admissions: isPublished(dbContent.admissions)

      ? {

          ...fallbackContent.admissions,

          title: dbContent.admissions?.title ?? fallbackContent.admissions.title,

          description: dbContent.admissions?.subtitle ?? admissionsContent?.description ?? fallbackContent.admissions.description,

          steps: mergeSectionArray(admissionsContent?.steps, fallbackContent.admissions.steps),

        }

      : fallbackContent.admissions,

    contact: isPublished(dbContent.contact)

      ? { ...fallbackContent.contact, ...dbContent.contact?.content }

      : fallbackContent.contact,

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

          fetchNotices({ publishedOnly: true }),

        ]);



        if (!active) return;



        setContent(mergeContent(dbContent));

        setGallery(

          Array.isArray(dbGallery) && dbGallery.length > 0

            ? dbGallery

                .map((item) => (typeof item.image_url === 'string' ? item.image_url.trim() : ''))

                .filter(Boolean)

            : fallbackContent.galleryImages,

        );

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


