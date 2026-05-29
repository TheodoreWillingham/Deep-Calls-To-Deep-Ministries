const episodes = [
  {
    id: 1,
    title: 'Lies That Sabotage Our Walk',
    description: 'Uncovering the subtle lies that keep us from the abundant life God offers—and the truth that sets us free.',
  },
  {
    id: 2,
    title: 'Be Still and Know',
    description: 'A guided meditation on Psalm 46:10 and learning to rest in the presence of God.',
  },
  {
    id: 3,
    title: 'Hearing God in the Deep',
    description: 'How to recognize the voice of God in the quiet—and how to respond when He calls.',
  },
];

interface MediaSectionProps {
  onGiveClick: () => void;
  onEventsClick: () => void;
}

export default function MediaSection({ onGiveClick, onEventsClick }: MediaSectionProps) {
  return (
    <section className="bg-slate-900 flex flex-col items-center gap-10 md:gap-12 px-4 pb-24 md:px-10 lg:px-20 md:pb-28">
      {/* Heading */}
      <div className="w-full md:max-w-7xl md:mx-auto flex flex-col gap-2">
        <span className="font-open-sans font-bold uppercase tracking-[0.25em] text-xs text-link">
          Watch &amp; Listen
        </span>
        <h2 className="font-inter text-3xl md:text-4xl text-white leading-tight">
          Latest Videos, Podcasts &amp; More
        </h2>
      </div>

      {/* Cards */}
      <div className="flex gap-4 items-stretch w-full overflow-x-auto scrollbar-hide py-1 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:max-w-7xl md:mx-auto">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="flex flex-col w-72 min-w-72 rounded-2xl overflow-hidden md:w-auto md:min-w-0 cursor-pointer group ring-1 ring-white/10"
          >
            <div className="overflow-hidden">
              <img
                src="/assets/video-thumb.jpg"
                alt={ep.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="bg-slate-800 flex flex-col gap-2 p-5 flex-1">
              <h3 className="font-bold text-lg leading-snug text-white md:text-xl">{ep.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{ep.description}</p>
            </div>
          </div>
        ))}
      </div>

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
    </section>
  );
}
