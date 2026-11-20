import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export interface MediaItem {
  id: number;
  kind: 'video' | 'podcast';
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  published_at: string;
}

export const FALLBACK_THUMB = '/assets/video-thumb.jpg';

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function isSpotifyUrl(url: string): boolean {
  return /^https?:\/\/open\.spotify\.com\//.test(url.trim());
}

/** Returns an iframe-embeddable URL, or null if the link is not a supported one. */
export function getEmbedUrl(item: Pick<MediaItem, 'kind' | 'url'>): string | null {
  if (item.kind === 'video') {
    const id = getYouTubeId(item.url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
  }
  if (isSpotifyUrl(item.url)) {
    const clean = item.url.trim().split('?')[0].replace('open.spotify.com/', 'open.spotify.com/embed/');
    return clean;
  }
  return null;
}

/** Works out whether a link is a YouTube video or a Spotify podcast, or null if neither. */
export function detectKind(url: string): 'video' | 'podcast' | null {
  if (getYouTubeId(url)) return 'video';
  if (isSpotifyUrl(url)) return 'podcast';
  return null;
}

export interface MediaMetadata {
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

/**
 * Looks up title, description and thumbnail for a link. Uses the
 * fetch-media-metadata edge function (which reads the page's Open Graph tags),
 * and falls back to the public oEmbed endpoints (title and thumbnail only).
 */
export async function lookupMetadata(kind: 'video' | 'podcast', url: string): Promise<MediaMetadata | null> {
  let result: MediaMetadata | null = null;

  try {
    const { data, error } = await supabase.functions.invoke('fetch-media-metadata', { body: { url } });
    if (!error && data?.title) {
      result = {
        title: data.title,
        description: data.description ?? null,
        thumbnail_url: data.thumbnail_url ?? null,
      };
    }
  } catch {
    // fall through to oEmbed
  }

  if (!result || !result.thumbnail_url) {
    const endpoint =
      kind === 'video'
        ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`
        : `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        result = {
          title: result?.title || json.title || '',
          description: result?.description ?? null,
          thumbnail_url: result?.thumbnail_url ?? json.thumbnail_url ?? null,
        };
      }
    } catch {
      // ignore
    }
  }

  return result && result.title ? result : null;
}

export function useMediaItems() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('media_items')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Error fetching media:', error.message);
        setItems((data as MediaItem[]) || []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { items, loading, refresh };
}
