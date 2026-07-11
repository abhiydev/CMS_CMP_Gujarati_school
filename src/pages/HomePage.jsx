import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SectionHeading from '../components/SectionHeading.jsx';
import GalleryLightbox from '../components/GalleryLightbox.jsx';
import GalleryCard from '../components/GalleryCard.jsx';
import GalleryModal from '../components/GalleryModal.jsx';
import NoticesBanner from '../components/NoticesBanner.jsx';
import SafeImage from '../components/SafeImage.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import SeoMeta from '../components/SeoMeta.jsx';
import SchoolJsonLd from '../components/SchoolJsonLd.jsx';
import { useSiteData } from '../hooks/useSiteData.jsx';
import { asArray, fetchGalleryAlbums } from '../services/contentService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const navItems = [
  { label: 'Why Choose Us', href: '#why' },
  { label: 'About', href: '#about' },
  { label: 'Academics', href: '#academics' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Student Life', href: '#student-life' },
  { label: 'Admissions', href: '#admissions' },
  { label: 'Contact', href: '#contact' },
];

export default function HomePage() {
  const [activeImage, setActiveImage] = useState(null);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [galleryAlbums, setGalleryAlbums] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const { content, gallery, notices, loading } = useSiteData();

  const brand = content.brand;
  const hero = content.hero;
  const benefits = content.benefits;
  const about = content.about;
  const academic = content.academic;
  const facilities = content.facilities;
  const studentLife = content.studentLife;
  const leadership = content.leadership;
  const admissions = content.admissions;
  const contact = content.contact;

  // Load gallery albums
  useEffect(() => {
    let active = true;
    const loadGallery = async () => {
      try {
        const albums = await fetchGalleryAlbums();
        if (active) {
          setGalleryAlbums(albums);
          setGalleryLoading(false);
        }
      } catch (err) {
        console.error('Failed to load gallery albums:', err);
        if (active) setGalleryLoading(false);
      }
    };
    loadGallery();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <LoadingSpinner message="Loading school content…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <SeoMeta
        title={brand.title}
        description={brand.description || brand.tagline}
        image={hero.background || hero.image_url}
      />
      <SchoolJsonLd brand={brand} contact={contact} logo={brand.logo} />

      <header className="sticky scroll-fixed w-screen top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <img
              src={brand.logo}
              alt="Smt. C.M.P Gujarati School logo"
              className="h-11 w-auto sm:h-12 md:h-15 object-contain"
            />

            <div className="min-w-0 leading-tight">
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
                Smt. C.M.P Gujarati
              </p>

              <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                Primary & Middle School
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="
            relative text-sm font-medium text-slate-600
            transition-colors duration-200
            hover:text-slate-900
          "
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`tel:${contact.phone}`}
              className="
          inline-flex min-h-[42px] items-center justify-center
          rounded-full border border-slate-300
          bg-indigo-600 hover:bg-indigo-700
          px-4 py-2 text-sm font-medium text-white
          transition
          lg:hidden
        "
            >
              Call
            </a>

            <a
              href={`tel:${contact.phone}`}
              className="
          hidden min-h-[44px] items-center justify-center
          rounded-full bg-indigo-600
          px-5 py-2.5 text-sm font-semibold text-white
          shadow-sm shadow-indigo-500/20
          transition hover:bg-indigo-700
          lg:inline-flex
        "
            >
              Call Admissions
            </a>
          </div>
        </div>
      </header>

      <NoticesBanner notices={notices} />

      <main>
        <section id="home" className="relative min-h-[560px] overflow-hidden sm:min-h-[620px]">
          <div className="absolute inset-0 bg-slate-950/60" />
          <img src={hero.background || hero.image_url} alt="Students at Smt. C.M.P Gujarati School, Indore" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end bg-slate-950/50 px-6 py-6 rounded-[2rem] shadow-soft shadow-slate-900/30">
              <motion.div
                className="max-w-2xl"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">
                  Founded in Year 1957 • Indore
                </span>
                <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {hero.title || 'Heritage education, built for modern admissions.'}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white shadown-slate-950/50">
                  {hero.subtitle || 'Smt. C.M.P Gujarati School blends disciplined academics, cultural pride and affordable facilities to make every parent feel confident about their child’s future.'}
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a href="#admissions" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700">
                    Admissions Open
                  </a>
                  <a href="#contact" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-indigo-400 px-6 py-3 text-base font-semibold text-white-500 hover:bg-indigo-500">
                    Schedule a Visit
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="rounded-[2rem] border border-white/10 bg-slate-900 p-6 backdrop-blur-xl shadow-soft shadow-slate-900/20"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <h2 className="text-xl font-semibold text-white">Campus Confidence</h2>
                <p className="mt-3 text-slate-100/85">
                  Real student life, real school values and a safe admissions journey for families in Indore.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {asArray(hero.stats).map((stat) => (
                    <div key={`${stat.label}-${stat.value}`} className="rounded-3xl bg-white/10 p-5 text-white shadow-lg shadow-slate-950/20">
                      <p className="text-3xl font-semibold">{stat.value}</p>
                      <p className="mt-2 text-sm leading-6 text-indigo-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="why" className="relative overflow-hidden bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why Parents Choose Us"
              title="A school built around affordability, facilities, and trust."
              description="Our focus is on real support for children and families: modern classrooms, cultural values, and strong community leadership."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {asArray(benefits).map((item) => (
                <motion.article
                  key={item.title}
                  className="group rounded-[2rem] border border-slate-200/90 bg-white p-8 shadow-soft"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700 shadow-sm">
                    <span className="text-xl font-semibold">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-slate-600">{item.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="About the School"
                  title="Smt. C.M.P Gujarati Primary and Middle school, A Gujarati heritage school that also prepares every child for modern success."
                  description="Founded with deep community roots in 1957, the school continues to grow with disciplined teaching, strong cultural values and a student-first approach."
                />
                <div className="mt-10 space-y-6 text-base leading-8 text-slate-600">
                  {asArray(about.paragraphs).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className='object-cover'>
                <SafeImage src={"/assets/history.jpeg"} alt="" className="h-full w-full object-cover rounded-[2rem] text-center" lazy />
                <p>श्रीमती चंचलबेन मणिलाल परीख गुजराती प्राथमिक एवं माध्यमिक विद्यालय</p>
              </div>
            </div>
          </div>
        </section>

        <section id="academics" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              variant="dark"
              eyebrow="Academic Excellence"
              title="Education with a strong academic foundation."
              description="From academics to the arts, the school blends discipline with creativity to help every child flourish in their own way and build a strong foundation for future success."
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_0.95fr] lg:items-start">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft shadow-black/20">
                <h3 className="text-2xl font-semibold">Strengths we deliver</h3>
                <ul className="mt-8 space-y-5 text-slate-200">
                  {asArray(academic.highlights).map((item) => (
                    <li key={item} className="flex gap-4">
                      <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-200">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-950 shadow-soft shadow-slate-900/15 rounded-[2rem]">
              {/* history card */}
              <div className="rounded-[2rem] bg-slate-950 shadow-soft shadow-slate-900/15">
                <SafeImage src={about.image || about.image_url} alt="School event at Smt. C.M.P Gujarati Primary and Middle School" className="h-full w-full object-cover" lazy />
              </div>
              </div>
            </div>
          </div>
        </section>

        <section id="facilities" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Facilities"
              title="Spaces and services designed around student wellbeing."
              description="Every facility is chosen to support learning, play, health and the strong cultural identity of the school."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {asArray(facilities).map((item) => (
                <motion.article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <SafeImage src={item.image || item.image_url} alt={item.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" lazy />
                  <div className="relative z-10 p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Facility</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{item.description}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="student-life" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Student Life"
              title="A lively campus day where learning meets culture and sports."
              description="The school brings together academic learning, performances, competitions and community celebrations in one active environment."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {asArray(studentLife).map((item) => (
                <motion.div
                  key={item.title}
                  className="group overflow-hidden rounded-[1.75rem] bg-white shadow-soft"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <SafeImage src={item.image || item.image_url} alt={item.title} className="h-64 w-full object-cover transition duration-300 group-hover:scale-105" lazy />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Leadership Messages"
              title="Guiding every child with care, discipline and conviction."
              description="The school leadership shares a clear vision for success and character-building at every stage of learning."
            />
            <div className="leadership-carousel relative mt-12 px-0 sm:px-12 lg:px-14">
              <button
                type="button"
                className="leadership-prev absolute left-0 top-[calc(50%-2rem)] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white text-indigo-600 shadow-soft transition hover:border-indigo-200 hover:bg-indigo-50 sm:flex"
                aria-label="Previous leadership message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="leadership-next absolute right-0 top-[calc(50%-2rem)] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white text-indigo-600 shadow-soft transition hover:border-indigo-200 hover:bg-indigo-50 sm:flex"
                aria-label="Next leadership message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                </svg>
              </button>
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                className="leadership-swiper pb-12"
                spaceBetween={32}
                slidesPerView={1}
                breakpoints={{
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 32,
                  },
                }}
                loop={asArray(leadership).length > 1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  el: '.leadership-pagination',
                }}
                navigation={{
                  prevEl: '.leadership-prev',
                  nextEl: '.leadership-next',
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = '.leadership-prev';
                  swiper.params.navigation.nextEl = '.leadership-next';
                  swiper.params.pagination.el = '.leadership-pagination';
                }}
                onInit={(swiper) => {
                  swiper.navigation.init();
                  swiper.navigation.update();
                  swiper.pagination.init();
                  swiper.pagination.update();
                }}
                grabCursor
              >
                {asArray(leadership).map((person) => (
                  <SwiperSlide key={person.name} className="!h-auto">
                    <motion.article
                      className="flex h-full flex-col rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <SafeImage src={person.image || person.image_url} alt={person.name} className="h-28 w-28 shrink-0 rounded-3xl object-cover shadow-lg" lazy />
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{person.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                          <p className="text-sm text-slate-500">{person.position}</p>
                        </div>
                      </div>
                      <blockquote className="mt-8 flex-1 rounded-3xl bg-slate-100 p-6 text-slate-700">
                        “{person.quote}”
                      </blockquote>
                    </motion.article>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="leadership-pagination flex justify-center" />
            </div>
          </div>
        </section>

        <ErrorBoundary name="gallery-section" fallbackTitle="Gallery temporarily unavailable">
          <section id="gallery" className="bg-slate-900 py-20 text-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <SectionHeading
                variant="dark"
                eyebrow="Gallery"
                title="Real moments from school events and celebrations."
                description="Explore the school’s culture, academic activities and the joy of student life captured through real images."
              />
              {galleryLoading ? (
                <div className="mt-12 flex justify-center">
                  <LoadingSpinner message="Loading gallery albums…" />
                </div>
              ) : galleryAlbums.length > 0 ? (
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {galleryAlbums.map((album) => (
                    <GalleryCard key={album.id} album={album} onViewAlbum={setActiveAlbum} />
                  ))}
                </div>
              ) : (
                <div className="mt-12 rounded-[2rem] border border-slate-700 bg-slate-800 p-8 text-center text-slate-400">
                  <p>No gallery albums available yet.</p>
                </div>
              )}
            </div>
          </section>
        </ErrorBoundary>

        <section id="admissions" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              eyebrow="Admissions"
              title="Admission is open for curious learners and families who value strong roots and modern outcomes."
              description="Reach out today to understand the admission process, schedule a campus visit, or request more information about fees and facilities."
            />
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <div className="space-y-6 rounded-[2rem] border border-slate-200/90 bg-white p-10 shadow-soft">
                  {asArray(admissions.steps).map((step) => (
                    <div key={step.label} className="flex gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600 text-xl font-semibold text-white">
                        {step.label}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{step.title}</p>
                        <p className="mt-2 text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="min-w-0 overflow-hidden rounded-[2rem] border border-slate-200/90 bg-slate-950 p-6 sm:p-8 lg:p-10 text-white shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-400">
                  Talk to admissions
                </p>

                <h3 className="mt-4 text-2xl sm:text-3xl font-semibold leading-tight">
                  Let us help you take the next step.
                </h3>

                <p className="mt-5 leading-7 sm:leading-8 text-slate-300">
                  {admissions.description}
                </p>

                <div className="mt-8 space-y-4 text-slate-100">
                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      Phone
                    </p>

                    <a
                      href={`tel:${contact.phone}`}
                      className="mt-2 block break-words text-lg sm:text-xl font-semibold text-white hover:text-indigo-300"
                    >
                      {contact.phone}
                    </a>

                    <a
                      href={`tel:${contact.altPhone}`}
                      className="mt-2 block break-words text-sm text-slate-300 hover:text-indigo-300"
                    >
                      {contact.altPhone}
                    </a>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      Email
                    </p>

                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-2 block break-all text-lg sm:text-xl font-semibold text-white hover:text-indigo-300"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                      Address
                    </p>

                    <p className="mt-2 break-words text-slate-300">
                      {contact.address}
                    </p>
                  </div>
                </div>

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"
                >
                  Request Information
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="overflow-x-hidden bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

              <div className="min-w-0">
                <SectionHeading
                  variant="dark"
                  eyebrow="Contact"
                  title="Get in touch and visit the school in Indore."
                  description="Our admissions team is ready to answer questions about fees, transport, student life and enrollment."
                />

                <div className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-soft">

                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
                      Phone
                    </p>

                    <a
                      href={`tel:${contact.phone}`}
                      className="mt-2 block break-all text-xl sm:text-2xl font-semibold text-white hover:text-indigo-300"
                    >
                      {contact.phone}
                    </a>

                    <a
                      href={`tel:${contact.altPhone}`}
                      className="mt-1 block break-all text-slate-400 hover:text-indigo-300"
                    >
                      Alternate: {contact.altPhone}
                    </a>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
                      Email
                    </p>

                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-2 block break-all text-xl sm:text-2xl font-semibold text-white hover:text-indigo-300"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">
                      Address
                    </p>

                    <p className="mt-2 text-lg font-semibold leading-8 text-white sm:text-xl break-words">
                      {contact.address}
                    </p>
                  </div>

                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-800 p-4 sm:p-8 shadow-soft">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                  <iframe
                    title="Smt. C.M.P Gujarati School Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1977.9849983603403!2d75.86895099814929!3d22.711438918311288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd1a7c23cbb1%3A0x34c6f1f8c8907cef!2sCMP%20Gujarati%20Samaj%20School!5e0!3m2!1sen!2sin!4v1780775436123!5m2!1sen!2sin"
                    className="h-80 w-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={brand.logo} alt="Smt. C.M.P Gujarati School logo" width={48} height={48} className="h-12 w-12 shrink-0 rounded-full border border-slate-200 bg-white object-contain p-0.5" />
              <div>
                <p className="text-base font-semibold text-slate-900">Smt. C.M.P Gujarati Primary and Middle School</p>
                <p className="text-sm text-slate-500">Building trusted Gujarati education in Indore since 1957.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Quick Links</p>
              <ul className="mt-4 space-y-3 text-slate-600">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-slate-900">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Contact</p>
              <div className="mt-4 space-y-3 text-slate-600">
                <p>
                  Phone:{' '}
                  <a href={`tel:${contact.phone}`} className="hover:text-slate-900">
                    {contact.phone}
                  </a>
                </p>
                <p>
                  Alt:{' '}
                  <a href={`tel:${contact.altPhone}`} className="hover:text-slate-900">
                    {contact.altPhone}
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a href={`mailto:${contact.email}`} className="hover:text-slate-900">
                    {contact.email}
                  </a>
                </p>
                <p>{contact.address}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admissions</p>
              <p className="mt-4 text-slate-600">Call now to schedule a campus visit and start enrollment.</p>
            </div>
          </div>
        </div>
        <div className="py-2 text-center">
          <a href="https://kamiytech.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-300 hover:text-slate-400 transition-colors">
            Designed & Developed by KamiyTech ~Abhishek Chedwal
          </a>
        </div>
      </footer>

      <ErrorBoundary name="gallery-lightbox" fallbackTitle="">
        <GalleryLightbox src={activeImage} onClose={() => setActiveImage(null)} />
      </ErrorBoundary>

      <ErrorBoundary name="gallery-modal" fallbackTitle="">
        {activeAlbum && (
          <GalleryModal album={activeAlbum} onClose={() => setActiveAlbum(null)} />
        )}
      </ErrorBoundary>
    </div>
  );
}
