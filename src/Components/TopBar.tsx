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

export default function TopBar({ onSearchClick, onLoginClick }: TopBarProps) {
  return (
    <header className="flex items-center justify-between w-full overflow-hidden px-2.5 py-4">
      <span className="font-condensed font-black italic text-3xl leading-[0.8] text-white w-40">
        DEANA BRINGOLF
      </span>
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white bg-white/30 cursor-pointer"
          onClick={onSearchClick}
        >
          <SearchIcon />
          <span className="font-medium text-base leading-[0.8] text-white whitespace-nowrap">
            Search
          </span>
        </div>
        <span
          className="font-medium text-base leading-[0.8] text-white whitespace-nowrap cursor-pointer"
          onClick={onLoginClick}
        >
          Login
        </span>
      </div>
    </header>
  );
}
