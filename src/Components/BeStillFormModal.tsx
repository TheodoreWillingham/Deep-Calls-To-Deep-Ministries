import { useState } from 'react';
import { supabase } from './supabaseClient';

export interface BeStillMoment {
  id: number;
  title: string | null;
  pray: string;
  rest: string;
  action: string;
  yield_text: string;
}

interface Props {
  moment: BeStillMoment | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  'w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm';

export default function BeStillFormModal({ moment, onClose, onSaved }: Props) {
  const isEdit = moment !== null;
  const [title, setTitle] = useState(moment?.title ?? '');
  const [pray, setPray] = useState(moment?.pray ?? '');
  const [rest, setRest] = useState(moment?.rest ?? '');
  const [action, setAction] = useState(moment?.action ?? '');
  const [yieldText, setYieldText] = useState(moment?.yield_text ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!pray.trim() && !rest.trim() && !action.trim() && !yieldText.trim()) {
      setError('Fill in at least one of Pray, Rest, Action, or Yield.');
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim() || null,
      pray: pray.trim(),
      rest: rest.trim(),
      action: action.trim(),
      yield_text: yieldText.trim(),
    };
    try {
      const { error: saveError } = isEdit && moment
        ? await supabase.from('be_still_moments').update(payload).eq('id', moment.id)
        : await supabase.from('be_still_moments').insert([payload]);
      if (saveError) throw saveError;
      onSaved();
    } catch (err: any) {
      console.error('Error saving be still moment:', err.message);
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  const fields: [string, string, (v: string) => void][] = [
    ['Pray', pray, setPray],
    ['Rest', rest, setRest],
    ['Action', action, setAction],
    ['Yield', yieldText, setYieldText],
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto pt-20 md:pt-28 pb-10 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden">
        <div className="bg-accent px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg m-0">
            {isEdit ? 'Edit Be Still Moment' : 'Add Be Still Moment'}
          </h2>
          <button onClick={onClose} className="text-white bg-transparent border-none cursor-pointer p-0 text-2xl leading-none" aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-gray-300 text-xs font-semibold">Title (optional)</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </label>

          {fields.map(([label, value, set]) => (
            <label key={label} className="flex flex-col gap-1">
              <span className="text-gray-300 text-xs font-semibold">{label}</span>
              <textarea value={value} onChange={(e) => set(e.target.value)} rows={3} className={`${inputClass} resize-y`} />
            </label>
          ))}

          {error && <p className="text-red-400 text-sm m-0">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={saving} className="flex-1 bg-transparent border border-gray-600 text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-accent hover:bg-accent-hover border-none text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Moment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
