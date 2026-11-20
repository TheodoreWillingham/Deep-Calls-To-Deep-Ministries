import type { Page } from '../App';

interface HeroSectionProps {
  onNavigate: (page: Page) => void;
}

const resources: { page: Page; title: string; description: string; image: string }[] = [
  { page: 'media', title: 'Media', description: 'Podcasts, videos, and teachings.', image: '/assets/Media.jpeg' },
  { page: 'books', title: 'Books', description: 'Resources to deepen your understanding of scripture.', image: '/assets/Books.jpeg' },
  { page: 'events', title: 'Events', description: 'Gatherings, worship, and opportunities to connect.', image: '/assets/Events.jpeg' },
  { page: 'prayer', title: 'Prayer Requests', description: 'Share your burdens and let us pray with you.', image: '/assets/Prayer%20Requests.jpeg' },
  { page: 'encouragement', title: 'Encouragement Corner', description: "Daily encouragement and reminders of God's promises.", image: '/assets/Encouragement%20Corner.jpeg' },
  { page: 'connect', title: 'Connect', description: 'Become part of our community.', image: '/assets/Connect.jpeg' },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <>
      {/* Hero + mission */}
      <section className="relative bg-slate-900 flex flex-col items-center justify-center min-h-[75svh] px-6 pt-28 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/oceandepths.jpg')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-slate-950/65" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-slate-900" aria-hidden />

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-3xl">
          <h1 className="font-bold text-[40px] leading-[1.02] text-white md:text-7xl md:leading-[0.95] md:tracking-tight m-0">
            DEEP CALLS TO DEEP MINISTRIES
          </h1>
          <p className="text-white/90 text-base md:text-xl leading-relaxed m-0">
            <span className="font-semibold text-white">Our Mission: </span>
            To answer God’s call from the deep by living surrendered lives transformed through Jesus and the Holy Spirit, and bringing the light of His kingdom into the deepest places of the world.{' '}
            <button
              onClick={() => onNavigate('about')}
              className="bg-transparent border-none p-0 text-link underline cursor-pointer text-base md:text-xl font-semibold"
            >
              Learn more
            </button>
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-slate-900 flex flex-col items-center gap-8 md:gap-10 px-4 pb-28 md:px-10 lg:px-20">
        <h2 className="font-inter text-3xl md:text-4xl text-white text-center m-0">
          Explore Our Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl">
          {resources.map(({ page, title, description, image }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="relative text-left rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 cursor-pointer group p-0 bg-slate-800"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" aria-hidden />
              <div className="relative h-full flex flex-col justify-end gap-1 p-5 md:p-6">
                <h3 className="text-white font-bold text-xl m-0">{title}</h3>
                <p className="text-gray-200 text-sm md:text-base leading-snug m-0">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
