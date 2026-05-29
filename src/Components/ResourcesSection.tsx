interface ResourcesSectionProps {
  onPrayersClick: () => void;
}

function LocationPinIcon() {
  return (
    <svg width="105" height="105" viewBox="0 0 105 105" fill="none">
      <path
        d="M52.5 8.75C37.3 8.75 25 21.05 25 36.25c0 22.5 27.5 60 27.5 60s27.5-37.5 27.5-60c0-15.2-12.3-27.5-27.5-27.5zm0 37.5c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"
        fill="white"
      />
    </svg>
  );
}

export default function ResourcesSection({ onPrayersClick }: ResourcesSectionProps) {
  return (
    <section className="bg-slate-900 flex flex-col items-center justify-center gap-20 pb-16 px-4 md:px-10 lg:px-20 md:pb-24">
      {/* Black band with gradient fades on top and bottom for a smooth transition from the hero */}
      <div
        className="relative -mx-4 md:-mx-10 lg:-mx-20 -mt-24 md:-mt-32 self-stretch pt-44 pb-20 md:pt-60 md:pb-28 flex items-center justify-center z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 40%, #000 78%, rgba(0,0,0,0) 100%)',
        }}
      >
        <p className="font-inter text-[32px] leading-[1.2] font-thin text-center text-white max-w-sm md:text-4xl md:max-w-3xl px-4">
          Resources to help grow your relationship with God.
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 w-full md:grid md:grid-cols-2 md:gap-8 md:max-w-7xl">
        {/* Prayers Card */}
        <div
          onClick={onPrayersClick}
          className="relative w-full aspect-[676/379] rounded-[32px] overflow-hidden flex flex-col justify-end p-6 md:p-10 md:aspect-[16/10] cursor-pointer group"
        >
          <img
            src="/assets/prayers-bg.jpg"
            alt="Prayers"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative flex flex-col gap-2 text-white drop-shadow-lg">
            <span className="font-open-sans font-extrabold text-[32px] md:text-5xl">Prayers</span>
            <span className="font-open-sans font-semibold text-2xl md:text-3xl">Requests and Answers</span>
          </div>
        </div>

        {/* Media Card */}
        <div className="relative w-full aspect-[358/200] rounded-[32px] overflow-hidden flex flex-col justify-end p-6 md:p-10 md:aspect-[16/10] cursor-pointer group">
          <img
            src="/assets/media-bg.jpg"
            alt="Media"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative flex flex-col gap-2 text-white drop-shadow-lg">
            <span className="font-open-sans font-extrabold text-[32px] md:text-5xl">Media</span>
            <span className="font-open-sans font-semibold text-2xl md:text-3xl">Podcasts, videos, devotionals</span>
          </div>
        </div>

        {/* Events CTA — spans both columns on desktop */}
        <div className="bg-accent flex flex-col items-center justify-center gap-10 py-8 px-8 w-full max-w-90 md:max-w-none md:col-span-2 md:flex-row md:justify-between md:px-16 md:py-12 rounded-2xl">
          <LocationPinIcon />
          <p className="font-semibold text-[32px] text-center text-white md:text-5xl md:text-left md:flex-1 md:px-10">
            Don't do it alone.
          </p>
          <button className="bg-white flex items-center justify-center py-6 px-8 rounded-lg w-84 max-w-full md:w-auto shadow-[0px_4px_4px_rgba(0,0,0,0.25),2px_6px_4px_rgba(0,0,0,0.25)] border-none cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="font-open-sans font-bold text-xl text-black text-center md:text-2xl">
              Find an Event or Host One
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
