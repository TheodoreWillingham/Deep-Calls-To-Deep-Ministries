interface ComingSoonPageProps {
  title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-center px-6 pt-32 md:pt-36 pb-10 gap-8">
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl flex-1">
        <h1 className="font-bold text-4xl md:text-6xl text-white text-center">{title}</h1>
        <p className="text-lg md:text-xl text-white/70 text-center">Coming soon.</p>
      </div>
    </div>
  );
}
