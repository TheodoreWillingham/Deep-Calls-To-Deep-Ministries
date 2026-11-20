export function Book({ href, link, title }: { href: string; link?: string; title?: string }) {
  return (
    <a
      className="book-container inline-flex items-center justify-center w-fit h-fit"
      href={link || undefined}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={title ? `${title}${link ? ' (opens the store page)' : ''}` : undefined}
    >
      <div className="book relative w-[200px] h-[300px]">
        <img
          alt={title ? `Cover of ${title}` : 'Book Cover'}
          src={href}
          className="absolute top-0 left-0 w-[200px] h-[300px] rounded-r-sm object-cover"
          style={{ transform: "translateZ(15px)", boxShadow: "5px 5px 20px #666" }}
        />
      </div>
    </a>
  );
}
