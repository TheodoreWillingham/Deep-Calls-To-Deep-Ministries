interface MediaPageProps {
  onBack?: () => void;
}

interface MediaItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

interface MediaSection {
  title: string;
  items: MediaItem[];
}

const placeholderImg = '/assets/video-thumb.jpg';

const sections: MediaSection[] = [
  {
    title: 'Recently Added',
    items: [
      {
        id: 1,
        imageUrl: placeholderImg,
        title: 'Video Update: Asking, Listening, And…',
        description: 'Friends, I want to circle back to something I shared a couple weeks ago about asking God…',
      },
      {
        id: 2,
        imageUrl: placeholderImg,
        title: 'E121 | Fueling Intimacy: When You Dra…',
        description: "Intimacy with Jesus isn't reserved for the spiritually polished—it's an open invitation.",
      },
      {
        id: 3,
        imageUrl: placeholderImg,
        title: 'E875 | Ruling Your Domain – Part 2',
        description: 'As this series progresses, John, Blaine, and Allen discuss ways to govern one\'s internal reality.',
      },
      {
        id: 4,
        imageUrl: placeholderImg,
        title: 'E874 | Ruling Your Domain – Part 1',
        description: 'Starting the conversation on what it means to take dominion over your inner world.',
      },
      {
        id: 5,
        imageUrl: placeholderImg,
        title: 'E873 | The Slow Work of God',
        description: 'A reflection on patience, prayer, and the unhurried pace of transformation.',
      },
    ],
  },
  {
    title: 'Video Series for Groups',
    items: [
      {
        id: 11,
        imageUrl: placeholderImg,
        title: 'Experience Jesus',
        description: 'A 6-session video journey for small groups exploring intimacy with Jesus.',
      },
      {
        id: 12,
        imageUrl: placeholderImg,
        title: 'The Resilient',
        description: 'A series for groups on building a faith that can weather any storm.',
      },
      {
        id: 13,
        imageUrl: placeholderImg,
        title: 'Wild at Heart',
        description: 'A guided study for men recovering the heart God gave them.',
      },
      {
        id: 14,
        imageUrl: placeholderImg,
        title: 'Captivating',
        description: 'A study for women on unveiling the mystery of the feminine soul.',
      },
    ],
  },
  {
    title: 'Podcast Episodes',
    items: [
      {
        id: 21,
        imageUrl: placeholderImg,
        title: 'E872 | When Prayer Feels Dry',
        description: 'Walking through the seasons when God seems quiet — and what He\'s up to in them.',
      },
      {
        id: 22,
        imageUrl: placeholderImg,
        title: 'E871 | The Shape of a Surrendered Day',
        description: 'A rhythm of daily prayer practices that make space for God to lead.',
      },
      {
        id: 23,
        imageUrl: placeholderImg,
        title: 'E870 | Hearing God in the Noise',
        description: 'Discerning the voice of God in the middle of a loud, distracted life.',
      },
      {
        id: 24,
        imageUrl: placeholderImg,
        title: 'E869 | A Father\'s Blessing',
        description: 'On the wound of the missing blessing, and how God himself becomes our Father.',
      },
    ],
  },
];

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="shrink-0 w-72 md:w-80 lg:w-96 rounded-xl overflow-hidden bg-slate-800 cursor-pointer group">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="bg-slate-800 p-4 md:p-5 flex flex-col gap-2">
        <h3 className="text-white font-bold text-sm md:text-base m-0 leading-snug truncate">
          {item.title}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm m-0 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function MediaRow({ section }: { section: MediaSection }) {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-5">
      <div className="flex items-center justify-between px-6 md:px-10 lg:px-16">
        <h2 className="text-white text-sm md:text-base font-medium tracking-wide m-0">
          {section.title}
        </h2>
        <button className="text-gray-400 text-sm md:text-base bg-transparent border-none cursor-pointer hover:text-white transition-colors">
          Explore All
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-4 md:gap-6 px-6 md:px-10 lg:px-16 scroll-px-6 md:scroll-px-10 lg:scroll-px-16 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth">
          {section.items.map((item) => (
            <div key={item.id} className="snap-start">
              <MediaCard item={item} />
            </div>
          ))}
        </div>
        {/* Chevron hint (decorative, desktop only) */}
        <div className="hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 items-center justify-center text-white pointer-events-none">
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
}

export default function MediaPage(_props: MediaPageProps) {
  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-stretch pt-20 md:pt-24 pb-20 gap-12 md:gap-16">
      <h1 className="font-bold text-3xl md:text-5xl text-white tracking-wide m-0 text-center">
        Media
      </h1>

      {sections.map((section) => (
        <MediaRow key={section.title} section={section} />
      ))}
    </div>
  );
}
