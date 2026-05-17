interface TopBarProps {
  onSearchClick: () => void;
  onLoginClick: () => void;
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.5" />
      <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <line x1="6" y1="1.5" x2="6" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="6" x2="10.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV_ITEMS = ['Media', 'Events', 'Daily Practices', 'Books', 'Give'];

export default function TopBar({ onSearchClick, onLoginClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between w-full overflow-hidden px-2.5 py-4 md:px-10 md:py-6">
      <span className="font-condensed font-black italic text-3xl leading-[0.8] text-white w-40 md:text-4xl md:shrink-0">
        DEANA<br />BRINGOLF
      </span>

      <nav className="hidden md:flex items-center gap-8 lg:gap-10">
        {NAV_ITEMS.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1.5 font-medium text-base lg:text-lg text-white whitespace-nowrap cursor-pointer hover:text-white/70 transition-colors"
          >
            {item}
            <PlusIcon />
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 md:gap-5">
        <div
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white bg-white/30 cursor-pointer hover:bg-white/40 transition-colors"
          onClick={onSearchClick}
        >
          <SearchIcon />
          <span className="font-medium text-base leading-[0.8] text-white whitespace-nowrap">
            Search
          </span>
        </div>
        <span
          className="font-medium text-base leading-[0.8] text-white whitespace-nowrap cursor-pointer hover:text-white/70 transition-colors"
          onClick={onLoginClick}
        >
          Login
        </span>
      </div>
    </header>
  );
}
