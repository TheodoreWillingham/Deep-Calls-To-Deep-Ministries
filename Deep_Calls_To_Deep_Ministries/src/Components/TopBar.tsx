const topBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 10px',
  width: '100%',
  overflow: 'hidden',
};

const logoStyle: React.CSSProperties = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 900,
  fontStyle: 'italic',
  fontSize: 36,
  lineHeight: 0.8,
  color: 'white',
  width: 155,
};

const rightGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const searchStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '8px 18px',
  borderRadius: 21,
  border: '1px solid white',
  backgroundColor: 'rgba(170, 170, 170, 0.5)',
  cursor: 'pointer',
};

const searchTextStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  fontSize: 16,
  lineHeight: 0.8,
  color: 'white',
  whiteSpace: 'nowrap',
};

const loginStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  fontSize: 16,
  lineHeight: 0.8,
  color: 'white',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.5" />
      <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function TopBar() {
  return (
    <header style={topBarStyle}>
      <span style={logoStyle}>DEANA BRINGOLF</span>
      <div style={rightGroupStyle}>
        <div style={searchStyle}>
          <SearchIcon />
          <span style={searchTextStyle}>Search</span>
        </div>
        <span style={loginStyle}>Login</span>
      </div>
    </header>
  );
}
