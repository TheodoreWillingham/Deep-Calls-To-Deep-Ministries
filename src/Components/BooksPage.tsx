import { Book } from "./Book";

const bookUrls = [
  "https://kottke.org/cdn-cgi/image/format=auto,fit=scale-down,width=1200,metadata=none//plus/misc/images/book-cover-2023-03.jpg",
  "https://www.thebookdesigner.com/wp-content/uploads/2024/05/J.R.R.Tolkien-The-Hobbit.png",
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 md:pt-24">
      {/* Header */}
      <div className="w-full max-w-md px-6 pt-6 pb-4 flex items-center justify-center shrink-0">
        <h1 className="font-bold text-2xl text-white tracking-wide text-center">Books</h1>
      </div>

      {/* Book grid */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8">
          {bookUrls.map((url, i) => (
            <Book key={i} href={url} />
          ))}
        </div>
      </div>
    </div>
  );
}
