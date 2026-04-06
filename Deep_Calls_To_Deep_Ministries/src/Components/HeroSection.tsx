import TopBar from './TopBar';
import BottomNav from './BottomNav';

const sectionStyle: React.CSSProperties = {
  backgroundColor: '#272626',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 852,
  padding: 10,
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 900,
  fontSize: 40,
  lineHeight: 1,
  textAlign: 'center',
  color: 'white',
  width: 381,
  maxWidth: '100%',
};

export default function HeroSection() {
  return (
    <section style={sectionStyle}>
      <TopBar />
      <h1 style={titleStyle}>DEEP CALLS TO DEEP MINISTRIES</h1>
      <BottomNav />
    </section>
  );
}
