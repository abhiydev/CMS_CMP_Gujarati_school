import { useState } from 'react';

export default function NoticesBanner({ notices }) {
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dismissed_notices') ?? '[]');
    } catch {
      return [];
    }
  });

  const visible = notices.filter((n) => !dismissedIds.includes(n.id)).slice(0, 3);
  if (visible.length === 0) return null;

  const dismiss = (id) => {
    const next = [...dismissedIds, id];
    setDismissedIds(next);
    localStorage.setItem('dismissed_notices', JSON.stringify(next));
  };

  return (
    <section className="border-b border-indigo-100 bg-indigo-50/90" aria-label="School notices">
      <div className="mx-auto max-w-7xl space-y-3 px-6 py-4 lg:px-8">
        {visible.map((notice) => (
          <article
            key={notice.id}
            className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/80 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                School notice · {new Date(notice.publish_date).toLocaleDateString()}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">{notice.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{notice.description}</p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(notice.id)}
              aria-label={`Dismiss notice: ${notice.title}`}
              className="shrink-0 min-h-[44px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Dismiss
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
