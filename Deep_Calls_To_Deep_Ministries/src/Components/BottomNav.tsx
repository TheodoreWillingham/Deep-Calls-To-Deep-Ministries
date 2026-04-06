const navStyle: React.CSSProperties = {
  backgroundColor: '#314137',
  display: 'flex',
  height: 61,
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderRadius: 16,
  width: '100%',
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 7,
  cursor: 'pointer',
};

const navLabelStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
  fontSize: 12,
  lineHeight: 0.8,
  color: 'white',
  textAlign: 'center',
};

const iconStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function PlayIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="11" stroke="white" strokeWidth="1.5" />
      <polygon points="11,9 20,14 11,19" fill="white" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 6C5 4.9 5.9 4 7 4h14c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6z" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M9 4v20" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 3C10.13 3 7 6.13 7 10c0 5.25 7 15 7 15s7-9.75 7-15c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="10" r="2.5" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function PrayerIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L10 14l4 10M14 4l4 10-4 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg style={iconStyle} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="8" x2="23" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="14" x2="23" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="20" x2="23" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  return (
    <nav style={navStyle}>
      <div style={navItemStyle}>
        <PlayIcon />
        <span style={navLabelStyle}>Media</span>
      </div>
      <div style={navItemStyle}>
        <BookIcon />
        <span style={navLabelStyle}>Books</span>
      </div>
      <div style={navItemStyle}>
        <LocationIcon />
        <span style={navLabelStyle}>Events</span>
      </div>
      <div style={navItemStyle}>
        <PrayerIcon />
        <span style={navLabelStyle}>Prayer</span>
      </div>
      <div style={navItemStyle}>
        <MenuIcon />
        <span style={navLabelStyle}>More</span>
      </div>
    </nav>
  );
}
