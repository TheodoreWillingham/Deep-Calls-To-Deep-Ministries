import { useState } from 'react';

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[200] flex flex-col items-center"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 w-full max-w-sm px-4 pt-5 pb-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-base text-white">Search</span>
          <button
            className="bg-transparent border-none text-white text-xl cursor-pointer p-1 leading-none"
            onClick={onClose}
            aria-label="Close search"
          >
            &times;
          </button>
        </div>
        <input
          className="w-full px-3.5 py-3 rounded-md border border-gray-300 text-sm outline-none bg-white text-gray-800"
          type="text"
          placeholder="Search Wild at Heart..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end">
          <button className="bg-accent hover:bg-accent-hover text-white border-none rounded-md px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
