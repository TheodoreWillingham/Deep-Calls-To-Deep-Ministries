import { useState } from 'react';
import MediaPlayerModal from './MediaPlayerModal';
import { FALLBACK_THUMB, useMediaItems, type MediaItem } from './mediaUtils';

interface MediaSectionProps {
  onGiveClick: () => void;
  onEventsClick: () => void;
}

export default function MediaSection({ onGiveClick, onEventsClick }: MediaSectionProps) {
  const { items } = useMediaItems();
  const [playing, setPlaying] = useState<MediaItem | null>(null);
  const episodes = items.slice(0, 3);

  return (
    <section className="bg-slate-900 flex flex-col items-center gap-10 md:gap-12 px-4 pb-24 md:px-10 lg:px-20 md:pb-28">
      {/* Heading */}
      <div className="w-full md:max-w-7xl md:mx-auto flex flex-col gap-2">
        <span className="font-open-sans font-semibold tracking-wide text-base md:text-lg text-link">
          Watch &amp; Listen
        </span>
        <h2 className="font-inter text-3xl md:text-4xl text-white leading-tight">
          Latest Videos, Podcasts &amp; More
        </h2>
      </div>

      {/* Cards */}
      {episodes.length > 0 && (
        <div className="flex gap-4 items-stretch w-full overflow-x-auto scrollbar-hide py-1 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:max-w-7xl md:mx-auto">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => setPlaying(ep)}
              className="flex flex-col w-72 min-w-72 rounded-2xl overflow-hidden md:w-auto md:min-w-0 cursor-pointer group ring-1 ring-white/10"
            >
              <div className="overflow-hidden">
                <img
                  src={ep.thumbnail_url || FALLBACK_THUMB}
                  alt={ep.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-slate-800 flex flex-col gap-2 p-5 flex-1">
                <h3 className="font-bold text-lg leading-snug text-white md:text-xl">{ep.title}</h3>
                {ep.description && (
                  <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">{ep.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full max-w-md mt-2 md:flex-row md:max-w-2xl md:mx-auto md:gap-4">
        <button
          onClick={onGiveClick}
          className="flex-1 py-4 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-base md:text-lg border-none cursor-pointer transition-colors"
        >
          Support DCTDM
        </button>
        <button
          onClick={onEventsClick}
          className="flex-1 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base md:text-lg border border-white/40 cursor-pointer transition-colors"
        >
          Find an Event or Host One
        </button>
      </div>

      {playing && <MediaPlayerModal item={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
