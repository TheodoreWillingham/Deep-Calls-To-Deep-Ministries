interface ComingSoonPageProps {
  title: string;
  onBack: () => void;
}

export default function ComingSoonPage({ title, onBack }: ComingSoonPageProps) {
  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-center px-6 pt-32 md:pt-36 pb-10 gap-8">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="absolute top-24 md:top-28 left-5 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12.5 4L6.5 10L12.5 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl flex-1">
        <h1 className="font-bold text-4xl md:text-6xl text-white text-center">{title}</h1>
        <p className="text-lg md:text-xl text-white/70 text-center">Coming soon.</p>
      </div>
    </div>
  );
}
