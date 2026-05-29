interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
  onEncouragementClick?: () => void;
  onPrayersClick?: () => void;
  onEventsClick?: () => void;
  onAboutClick?: () => void;
  onGiveClick?: () => void;
}

function EncouragementIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const menuItems = [
  { label: 'Events', icon: <PinIcon /> },
  { label: 'Encouragement', icon: <EncouragementIcon /> },
  { label: 'Prayers', icon: <PrayerBookIcon /> },
  { label: 'Articles', icon: <ArticleIcon /> },
  { label: 'Podcasts', icon: <MicIcon /> },
];

function PinIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
    </svg>
  );
}

function PrayerBookIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M4 4h4a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H4V4z" />
      <path d="M20 4h-4a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h5V4z" />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export default function MoreMenu({ open, onClose, onEncouragementClick, onPrayersClick, onEventsClick, onAboutClick, onGiveClick }: MoreMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[150] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sliding panel */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-slate-900 rounded-t-2xl z-[160] transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="px-6 pt-8 pb-6">
          {/* Menu items */}
          <div className="flex flex-col">
            {menuItems.map((item, i) => (
              <div key={item.label}>
                <div
                  className="flex items-center gap-4 py-4 cursor-pointer"
                  onClick={
                    item.label === 'Encouragement' ? () => { onClose(); onEncouragementClick?.(); } :
                    item.label === 'Prayers' ? () => { onClose(); onPrayersClick?.(); } :
                    item.label === 'Events' ? () => { onClose(); onEventsClick?.(); } :
                    undefined
                  }
                >
                  {item.icon}
                  <span className="text-white font-medium text-lg">{item.label}</span>
                </div>
                {i < menuItems.length - 1 && (
                  <div className="border-t border-gray-700" />
                )}
              </div>
            ))}
          </div>

          {/* Secondary links */}
          <div className="mt-6 flex flex-col gap-4">
            <span
              className="text-gray-300 text-base cursor-pointer"
              onClick={() => { onClose(); onAboutClick?.(); }}
            >
              About Us
            </span>
            <span className="text-gray-300 text-base cursor-pointer">Help</span>
          </div>

          {/* Give button */}
          <button
            onClick={() => { onClose(); onGiveClick?.(); }}
            className="mt-8 w-full bg-gray-100 rounded-xl py-4 flex items-center justify-center gap-3 cursor-pointer border-none"
          >
            <HeartIcon />
            <span className="font-bold text-lg text-black">Give to DCTDM</span>
          </button>
        </div>
      </div>
    </>
  );
}
