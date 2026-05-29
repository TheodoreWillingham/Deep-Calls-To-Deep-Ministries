export default function HeroSection() {
  return (
    <section
      className="
        relative bg-slate-900 flex flex-col items-center justify-center
        min-h-svh p-2.5 pb-24 overflow-hidden
        md:min-h-screen md:p-0 md:pb-0
      "
    >
      {/* Desktop background image + dark overlay */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/oceandepths.jpg')" }}
        aria-hidden
      />
      <div className="hidden md:block absolute inset-0 bg-black/55" aria-hidden />

      {/* Headline */}
      <div className="relative z-10 flex flex-col items-center md:gap-10 md:px-6">
        <h1
          className="
            font-bold text-[40px] leading-none text-center text-white max-w-sm
            md:text-[88px] md:leading-[0.95] md:max-w-4xl md:tracking-tight
            lg:text-8xl
          "
        >
          DEEP CALLS TO DEEP MINISTRIES
        </h1>
      </div>
    </section>
  );
}
