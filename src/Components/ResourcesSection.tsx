interface ResourcesSectionProps {
  onPrayersClick: () => void;
  onEventsClick: () => void;
}

function LocationPinIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 105 105" fill="none" className="shrink-0">
      <path
        d="M52.5 8.75C37.3 8.75 25 21.05 25 36.25c0 22.5 27.5 60 27.5 60s27.5-37.5 27.5-60c0-15.2-12.3-27.5-27.5-27.5zm0 37.5c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"
        fill="white"
      />
    </svg>
  );
}

export default function ResourcesSection({ onPrayersClick, onEventsClick }: ResourcesSectionProps) {
  return (
    <section className="bg-slate-900 flex flex-col items-center gap-12 md:gap-16 px-4 py-16 md:px-10 lg:px-20 md:py-24">
      {/* Intro */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl">
        <span className="font-open-sans font-bold uppercase tracking-[0.25em] text-xs text-link">
          Grow With Us
        </span>
        <h2 className="font-inter text-3xl md:text-5xl text-white leading-tight">
          Resources to help grow your relationship with God.
        </h2>
      </div>

      <div className="flex flex-col items-center gap-6 md:gap-8 w-full md:grid md:grid-cols-2 md:max-w-7xl">
        {/* Prayers Card */}
        <div
          onClick={onPrayersClick}
          className="relative w-full aspect-[676/379] rounded-3xl overflow-hidden flex flex-col justify-end p-6 md:p-10 md:aspect-[16/10] cursor-pointer group ring-1 ring-white/10"
        >
          <img
            src="/assets/prayers-bg.jpg"
            alt="Prayers"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="relative flex flex-col gap-1 text-white drop-shadow-lg">
            <span className="font-open-sans font-extrabold text-3xl md:text-5xl">Prayers</span>
            <span className="font-open-sans font-semibold text-lg md:text-2xl text-white/85">Requests and Answers</span>
          </div>
        </div>

        {/* Media Card */}
        <div className="relative w-full aspect-[358/200] rounded-3xl overflow-hidden flex flex-col justify-end p-6 md:p-10 md:aspect-[16/10] cursor-pointer group ring-1 ring-white/10">
          <img
            src="/assets/media-bg.jpg"
            alt="Media"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="relative flex flex-col gap-1 text-white drop-shadow-lg">
            <span className="font-open-sans font-extrabold text-3xl md:text-5xl">Media</span>
            <span className="font-open-sans font-semibold text-lg md:text-2xl text-white/85">Podcasts, videos, devotionals</span>
          </div>
        </div>

        {/* Events CTA — spans both columns on desktop */}
        <div className="bg-accent flex flex-col items-center gap-6 py-10 px-8 w-full md:col-span-2 md:flex-row md:justify-between md:gap-10 md:px-14 md:py-12 rounded-3xl">
          <div className="flex items-center gap-4 md:flex-1">
            <LocationPinIcon />
            <p className="font-open-sans font-bold text-2xl text-white md:text-4xl">
              Don't do it alone.
            </p>
          </div>
          <button
            onClick={onEventsClick}
            className="shrink-0 w-full max-w-xs md:w-auto bg-white hover:bg-gray-100 py-4 px-8 rounded-full border-none cursor-pointer transition-colors"
          >
            <span className="font-open-sans font-bold text-lg md:text-xl text-slate-900">
              Find an Event or Host One
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
