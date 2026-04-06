import BottomNav from './BottomNav';

const sectionStyle: React.CSSProperties = {
  backgroundColor: '#272626',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: 852,
  padding: '16px 10px',
  overflow: 'hidden',
  gap: 24,
};

const headingStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 400,
  fontSize: 24,
  lineHeight: 0.8,
  color: 'white',
  width: 283,
  alignSelf: 'flex-start',
  marginLeft: 6,
};

const carouselWrapperStyle: React.CSSProperties = {
  display: 'flex',
  gap: 13,
  alignItems: 'center',
  width: '100%',
  overflowX: 'auto',
  border: '2px solid white',
  padding: 4,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 340,
  minWidth: 340,
  borderRadius: 20,
  overflow: 'hidden',
};

const thumbStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '691 / 388',
  objectFit: 'cover',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  display: 'block',
};

const cardBodyStyle: React.CSSProperties = {
  backgroundColor: '#6e6e6e',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 16,
  width: '100%',
  color: 'white',
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 700,
  fontSize: 20,
  lineHeight: 0.8,
};

const cardDescStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1.2,
};

const buttonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 23,
  width: 333,
  maxWidth: '100%',
};

const primaryBtnStyle: React.CSSProperties = {
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
};

const primaryBtnTextStyle: React.CSSProperties = {
  fontFamily: "'Open Sans', sans-serif",
  fontWeight: 700,
  fontSize: 20,
  color: 'black',
  textAlign: 'center',
};

const secondaryBtnStyle: React.CSSProperties = {
  backgroundColor: '#5c5c5c',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  borderRadius: 8,
  border: '1px solid white',
  cursor: 'pointer',
  width: '100%',
};

const secondaryBtnTextStyle: React.CSSProperties = {
  fontFamily: "'Open Sans', sans-serif",
  fontWeight: 700,
  fontSize: 20,
  color: 'white',
  textAlign: 'center',
};

const episodes = [
  {
    id: 1,
    title: 'E867 | Lies That Sabotage Our...',
    description:
      'This can be a short description for the podcast episode. In this one, we talk about the love of God and how He...',
  },
  {
    id: 2,
    title: 'E867 | Lies That Sabotage Our...',
    description:
      'This can be a short description for the podcast episode. In this one, we talk about the love of God and how He...',
  },
  {
    id: 3,
    title: 'E867 | Lies That Sabotage Our...',
    description:
      'This can be a short description for the podcast episode. In this one, we talk about the love of God and how He...',
  },
];

export default function MediaSection() {
  return (
    <section style={sectionStyle}>
      <p style={headingStyle}>Latest Videos, Podcasts, and More</p>

      <div style={carouselWrapperStyle}>
        {episodes.map((ep) => (
          <div key={ep.id} style={cardStyle}>
            <img src="/assets/video-thumb.jpg" alt={ep.title} style={thumbStyle} />
            <div style={cardBodyStyle}>
              <p style={cardTitleStyle}>{ep.title}</p>
              <p style={cardDescStyle}>{ep.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={buttonsContainerStyle}>
        <button style={primaryBtnStyle}>
          <span style={primaryBtnTextStyle}>Support DCTDM</span>
        </button>
        <button style={secondaryBtnStyle}>
          <span style={secondaryBtnTextStyle}>Find an Event or Host One</span>
        </button>
      </div>

      <BottomNav />
    </section>
  );
}
