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
    <section className="bg-slate-900 flex flex-col items-center pt-10 pb-25 px-2.5 gap-8 md:px-10 lg:px-20 md:pt-20 md:pb-24 md:gap-14">
      <p className="text-2xl leading-[1.2] text-white w-72 self-start ml-1.5 md:text-4xl md:w-auto md:ml-0 md:self-start md:max-w-7xl md:mx-auto md:w-full">
        Latest Videos, Podcasts, and More
      </p>

      <div
        className="
          flex gap-3 items-stretch w-full overflow-x-auto py-1
          md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:max-w-7xl md:mx-auto
        "
      >
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="flex flex-col w-75 min-w-75 rounded-[20px] overflow-hidden md:w-auto md:min-w-0 cursor-pointer group"
          >
            <div className="overflow-hidden">
              <img
                src="/assets/video-thumb.jpg"
                alt={ep.title}
                className="w-full aspect-[691/388] object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="bg-slate-700 flex flex-col gap-4 p-4 md:p-6 flex-1 text-white">
              <p className="font-bold text-xl leading-[1.2] md:text-2xl">{ep.title}</p>
              <p className="font-semibold text-sm leading-[1.4] md:text-base">{ep.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full max-w-84 mt-2 md:flex-row md:max-w-3xl md:gap-6 md:mt-4">
        <button className="bg-white flex items-center justify-center py-5 md:py-6 rounded-lg border-none cursor-pointer w-full md:flex-1 hover:bg-gray-50 transition-colors">
          <span className="font-open-sans font-bold text-xl text-black text-center">
            Support DCTDM
          </span>
        </button>
        <button className="bg-slate-700 flex items-center justify-center py-5 md:py-6 rounded-lg border border-white cursor-pointer w-full md:flex-1 hover:bg-slate-600 transition-colors">
          <span className="font-open-sans font-bold text-xl text-white text-center">
            Find an Event or Host One
          </span>
        </button>
      </div>
    </section>
  );
}
