import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import type { Page } from '../App';

interface TopBarProps {
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isLoggedIn: boolean;
  onNavClick: (page: Page) => void;
}

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: 'Media', page: 'media' },
  { label: 'Books', page: 'books' },
  { label: 'Events', page: 'events' },
  { label: 'Prayer Requests', page: 'prayer' },
  { label: 'Encouragement', page: 'encouragement' },
];

const MENU_ITEMS: { label: string; page: Page }[] = [
  { label: 'About', page: 'about' },
  { label: 'Donate', page: 'give' },
  { label: 'Connect', page: 'connect' },
];

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function TopBar({ onLoginClick, onLogoutClick, isLoggedIn, onNavClick }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="absolute top-0 left-0 right-0 z-[400] flex items-center justify-between gap-4 w-full px-4 py-4 md:px-8 lg:px-12 md:py-6 bg-transparent">
      {/* Left: Logo */}
      <div className="flex items-center shrink-0">
        <Logo
          onClick={() => onNavClick('home')}
          className="w-20 md:w-24 text-white cursor-pointer hover:text-white/80 transition-colors"
        />
      </div>

      {/* Center: Primary navigation */}
      <nav className="hidden md:flex items-center justify-center flex-1 gap-5 lg:gap-9">
        {NAV_ITEMS.map((item) => (
          <span
            key={item.page}
            onClick={() => onNavClick(item.page)}
            className="font-medium text-sm lg:text-lg text-white whitespace-nowrap cursor-pointer hover:text-white/70 transition-colors"
          >
            {item.label}
          </span>
        ))}
      </nav>

      {/* Right: More menu + Admin Login */}
      <div className="flex items-center gap-4 lg:gap-6 shrink-0">
        {/* Hamburger dropdown (desktop; mobile uses the bottom bar's More menu) */}
        <div ref={menuRef} className="relative hidden md:block">
          <button
            type="button"
            aria-label="More"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center text-white bg-transparent border-none cursor-pointer p-1 hover:text-white/70 transition-colors"
          >
            <HamburgerIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 min-w-44 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => { setMenuOpen(false); onNavClick(item.page); }}
                  className="block w-full text-left px-5 py-3 bg-transparent border-none text-white text-base cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span
          className="font-medium text-sm lg:text-base leading-none text-white whitespace-nowrap cursor-pointer hover:text-white/70 transition-colors"
          onClick={isLoggedIn ? onLogoutClick : onLoginClick}
        >
          {isLoggedIn ? 'Admin Logout' : 'Admin Login'}
        </span>
      </div>
    </header>
  );
}