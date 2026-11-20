import { useState } from 'react';
import { supabase } from './supabaseClient';
import MediaFormModal from './MediaFormModal';
import MediaPlayerModal from './MediaPlayerModal';
import { FALLBACK_THUMB, useMediaItems, type MediaItem } from './mediaUtils';

interface MediaPageProps {
  isAdmin?: boolean;
}

interface Section {
  title: string;
  items: MediaItem[];
}

function MediaCard({
  item,
  isAdmin,
  onPlay,
  onEdit,
  onDelete,
}: {
  item: MediaItem;
  isAdmin: boolean;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="shrink-0 w-72 md:w-80 lg:w-96 rounded-xl overflow-hidden bg-slate-800 group">
      <div className="relative aspect-[16/9] overflow-hidden cursor-pointer" onClick={onPlay}>
        <img
          src={item.thumbnail_url || FALLBACK_THUMB}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="bg-slate-800 p-4 md:p-5 flex flex-col gap-2">
        <h3
          className="text-white font-bold text-sm md:text-base m-0 leading-snug truncate cursor-pointer"
          onClick={onPlay}
          title={item.title}
        >
          {item.title}
        </h3>
        {item.description && (
          <p className="text-gray-400 text-xs md:text-sm m-0 leading-relaxed line-clamp-2">{item.description}</p>
        )}
        {isAdmin && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={onEdit}
              className="text-white bg-transparent border border-white/40 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-white/10"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-300 bg-transparent border border-red-300/40 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-red-300/10"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaPage({ isAdmin = false }: MediaPageProps) {
  const { items, loading, refresh } = useMediaItems();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [playing, setPlaying] = useState<MediaItem | null>(null);

  const sections: Section[] = [
    { title: 'Recently Added', items: items.slice(0, 8) },
    { title: 'Videos', items: items.filter((i) => i.kind === 'video') },
    { title: 'Podcast Episodes', items: items.filter((i) => i.kind === 'podcast') },
  ].filter((s) => s.items.length > 0);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(item: MediaItem) {
    setEditing(item);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(item: MediaItem) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('media_items').delete().eq('id', item.id);
    if (error) {
      console.error('Error deleting media:', error.message);
      window.alert('Failed to delete.');
      return;
    }
    refresh();
  }

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-stretch pt-20 md:pt-24 pb-28 gap-12 md:gap-16 stagger-rise">
      <div className="w-full px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 grid grid-cols-[1fr_auto_1fr] items-center">
        <span aria-hidden />
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center m-0">Media</h1>
        <div className="flex justify-end">
          {isAdmin && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-accent hover:bg-accent-hover text-white border-none rounded-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base cursor-pointer transition-colors"
              aria-label="Add media"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <p className="text-gray-400 text-center text-sm py-16 m-0">
          {isAdmin ? 'Nothing here yet. Use the Add button to post a video or podcast.' : 'New videos and podcasts are coming soon.'}
        </p>
      ) : (
        sections.map((section) => (
          <div key={section.title} className="w-full flex flex-col gap-4 md:gap-5">
            <div className="px-6 md:px-10 lg:px-16">
              <h2 className="text-white text-sm md:text-base font-medium tracking-wide m-0">{section.title}</h2>
            </div>
            <div className="flex gap-4 md:gap-6 px-6 md:px-10 lg:px-16 scroll-px-6 md:scroll-px-10 lg:scroll-px-16 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth">
              {section.items.map((item) => (
                <div key={item.id} className="snap-start">
                  <MediaCard
                    item={item}
                    isAdmin={isAdmin}
                    onPlay={() => setPlaying(item)}
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showForm && (
        <MediaFormModal
          item={editing}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            refresh();
          }}
        />
      )}
      {playing && <MediaPlayerModal item={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
