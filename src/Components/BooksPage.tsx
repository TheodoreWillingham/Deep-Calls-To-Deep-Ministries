import { Book } from "./Book";

interface BooksPageProps {
  onBack: () => void;
}

const bookUrls = [ 
  "https://kottke.org/cdn-cgi/image/format=auto,fit=scale-down,width=1200,metadata=none//plus/misc/images/book-cover-2023-03.jpg",
  "https://www.thebookdesigner.com/wp-content/uploads/2024/05/J.R.R.Tolkien-The-Hobbit.png",
];

export default function BooksPage({ onBack }: BooksPageProps) {
  return (
    <div className="min-h-screen bg-[#4a4a4a] flex flex-col items-center pt-20 md:pt-24">
      {/* Header */}
      <div className="w-full max-w-md px-6 pt-6 pb-4 flex items-center gap-4 shrink-0">
        <button
          onClick={onBack}
          className="text-white bg-transparent border-none cursor-pointer p-0"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="font-bold text-2xl text-white tracking-wide">Books</h1>
      </div>

      {/* Book grid */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-2 gap-10 py-8">
          {bookUrls.map((url, i) => (
            <Book key={i} href={url} />
          ))}
        </div>
      </div>
    </div>
  );
}
