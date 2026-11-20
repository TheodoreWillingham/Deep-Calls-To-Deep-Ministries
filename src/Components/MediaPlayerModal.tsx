import { getEmbedUrl, type MediaItem } from './mediaUtils';

export default function MediaPlayerModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const embed = getEmbedUrl(item);
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4" onClick={onClose}>
      <div className="w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-white font-bold text-base m-0 truncate">{item.title}</h2>
          <button onClick={onClose} className="text-white bg-transparent border-none cursor-pointer text-2xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>
        {embed ? (
          <iframe
            src={embed}
            title={item.title}
            className={`w-full border-0 ${item.kind === 'video' ? 'aspect-video' : 'h-48'}`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="text-gray-300 text-sm px-5 pb-5 m-0">
            <a href={item.url} target="_blank" rel="noreferrer" className="text-link">Open in a new tab</a>
          </p>
        )}
      </div>
    </div>
  );
}
