import type { Page } from '../App';

interface FooterProps {
  onNavClick: (page: Page) => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isLoggedIn: boolean;
}

// Add the ministry's social links here. Any icon left empty is hidden.
const SOCIAL_LINKS = {
  youtube: '',
  instagram: '',
  facebook: '',
  x: '',
};

const RESOURCE_LINKS: { label: string; page: Page }[] = [
  { label: 'Media', page: 'media' },
  { label: 'Events', page: 'events' },
  { label: 'Prayer', page: 'prayer' },
  { label: 'Books', page: 'books' },
  { label: 'Encouragement Corner', page: 'encouragement' },
];

function YouTubeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8V6.5c0-.7.2-1 1.2-1H17V2.2C16.6 2.1 15.6 2 14.6 2 12.2 2 10.5 3.5 10.5 6.2V8H8v3.5h2.5V22H14V11.5h2.7L17 8h-3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.2 2.5h3.3l-7.2 8.3 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.5H8l4.7 6.2 5.5-6.2zm-1.2 17.5h1.8L7 4.4H5.1L17 20z" />
    </svg>
  );
}

const SOCIAL_ICONS: { key: keyof typeof SOCIAL_LINKS; label: string; Icon: () => React.ReactElement }[] = [
  { key: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'x', label: 'X', Icon: XIcon },
];

export default function Footer({ onNavClick, onLoginClick, onLogoutClick, isLoggedIn }: FooterProps) {
  function go(page: Page) {
    onNavClick(page);
    window.scrollTo({ top: 0 });
  }

  const linkClass =
    'bg-transparent border-none p-0 text-left text-white text-base cursor-pointer hover:text-white/70 transition-colors';

  const socials = SOCIAL_ICONS.filter((s) => SOCIAL_LINKS[s.key]);

  return (
    <footer className="bg-slate-950 text-white px-6 md:px-10 lg:px-16 pt-14 md:pt-16 pb-32 md:pb-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
        {/* Mission and calls to action */}
        <div className="flex flex-col gap-5 md:max-w-2xl">
          <h2 className="font-inter text-3xl md:text-4xl leading-tight m-0">
            Help us carry the light into the <strong className="font-bold text-link">deepest places</strong>.
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed m-0">
            Deep Calls to Deep Ministries exists to answer God&rsquo;s call from the deep, living surrendered lives
            transformed through Jesus and the Holy Spirit.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-1">
            <button
              onClick={() => go('give')}
              className="px-6 py-3 rounded-lg bg-white text-slate-900 font-bold text-base border-none cursor-pointer hover:bg-gray-200 transition-colors"
            >
              Support DCTDM
            </button>
            <button
              onClick={() => go('about')}
              className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold text-base border border-white/40 cursor-pointer hover:bg-white/20 transition-colors"
            >
              About our Mission
            </button>
          </div>
        </div>

        {/* Link columns */}
        <div className="flex gap-14 md:gap-16 shrink-0">
          <nav className="flex flex-col gap-3" aria-label="Resources">
            <span className="block w-12 h-px bg-accent mb-1" aria-hidden />
            <h3 className="text-link font-bold text-xl m-0 mb-1">Resources</h3>
            {RESOURCE_LINKS.map((l) => (
              <button key={l.page} onClick={() => go(l.page)} className={linkClass}>
                {l.label}
              </button>
            ))}
          </nav>

          <nav className="flex flex-col gap-3" aria-label="Info">
            <span className="block w-12 h-px bg-accent mb-1" aria-hidden />
            <h3 className="text-link font-bold text-xl m-0 mb-1">Info</h3>
            <button onClick={() => go('about')} className={linkClass}>About</button>
            <button onClick={() => go('give')} className={linkClass}>Give</button>
            <button
              onClick={() => {
                if (isLoggedIn) onLogoutClick();
                else onLoginClick();
                window.scrollTo({ top: 0 });
              }}
              className={linkClass}
            >
              {isLoggedIn ? 'Admin Logout' : 'Admin Login'}
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-14 md:mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-5 text-white min-h-6">
          {socials.map(({ key, label, Icon }) => (
            <a
              key={key}
              href={SOCIAL_LINKS[key]}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-white hover:text-white/70 transition-colors"
            >
              <Icon />
            </a>
          ))}
        </div>

        <p className="text-gray-400 text-sm m-0 md:text-center">
          &copy; {new Date().getFullYear()} Deep Calls to Deep Ministries. All rights reserved.
        </p>

        <span
          onClick={() => go('home')}
          className="font-condensed font-black italic text-3xl leading-[0.8] text-white/40 cursor-pointer hover:text-white/70 transition-colors md:text-right"
        >
          DEANA<br />BRINGOLF
        </span>
      </div>
    </footer>
  );
}
