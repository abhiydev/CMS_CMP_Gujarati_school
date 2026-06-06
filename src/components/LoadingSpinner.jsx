export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-24 text-slate-900">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-soft">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-lg font-semibold">{message}</p>
        <p className="max-w-sm text-sm text-slate-500">If the site is taking longer than expected, refresh the page after a moment.</p>
      </div>
    </div>
  );
}
