// @ts-nocheck
// Deno edge function: not checked by the frontend TypeScript compiler.
// Given a YouTube or Spotify link, returns its title, description and thumbnail
// by reading the page's Open Graph tags.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "open.spotify.com",
]);

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

export default {
  fetch: async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { url } = await req.json();
      const parsed = new URL(String(url));
      if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
        return Response.json(
          { error: "Only YouTube and Spotify links are supported" },
          { status: 400, headers: corsHeaders },
        );
      }

      const res = await fetch(parsed.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DCTDM-MetadataFetcher/1.0)",
          "Accept-Language": "en-US,en;q=0.9",
        },
        redirect: "follow",
      });
      const html = await res.text();

      return Response.json(
        {
          title: metaContent(html, "og:title"),
          description: metaContent(html, "og:description"),
          thumbnail_url: metaContent(html, "og:image"),
        },
        { headers: corsHeaders },
      );
    } catch (err) {
      return Response.json(
        { error: "Could not read that link" },
        { status: 400, headers: corsHeaders },
      );
    }
  },
};
