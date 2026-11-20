import { useState } from 'react';
import { supabase } from './supabaseClient';
import { detectKind, lookupMetadata, type MediaItem } from './mediaUtils';

interface MediaFormModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  'w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm';

export default function MediaFormModal({ item, onClose, onSaved }: MediaFormModalProps) {
  const isEdit = item !== null;

  const [url, setUrl] = useState(item?.url ?? '');
  // Title and description are filled in automatically when adding. They are only shown when editing.
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    const kind = detectKind(trimmed);
    if (!kind) {
      setError('Please paste a YouTube video link or a Spotify episode link.');
      return;
    }

    setSaving(true);
    try {
      let payload;
      if (isEdit && item) {
        if (!title.trim()) {
          setError('A title is required.');
          setSaving(false);
          return;
        }
        payload = {
          kind,
          url: trimmed,
          title: title.trim(),
          description: description.trim() || null,
        };
        const { error: updateError } = await supabase.from('media_items').update(payload).eq('id', item.id);
        if (updateError) throw updateError;
      } else {
        const meta = await lookupMetadata(kind, trimmed);
        if (!meta) {
          setError('Could not read details from that link. Double-check it and try again.');
          setSaving(false);
          return;
        }
        payload = {
          kind,
          url: trimmed,
          title: meta.title,
          description: meta.description,
          thumbnail_url: meta.thumbnail_url,
        };
        const { error: insertError } = await supabase.from('media_items').insert([payload]);
        if (insertError) throw insertError;
      }
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message;
      console.error('Error saving media:', message);
      setError(message || 'Failed to save.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto pt-20 md:pt-28 pb-10 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden">
        <div className="bg-accent px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg m-0">{isEdit ? 'Edit Media' : 'Add Media'}</h2>
          <button onClick={onClose} className="text-white bg-transparent border-none cursor-pointer p-0" aria-label="Close">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-gray-300 text-xs font-semibold">Link *</span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a YouTube or Spotify link"
              className={inputClass}
              autoFocus
              required
            />
          </label>

          {!isEdit && (
            <p className="text-gray-400 text-xs m-0">
              The title, description and thumbnail are filled in automatically.
            </p>
          )}

          {isEdit && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-gray-300 text-xs font-semibold">Title *</span>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-gray-300 text-xs font-semibold">Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </label>
            </>
          )}

          {error && <p className="text-red-400 text-sm m-0">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-transparent border border-gray-600 text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-accent hover:bg-accent-hover border-none text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50 transition-colors"
            >
              {saving ? (isEdit ? 'Saving...' : 'Adding...') : isEdit ? 'Save Changes' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
