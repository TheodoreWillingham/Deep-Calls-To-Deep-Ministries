import { useState } from 'react';

interface SearchOverlayProps {
  onClose: () => void;
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  zIndex: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#2c3e50',
  width: '100%',
  maxWidth: 393,
  padding: '20px 16px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  fontSize: 16,
  color: 'white',
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: 20,
  cursor: 'pointer',
  padding: 4,
  lineHeight: 1,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 14,
  fontFamily: "'Roboto', sans-serif",
  outline: 'none',
  backgroundColor: 'white',
  color: '#333',
};

const searchBtnRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const searchBtnStyle: React.CSSProperties = {
  backgroundColor: '#3c3c3c',
  color: 'white',
  border: '1px solid #888',
  borderRadius: 6,
  padding: '10px 24px',
  fontSize: 14,
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  cursor: 'pointer',
};

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={titleStyle}>Search</span>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Close search">
            &times;
          </button>
        </div>
        <input
          style={inputStyle}
          type="text"
          placeholder="Search Wild at Heart..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div style={searchBtnRowStyle}>
          <button style={searchBtnStyle}>Search</button>
        </div>
      </div>
    </div>
  );
}
