import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export interface BookItem {
  id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  buy_url: string | null;
  created_at: string;
}

export interface BookMetadata {
  title: string;
  description: string | null;
  cover_url: string | null;
}

/** Asks the fetch-book-metadata edge function to read a buy link and return the book's details. */
export async function lookupBook(url: string): Promise<BookMetadata | null> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-book-metadata', { body: { url } });
    if (error || !data?.title) return null;
    return {
      title: data.title,
      description: data.description ?? null,
      cover_url: data.cover_url ?? null,
    };
  } catch {
    return null;
  }
}

/** Uploads a cover image to the public book-covers bucket and returns its public URL. */
export async function uploadCover(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('book-covers').upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return supabase.storage.from('book-covers').getPublicUrl(path).data.publicUrl;
}

export function useBooks() {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Error fetching books:', error.message);
        setBooks((data as BookItem[]) || []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { books, loading, refresh };
}
