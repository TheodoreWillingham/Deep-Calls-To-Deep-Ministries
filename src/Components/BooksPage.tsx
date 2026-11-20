import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Book } from './Book';
import BookFormModal from './BookFormModal';
import { useBooks, type BookItem } from './bookUtils';

interface BooksPageProps {
  isAdmin?: boolean;
}

export default function BooksPage({ isAdmin = false }: BooksPageProps) {
  const { books, loading, refresh } = useBooks();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BookItem | null>(null);

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(book: BookItem) {
    setEditing(book);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(book: BookItem) {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('books').delete().eq('id', book.id);
    if (error) {
      console.error('Error deleting book:', error.message);
      window.alert('Failed to delete.');
      return;
    }
    refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 md:pt-24 stagger-rise">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 grid grid-cols-[1fr_auto_1fr] items-center shrink-0">
        <span aria-hidden />
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center m-0">Books</h1>
        <div className="flex justify-end">
          {isAdmin && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1 bg-accent hover:bg-accent-hover text-white border-none rounded-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base cursor-pointer transition-colors"
              aria-label="Add book"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Book</span>
            </button>
          )}
        </div>
      </div>

      {/* Book grid */}
      <div className="w-full flex justify-center px-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <p className="text-gray-400 text-center text-sm py-16 m-0">
            {isAdmin ? 'No books yet. Use the Add Book button to post one.' : 'New books are coming soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8 pb-28 md:pb-12">
            {books.map((book) => (
              <div key={book.id} className="flex flex-col items-center gap-8 w-[260px]">
                <Book
                  href={book.cover_url || '/assets/video-thumb.jpg'}
                  link={book.buy_url || undefined}
                  title={book.title}
                />
                <div className="flex flex-col items-center gap-2 text-center">
                  <h2 className="text-white font-bold text-lg leading-snug m-0">{book.title}</h2>
                  {book.description && (
                    <p className="text-gray-400 text-sm leading-relaxed m-0 line-clamp-4">{book.description}</p>
                  )}
                  {book.buy_url && (
                    <a
                      href={book.buy_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1 inline-flex items-center px-4 py-2 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold no-underline transition-colors"
                    >
                      Buy the book
                    </a>
                  )}
                  {isAdmin && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => openEdit(book)}
                        className="text-white bg-transparent border border-white/40 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        className="text-red-300 bg-transparent border border-red-300/40 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-red-300/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <BookFormModal
          book={editing}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            refresh();
          }}
        />
      )}
    </div>
  );
}
