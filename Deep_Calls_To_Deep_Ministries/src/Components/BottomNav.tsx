function PlayIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="white" strokeWidth="1.5" />
      <polygon points="11,9 20,14 11,19" fill="white" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
      <path d="M5 6C5 4.9 5.9 4 7 4h14c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6z" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M9 4v20" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
      <path d="M14 3C10.13 3 7 6.13 7 10c0 5.25 7 15 7 15s7-9.75 7-15c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="10" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function PrayerIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
      <path d="M14 4L10 14l4 10M14 4l4 10-4 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none">
      <line x1="5" y1="8" x2="23" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="14" x2="23" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="20" x2="23" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] p-2 z-50">
      <nav className="bg-[#314137] flex h-[61px] items-center justify-between px-4 py-2 rounded-2xl w-full">
        <div className="flex flex-col items-center gap-[7px] cursor-pointer">
          <PlayIcon />
          <span className="text-xs text-white text-center">Media</span>
        </div>
        <div className="flex flex-col items-center gap-[7px] cursor-pointer">
          <BookIcon />
          <span className="text-xs text-white text-center">Books</span>
        </div>
        <div className="flex flex-col items-center gap-[7px] cursor-pointer">
          <LocationIcon />
          <span className="text-xs text-white text-center">Events</span>
        </div>
        <div className="flex flex-col items-center gap-[7px] cursor-pointer">
          <PrayerIcon />
          <span className="text-xs text-white text-center">Prayer</span>
        </div>
        <div className="flex flex-col items-center gap-[7px] cursor-pointer">
          <MenuIcon />
          <span className="text-xs text-white text-center">More</span>
        </div>
      </nav>
    </div>
  );
}
