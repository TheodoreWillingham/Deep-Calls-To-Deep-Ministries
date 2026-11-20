import { useRef, useState } from 'react';
import { supabase } from './supabaseClient';
import { lookupBook, uploadCover, type BookItem } from './bookUtils';

interface BookFormModalProps {
  book: BookItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  'w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm';

export default function BookFormModal({ book, onClose, onSaved }: BookFormModalProps) {
  const isEdit = book !== null;

  const [buyUrl, setBuyUrl] = useState(book?.buy_url ?? '');
  const [title, setTitle] = useState(book?.title ?? '');
  const [description, setDescription] = useState(book?.description ?? '');
  const [coverUrl, setCoverUrl] = useState(book?.cover_url ?? '');

  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAutofill() {
    setError(null);
    setNotice(null);
    const trimmed = buyUrl.trim();
    if (!/^https:\/\//i.test(trimmed)) {
      setError('Paste the full link to the book, starting with https://');
      return;
    }
    setFetching(true);
    const meta = await lookupBook(trimmed);
    setFetching(false);
    if (!meta) {
      setError('Could not find that book from the link. You can fill in the details yourself below.');
      return;
    }
    setTitle(meta.title);
    setDescription(meta.description ?? '');
    if (meta.cover_url) setCoverUrl(meta.cover_url);
    setNotice('Details filled in. Check them over and edit anything you like before saving.');
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      setCoverUrl(await uploadCover(file));
    } catch (err) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message;
      setError(message || 'Could not upload that image.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('A title is required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      cover_url: coverUrl.trim() || null,
      buy_url: buyUrl.trim() || null,
    };

    try {
      if (isEdit && book) {
        const { error: updateError } = await supabase.from('books').update(payload).eq('id', book.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('books').insert([payload]);
        if (insertError) throw insertError;
      }
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message;
      console.error('Error saving book:', message);
      setError(message || 'Failed to save.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto pt-20 md:pt-28 pb-10 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden">
        <div className="bg-accent px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg m-0">{isEdit ? 'Edit Book' : 'Add Book'}</h2>
          <button onClick={onClose} className="text-white bg-transparent border-none cursor-pointer p-0" aria-label="Close">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-gray-300 text-xs font-semibold">Link to buy the book (Amazon, etc.)</span>
            <input
              type="url"
              value={buyUrl}
              onChange={(e) => setBuyUrl(e.target.value)}
              placeholder="Paste the book's Amazon link"
              className={inputClass}
            />
          </label>
          <button
            type="button"
            onClick={handleAutofill}
            disabled={fetching || !buyUrl.trim()}
            className="bg-transparent border border-gray-600 text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {fetching ? 'Looking up...' : 'Fill in details from link'}
          </button>

          <label className="flex flex-col gap-1">
            <span className="text-gray-300 text-xs font-semibold">Title *</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-gray-300 text-xs font-semibold">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={`${inputClass} resize-y`}
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-gray-300 text-xs font-semibold">Cover image</span>
            {coverUrl ? (
              <img src={coverUrl} alt="Cover preview" className="w-28 h-40 object-cover rounded-sm" />
            ) : (
              <p className="text-gray-500 text-xs m-0">No cover yet.</p>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex-1 bg-transparent border border-gray-600 text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : coverUrl ? 'Upload a different cover' : 'Upload a cover'}
              </button>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="bg-transparent border border-gray-600 text-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {notice && <p className="text-green-400 text-sm m-0">{notice}</p>}
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
              disabled={saving || uploading}
              className="flex-1 bg-accent hover:bg-accent-hover border-none text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
