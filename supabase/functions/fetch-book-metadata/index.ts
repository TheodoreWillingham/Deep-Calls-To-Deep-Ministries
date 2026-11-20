// @ts-nocheck
// Deno edge function: not checked by the frontend TypeScript compiler.
// Given a link to buy a book (Amazon and similar), returns its title, description and cover.
//
// Amazon often blocks automated page requests, so this works in layers:
//   1. read the page's Open Graph tags (works for many retailers)
//   2. find the book's ISBN in the link, and ask Google Books about it
//   3. if the link has no ISBN, search Google Books using the title words in the link
// The pieces are merged, preferring Google Books for description and cover.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_HOST_PATTERNS = [
  /(^|\.)amazon\.[a-z.]+$/,
  /^(amzn\.to|a\.co|amzn\.com)$/,
  /(^|\.)bookshop\.org$/,
  /(^|\.)barnesandnoble\.com$/,
  /(^|\.)goodreads\.com$/,
  /^books\.google\.[a-z.]+$/,
  /(^|\.)christianbook\.com$/,
  /(^|\.)lifeway\.com$/,
  /(^|\.)penguinrandomhouse\.com$/,
  /(^|\.)harpercollins\.com$/,
];

function hostAllowed(hostname: string): boolean {
  return ALLOWED_HOST_PATTERNS.some((re) => re.test(hostname));
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function metaContent(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return decodeEntities(m[1]).trim();
  }
  return null;
}

function isbn10Valid(s: string): boolean {
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const c = s[i] === "X" ? 10 : Number(s[i]);
    sum += c * (10 - i);
  }
  return sum % 11 === 0;
}

function isbn13Valid(s: string): boolean {
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(s[i]) * (i % 2 === 0 ? 1 : 3);
  return sum % 10 === 0;
}

/** Finds an ISBN in an Amazon-style link (the /dp/ code of a print book is its ISBN-10) or any 13-digit ISBN. */
function isbnFromUrl(url: URL): string | null {
  const asin = url.pathname.match(/\/(?:dp|gp\/product|product|d)\/([0-9X]{10})(?:[/?]|$)/i);
  if (asin && isbn10Valid(asin[1].toUpperCase())) return asin[1].toUpperCase();
  const digits = url.toString().match(/\b97[89]\d{10}\b/);
  if (digits && isbn13Valid(digits[0])) return digits[0];
  const plain = url.pathname.match(/\/(\d{9}[\dX])(?:[/?]|$)/i);
  if (plain && isbn10Valid(plain[1].toUpperCase())) return plain[1].toUpperCase();
  return null;
}

/** Title words from an Amazon-style slug: amazon.com/The-Hobbit-J-R-R-Tolkien/dp/... */
function slugFromUrl(url: URL): string | null {
  const m = url.pathname.match(/^\/([^/]+)\/(?:dp|gp\/product)\//i);
  if (!m) return null;
  const words = decodeURIComponent(m[1]).replace(/[-_+]+/g, " ").trim();
  return words.length > 3 ? words : null;
}

function bestCover(imageLinks: any): string | null {
  if (!imageLinks) return null;
  const raw =
    imageLinks.extraLarge || imageLinks.large || imageLinks.medium ||
    imageLinks.thumbnail || imageLinks.smallThumbnail;
  if (!raw) return null;
  return raw
    .replace(/^http:/, "https:")
    .replace("&edge=curl", "")
    .replace(/zoom=\d/, "zoom=2");
}

function fromVolume(vol: any) {
  const info = vol?.volumeInfo;
  if (!info) return null;
  const title = [info.title, info.subtitle].filter(Boolean).join(": ");
  return {
    title: title || null,
    authors: info.authors ?? [],
    description: info.description
      ? decodeEntities(info.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
      : null,
    cover_url: bestCover(info.imageLinks),
  };
}

function googleKeyParam(): string {
  const key = Deno.env.get("GOOGLE_BOOKS_API_KEY");
  return key ? `&key=${key}` : "";
}

async function googleBooksByIsbn(isbn: string) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1${googleKeyParam()}`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    return fromVolume(json.items?.[0]);
  } catch {
    return null;
  }
}

async function googleBooksByTitle(query: string) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&printType=books${googleKeyParam()}`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    return fromVolume(json.items?.[0]);
  } catch {
    return null;
  }
}

// Open Library: free and needs no key, used when Google Books has nothing or is rate limited.
function olDescription(d: any): string | null {
  const raw = typeof d === "string" ? d : d?.value;
  if (!raw) return null;
  return raw.replace(/\s+/g, " ").trim() || null;
}

async function olWork(workKey: string) {
  try {
    const res = await fetch(`https://openlibrary.org${workKey}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function openLibraryByIsbn(isbn: string) {
  try {
    const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`, { redirect: "follow" });
    if (!res.ok) return null;
    const ed = await res.json();
    const work = ed.works?.[0]?.key ? await olWork(ed.works[0].key) : null;
    const coverId = ed.covers?.find((c: number) => c > 0) ?? work?.covers?.find((c: number) => c > 0);
    return {
      title: [ed.title, ed.subtitle].filter(Boolean).join(": ") || null,
      authors: [],
      description: olDescription(work?.description) || olDescription(ed.description),
      cover_url: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null,
    };
  } catch {
    return null;
  }
}

async function openLibraryByTitle(query: string) {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1&fields=key,title,subtitle,author_name,cover_i`,
    );
    if (!res.ok) return null;
    const doc = (await res.json()).docs?.[0];
    if (!doc) return null;
    const work = doc.key ? await olWork(doc.key) : null;
    return {
      title: [doc.title, doc.subtitle].filter(Boolean).join(": ") || null,
      authors: doc.author_name ?? [],
      description: olDescription(work?.description),
      cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
    };
  } catch {
    return null;
  }
}

async function fetchPage(url: URL) {
  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    const finalUrl = new URL(res.url);
    if (!hostAllowed(finalUrl.hostname)) return null;
    const html = await res.text();
    if (/captcha|robot check|api-services-support@amazon/i.test(html.slice(0, 5000))) {
      return { finalUrl, html: "" };
    }
    return { finalUrl, html };
  } catch {
    return null;
  }
}

function cleanTitle(t: string | null): string | null {
  if (!t) return null;
  return t
    .replace(/^Amazon\.com:\s*/i, "")
    .replace(/\s*:\s*[^:]*:\s*Books\s*$/i, "")
    .replace(/\s*\|\s*Amazon.*$/i, "")
    .replace(/\s*-\s*Amazon.*$/i, "")
    .trim();
}

export default {
  fetch: async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { url } = await req.json();
      const parsed = new URL(String(url));
      if (parsed.protocol !== "https:" || !hostAllowed(parsed.hostname)) {
        return Response.json(
          { error: "That store is not supported. Try an Amazon link." },
          { status: 400, headers: corsHeaders },
        );
      }

      const page = await fetchPage(parsed);
      const finalUrl = page?.finalUrl ?? parsed;
      const html = page?.html ?? "";

      const pageTitle = cleanTitle(metaContent(html, "og:title") || metaContent(html, "twitter:title"));
      const pageDescription = metaContent(html, "og:description") || metaContent(html, "description");
      const pageImage = metaContent(html, "og:image") || metaContent(html, "twitter:image");

      const isbn = isbnFromUrl(finalUrl) || isbnFromUrl(parsed);
      const query = pageTitle || slugFromUrl(finalUrl) || slugFromUrl(parsed);

      // Look the book up by ISBN first, then by title words. Each source fills in what the others lack.
      const sources = [];
      if (isbn) {
        sources.push(await googleBooksByIsbn(isbn));
        sources.push(await openLibraryByIsbn(isbn));
      }
      if (query && !sources.some((b) => b?.title && b?.description && b?.cover_url)) {
        sources.push(await googleBooksByTitle(query));
        sources.push(await openLibraryByTitle(query));
      }
      const found = sources.filter(Boolean);
      const pick = (field: string) => found.map((b) => b[field]).find(Boolean) ?? null;
      const book = {
        title: pick("title"),
        description: pick("description"),
        cover_url: pick("cover_url"),
        authors: found.map((b) => b.authors).find((a) => a?.length) ?? [],
      };

      const coverFallback = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null;

      const result = {
        title: book.title || pageTitle || null,
        description: book.description || pageDescription || null,
        cover_url: book.cover_url || pageImage || coverFallback,
        authors: book.authors,
        isbn,
      };

      if (!result.title) {
        return Response.json(
          { error: "Could not find that book from the link" },
          { status: 404, headers: corsHeaders },
        );
      }
      return Response.json(result, { headers: corsHeaders });
    } catch (_err) {
      return Response.json(
        { error: "Could not read that link" },
        { status: 400, headers: corsHeaders },
      );
    }
  },
};
