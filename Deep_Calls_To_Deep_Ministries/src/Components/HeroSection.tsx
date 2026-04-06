import TopBar from './TopBar';

interface HeroSectionProps {
  onSearchClick: () => void;
  onLoginClick: () => void;
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: '#272626',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '100svh',
  padding: '10px 10px 90px',
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 900,
  fontSize: 40,
  lineHeight: 1,
  textAlign: 'center',
  color: 'white',
  maxWidth: 381,
};

export default function HeroSection({ onSearchClick, onLoginClick }: HeroSectionProps) {
  return (
    <section style={sectionStyle}>
      <TopBar onSearchClick={onSearchClick} onLoginClick={onLoginClick} />
      <h1 style={titleStyle}>DEEP CALLS TO DEEP MINISTRIES</h1>
      <div />
    </section>
  );
}
