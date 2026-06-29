import AdminImageField from './AdminImageField.jsx';

const emptyItem = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

export default function RepeaterEditor({ items, fields, itemLabel, onChange, uploadPrefix }) {
  const updateItem = (index, key, value) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addItem = () => onChange([...items, emptyItem(fields)]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <article key={index} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">
              {itemLabel} {index + 1}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40"
              >
                Move up
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 disabled:opacity-40"
              >
                Move down
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field) => {
              if (field.type === 'image') {
                return (
                  <AdminImageField
                    key={field.key}
                    label={field.label}
                    value={item[field.key] || ''}
                    onChange={(url) => updateItem(index, field.key, url)}
                    uploadPrefix={`${uploadPrefix}/${index}`}
                  />
                );
              }

              if (field.type === 'textarea') {
                return (
                  <label key={field.key} className="block">
                    <span className="text-sm font-medium text-slate-700">{field.label}</span>
                    <textarea
                      value={item[field.key] || ''}
                      onChange={(event) => updateItem(index, field.key, event.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </label>
                );
              }

              return (
                <label key={field.key} className="block">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <input
                    value={item[field.key] || ''}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </label>
              );
            })}
          </div>
        </article>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
      >
        Add {itemLabel}
      </button>
    </div>
  );
}
