import TopBar from './TopBar';

interface HeroSectionProps {
  onSearchClick: () => void;
  onLoginClick: () => void;
}

function PlayCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="1.5" />
      <polygon points="9,7 16,11 9,15" fill="white" />
    </svg>
  );
}

export default function HeroSection({ onSearchClick, onLoginClick }: HeroSectionProps) {
  return (
    <section
      className="
        relative bg-[#272626] flex flex-col items-center justify-between
        min-h-svh p-2.5 pb-24 overflow-hidden
        md:min-h-screen md:p-0 md:pb-0 md:justify-start
      "
    >
      {/* Desktop background image + dark overlay */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/oceandepths.jpg')" }}
        aria-hidden
      />
      <div className="hidden md:block absolute inset-0 bg-black/55" aria-hidden />

      <div className="relative w-full z-10">
        <TopBar onSearchClick={onSearchClick} onLoginClick={onLoginClick} />
      </div>

      {/* Headline + CTA */}
      <div className="relative z-10 flex flex-col items-center md:flex-1 md:justify-center md:gap-10 md:px-6 md:pb-24">
        <h1
          className="
            font-bold text-[40px] leading-none text-center text-white max-w-sm
            md:text-[88px] md:leading-[0.95] md:max-w-4xl md:tracking-tight
            lg:text-8xl
          "
        >
          DEEP CALLS TO DEEP MINISTRIES
        </h1>
      </div>

      <div className="md:hidden" />
    </section>
  );
}
