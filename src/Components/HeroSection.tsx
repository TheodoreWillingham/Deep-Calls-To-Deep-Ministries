interface HeroSectionProps {
  onGiveClick: () => void;
  onMediaClick: () => void;
}

export default function HeroSection({ onGiveClick, onMediaClick }: HeroSectionProps) {
  return (
    <section className="relative bg-slate-900 flex flex-col items-center justify-center min-h-svh px-6 py-28 overflow-hidden md:min-h-screen md:py-0">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/oceandepths.jpg')" }}
        aria-hidden
      />
      {/* Darkening overlay for legibility + bottom fade into the next section */}
      <div className="absolute inset-0 bg-slate-950/65" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-slate-900" aria-hidden />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 md:gap-8 max-w-4xl">
        <h1 className="font-bold text-[40px] leading-[1.02] text-white md:text-7xl lg:text-8xl md:leading-[0.95] md:tracking-tight">
          DEEP CALLS TO DEEP MINISTRIES
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-2 w-full sm:w-auto">
          <button
            onClick={onGiveClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold text-base md:text-lg border-none cursor-pointer transition-colors"
          >
            Give
          </button>
          <button
            onClick={onMediaClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base md:text-lg border border-white/40 backdrop-blur-sm cursor-pointer transition-colors"
          >
            Watch &amp; Listen
          </button>
        </div>
      </div>
    </section>
  );
}
