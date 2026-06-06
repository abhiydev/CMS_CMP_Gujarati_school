import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, description, variant = 'light' }) {
  const isDark = variant === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto max-w-3xl text-center"
    >
      {eyebrow ? (
        <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`mt-4 text-3xl font-semibold tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <p className={`mt-4 text-base leading-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
    </motion.div>
  );
}
