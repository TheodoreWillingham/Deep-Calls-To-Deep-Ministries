import { Book } from "./Components/Book";
import "./index.css";

const bookUrls = [
  "/bookcover1.jpg",
  "/bookcover2.jpg",
];

function App() {
  return (
    <main className="flex flex-col items-center justify-center py-16 min-h-screen w-full bg-[#4a4a4a]">
      <div className="grid grid-cols-2 gap-10">
        {bookUrls.map((url, i) => (
          <li key={i}>
            <Book href={url} />
          </li>
        ))}
      </div>
    </main>
  );
}

export default App
