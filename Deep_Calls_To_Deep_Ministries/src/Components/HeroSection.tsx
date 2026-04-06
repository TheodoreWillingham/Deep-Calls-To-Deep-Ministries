import TopBar from './TopBar';

interface HeroSectionProps {
  onSearchClick: () => void;
  onLoginClick: () => void;
}

export default function HeroSection({ onSearchClick, onLoginClick }: HeroSectionProps) {
  return (
    <section className="bg-[#272626] flex flex-col items-center justify-between min-h-svh p-2.5 pb-[90px] overflow-hidden">
      <TopBar onSearchClick={onSearchClick} onLoginClick={onLoginClick} />
      <h1 className="font-black text-[40px] leading-none text-center text-white max-w-[381px]">
        DEEP CALLS TO DEEP MINISTRIES
      </h1>
      <div />
    </section>
  );
}
