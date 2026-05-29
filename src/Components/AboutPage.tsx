export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 md:pt-24">
      {/* Header */}
      <div className="w-full max-w-5xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 flex items-center justify-center shrink-0">
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">About</h1>
      </div>

      {/* Content */}
      <div className="w-full max-w-5xl px-6 md:px-10 lg:px-16 pb-28 flex flex-col gap-14 md:gap-20">
        {/* Hero */}
        <section className="about-rise relative w-full rounded-3xl overflow-hidden">
          <img
            src="/oceandepths.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/70 to-slate-900" />
          <div className="relative z-10 px-6 py-20 md:py-28 flex flex-col items-center text-center gap-5">
            <span className="font-open-sans font-bold uppercase tracking-[0.35em] text-[11px] md:text-xs text-link">
              Deep Calls to Deep Ministries
            </span>
            <h2 className="font-condensed italic text-5xl md:text-7xl lg:text-8xl text-white leading-[0.88]">
              CALLED<br />FROM THE DEEP
            </h2>
            <p className="font-inter text-base md:text-xl text-white/80 max-w-xl leading-relaxed">
              God is calling from His depths into the deepest parts of who we are.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="about-rise w-full max-w-3xl mx-auto flex flex-col gap-6" style={{ animationDelay: '0.1s' }}>
          <span className="font-open-sans font-bold uppercase tracking-[0.25em] text-xs text-link">
            Our Story
          </span>
          <p className="text-gray-200 text-base md:text-lg leading-relaxed first-letter:font-condensed first-letter:italic first-letter:text-6xl md:first-letter:text-7xl first-letter:text-link first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.75]">
            Deep Calls to Deep Ministries exists to remind people that God is calling from His depths into the deepest parts of who we are. He invites us into a life that is full, abundant, and alive through Jesus, empowered by the Holy Spirit.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            This is not a shallow journey. It is a life that carries the kingdom of God into the darkest places of the world, reaching hearts that are longing in the deep. Just as the depths of the ocean remain largely unexplored, so too are the depths of God vast, powerful, and beyond full human understanding.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Yet God desires for us to know Him deeply. He calls us to discover and live in the richness of life with Him to be transformed from within.
          </p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Join us on this journey; a journey that changes us at our core through Jesus and by the Holy Spirit so that God can use us to reach into the depths of others and point them into His marvelous light.
          </p>
        </section>

        {/* Mission */}
        <section className="about-rise w-full max-w-4xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl bg-accent/15 border-l-4 border-accent px-6 py-8 md:px-12 md:py-12">
            <span className="font-open-sans font-bold uppercase tracking-[0.25em] text-xs text-link">
              Our Mission
            </span>
            <p className="mt-4 font-inter text-white text-xl md:text-3xl leading-snug md:leading-relaxed">
              To answer God’s call from the deep by living surrendered lives transformed through Jesus and the Holy Spirit, and bringing the light of His kingdom into the deepest places of the world.
            </p>
          </div>
        </section>

        {/* Deana Bringolf */}
        <section className="about-rise w-full max-w-4xl mx-auto" style={{ animationDelay: '0.3s' }}>
          <div className="grid gap-8 md:gap-12 md:grid-cols-[300px_1fr] md:items-start">
            {/* Monogram panel */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-[3/4] bg-gradient-to-br from-accent via-[#24405f] to-slate-950 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="absolute inset-4 rounded-xl border border-white/15" />
              <span className="relative font-condensed italic text-7xl md:text-8xl text-white">DB</span>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-4">
              <span className="font-open-sans font-bold uppercase tracking-[0.25em] text-xs text-link">
                Founder
              </span>
              <h2 className="font-bold text-3xl md:text-4xl text-white tracking-wide">Deana Bringolf</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Deana is passionate about following God wherever He leads; a journey that has taken her to live in seven different states across the United States. She now resides in Watkinsville, Georgia, with her husband of 26 years, Robert, and they have three children: Cooper (21), Tyler (18), and Emily (17). In May 2026, Cooper married his wife, Lizzie, who has been a wonderful addition to the family.
              </p>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Deana seeks to weave her faith into every aspect of her life through marriage, motherhood, and her full-time work. This commitment has led to many meaningful experiences, including working with individuals with disabilities, writing a book, and fostering kittens. Through these and many other adventures, her relationship with God has deepened, fueling a growing passion to encourage others in their own walk of faith.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
