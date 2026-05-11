function LocationPinIcon() {
  return (
    <svg width="105" height="105" viewBox="0 0 105 105" fill="none">
      <path
        d="M52.5 8.75C37.3 8.75 25 21.05 25 36.25c0 22.5 27.5 60 27.5 60s27.5-37.5 27.5-60c0-15.2-12.3-27.5-27.5-27.5zm0 37.5c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"
        fill="black"
      />
    </svg>
  );
}

export default function ResourcesSection() {
  return (
    <section className="bg-[#3c3c3c] flex flex-col items-center justify-center gap-20 py-16 px-4">
      <p className="font-inter text-[32px] leading-[1.2] text-center text-white max-w-sm">
        Resources to help grow your relationship with God.
      </p>

      <div className="flex flex-col items-center gap-10 w-full">
        {/* Prayers Card */}
        <div className="relative w-full aspect-[676/379] rounded-[32px] overflow-hidden flex flex-col justify-end p-6">
          <img
            src="/assets/prayers-bg.jpg"
            alt="Prayers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative flex flex-col gap-2 text-white drop-shadow-lg">
            <span className="font-open-sans font-extrabold text-[32px]">Prayers</span>
            <span className="font-open-sans font-semibold text-2xl">Requests and Answers</span>
          </div>
        </div>

        {/* Media Card */}
        <div className="relative w-full aspect-[358/200] rounded-[32px] overflow-hidden flex flex-col justify-end p-6">
          <img
            src="/assets/media-bg.jpg"
            alt="Media"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative flex flex-col gap-2 text-white drop-shadow-lg">
            <span className="font-open-sans font-extrabold text-[32px]">Media</span>
            <span className="font-open-sans font-semibold text-2xl">Podcasts, videos, devotionals</span>
          </div>
        </div>

        {/* Events CTA */}
        <div className="bg-[#ffad6a] flex flex-col items-center justify-center gap-10 py-8 px-8 w-full max-w-90">
          <LocationPinIcon />
          <p className="font-semibold text-[32px] text-center text-black">
            Don't do it alone.
          </p>
          <button className="bg-white flex items-center justify-center py-6 rounded-lg w-84 max-w-full shadow-[0px_4px_4px_rgba(0,0,0,0.25),2px_6px_4px_rgba(0,0,0,0.25)] border-none cursor-pointer">
            <span className="font-open-sans font-bold text-xl text-black text-center">
              Find an Event or Host One
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
