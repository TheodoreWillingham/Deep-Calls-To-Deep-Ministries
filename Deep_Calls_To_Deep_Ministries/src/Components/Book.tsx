export function Book({ href, link }: { href: string; link?: string }) {
  return (
    <a
      className="book-container inline-flex items-center justify-center w-fit h-fit"
      href={link || "#"}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="book relative w-[200px] h-[300px]">
        <img
          alt="Book Cover"
          src={href}
          className="absolute top-0 left-0 w-[200px] h-[300px] rounded-r-sm object-cover"
          style={{ transform: "translateZ(15px)", boxShadow: "5px 5px 20px #666" }}
        />
      </div>
    </a>
  );
}
