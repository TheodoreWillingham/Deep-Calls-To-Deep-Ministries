const sectionStyle: React.CSSProperties = {
  backgroundColor: '#3c3c3c',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 78,
  padding: '67px 16px',
};

const headingStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: 32,
  lineHeight: 0.8,
  textAlign: 'center',
  color: 'white',
  maxWidth: 351,
};

const cardsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 38,
  width: '100%',
};

const imageCardStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '676 / 379',
  borderRadius: 32,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '24px 16px',
};

const cardImageStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const cardOverlayStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  lineHeight: 0.8,
  color: 'white',
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "'Open Sans', sans-serif",
  fontWeight: 800,
  fontSize: 32,
};

const cardSubtitleStyle: React.CSSProperties = {
  fontFamily: "'Open Sans', sans-serif",
  fontWeight: 600,
  fontSize: 24,
};

const ctaBlockStyle: React.CSSProperties = {
  backgroundColor: '#ffad6a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 39,
  padding: 32,
  width: '100%',
  maxWidth: 361,
};

const ctaTextStyle: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 600,
  fontSize: 32,
  textAlign: 'center',
  color: 'black',
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  borderRadius: 8,
  width: 333,
  maxWidth: '100%',
  boxShadow: '0px 4px 4px rgba(0,0,0,0.25), 2px 6px 4px rgba(0,0,0,0.25)',
  border: 'none',
  cursor: 'pointer',
};

const ctaButtonTextStyle: React.CSSProperties = {
  fontFamily: "'Open Sans', sans-serif",
  fontWeight: 700,
  fontSize: 20,
  color: 'black',
  textAlign: 'center',
};

function LocationPinIcon() {
  return (
    <svg width="105" height="105" viewBox="0 0 105 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M52.5 8.75C37.3 8.75 25 21.05 25 36.25c0 22.5 27.5 60 27.5 60s27.5-37.5 27.5-60c0-15.2-12.3-27.5-27.5-27.5zm0 37.5c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"
        fill="black"
      />
    </svg>
  );
}

export default function ResourcesSection() {
  return (
    <section style={sectionStyle}>
      <p style={headingStyle}>Resources to help grow your relationship with God.</p>
      <div style={cardsContainerStyle}>
        {/* Prayers Card */}
        <div style={imageCardStyle}>
          <img src="/assets/prayers-bg.jpg" alt="Prayers" style={cardImageStyle} />
          <div style={cardOverlayStyle}>
            <span style={cardTitleStyle}>Prayers</span>
            <span style={cardSubtitleStyle}>Requests and Answers</span>
          </div>
        </div>

        {/* Media Card */}
        <div style={{ ...imageCardStyle, aspectRatio: '358 / 200' }}>
          <img src="/assets/media-bg.jpg" alt="Media" style={cardImageStyle} />
          <div style={cardOverlayStyle}>
            <span style={cardTitleStyle}>Media</span>
            <span style={cardSubtitleStyle}>Podcasts, videos, devotionals</span>
          </div>
        </div>

        {/* Events CTA */}
        <div style={ctaBlockStyle}>
          <LocationPinIcon />
          <p style={ctaTextStyle}>Don't do it alone.</p>
          <button style={ctaButtonStyle}>
            <span style={ctaButtonTextStyle}>Find an Event or Host One</span>
          </button>
        </div>
      </div>
    </section>
  );
}
