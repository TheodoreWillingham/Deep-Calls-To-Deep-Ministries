export const pageStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: '#1a1d2e',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '80px 24px 40px',
  gap: 32,
  overflowY: 'auto',
  zIndex: 300,
};

export const pageInnerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 32,
  width: '100%',
  maxWidth: 576,
};

export const logoStyle: React.CSSProperties = {
  fontFamily: "'Roboto Condensed', sans-serif",
  fontWeight: 900,
  fontStyle: 'italic',
  fontSize: 36,
  lineHeight: 0.85,
  color: 'white',
  textAlign: 'center',
  width: 155,
  cursor: 'pointer',
};

export const headingStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 700,
  fontSize: 28,
  color: 'white',
  alignSelf: 'flex-start',
  width: '100%',
  marginTop: 16,
};

export const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
};

export const labelStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  color: '#ccc',
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  borderRadius: 8,
  border: '1px solid #444',
  backgroundColor: '#2a2d3e',
  color: 'white',
  fontSize: 16,
  fontFamily: "'Roboto', sans-serif",
  outline: 'none',
};

export const captchaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
  borderRadius: 8,
  border: '1px solid #555',
  backgroundColor: '#2a2d3e',
};

export const checkboxStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: '2px solid #666',
  backgroundColor: '#1a1d2e',
  flexShrink: 0,
};

export const captchaTextStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontSize: 14,
  color: 'white',
};

export const submitBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '20px',
  borderRadius: 12,
  border: 'none',
  backgroundColor: '#e0e0e0',
  fontSize: 18,
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 600,
  color: '#333',
  cursor: 'pointer',
};

export const bottomTextStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontSize: 14,
  color: '#aaa',
  textAlign: 'center',
  marginTop: 8,
};

export const linkStyle: React.CSSProperties = {
  color: '#e88a4a',
  cursor: 'pointer',
  textDecoration: 'none',
  fontWeight: 600,
};
