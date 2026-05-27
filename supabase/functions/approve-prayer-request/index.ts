// @ts-nocheck
// Deno edge function — not checked by the frontend TypeScript compiler.
// Deployed with verify_jwt = false so email approval links work without auth headers.

async function verifyToken(
  id: string,
  token: string,
  secret: string,
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    // Convert URL-safe base64 back to standard base64
    const padded = token.replace(/-/g, "+").replace(/_/g, "/") + "==";
    const sigBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(id),
    );
  } catch {
    return false;
  }
}

function htmlPage(title: string, body: string): Response {
  return new Response(
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    body{font-family:sans-serif;max-width:500px;margin:80px auto;padding:20px;text-align:center;color:#333}
    h2{color:#2a3a2c}
    .card{background:#f4f4f4;padding:16px 20px;border-radius:8px;margin:16px 0;text-align:left;font-style:italic;line-height:1.6}
  </style>
</head>
<body>${body}</body>
</html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}

export default {
  fetch: async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const token = url.searchParams.get("token");

    if (!id || !token) {
      return htmlPage(
        "Invalid Link",
        "<h2>Invalid Link</h2><p>This approval link is missing required information.</p>",
      );
    }

    const APPROVAL_SECRET = Deno.env.get("APPROVAL_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!APPROVAL_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return htmlPage(
        "Configuration Error",
        "<h2>Configuration Error</h2><p>The server is missing required environment variables.</p>",
      );
    }

    const valid = await verifyToken(id, token, APPROVAL_SECRET);
    if (!valid) {
      return htmlPage(
        "Invalid Token",
        "<h2>Invalid Token</h2><p>This link is not valid or may have been tampered with.</p>",
      );
    }

    // Use the Supabase REST API directly — no client library needed
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/prayer_requests?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ is_approved: true }),
      },
    );

    if (!res.ok) {
      console.error("Supabase patch error:", await res.text());
      return htmlPage(
        "Error",
        "<h2>Something went wrong</h2><p>Could not approve this request. It may have already been approved.</p>",
      );
    }

    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    const displayName = row?.is_anonymous
      ? "Anonymous"
      : row?.name || "Anonymous";

    return htmlPage(
      "Prayer Request Approved",
      `<h2>&#10003; Prayer Request Approved</h2>
       <p>The request from <strong>${displayName}</strong> will now appear on the website.</p>
       <div class="card">&ldquo;${row?.request_text ?? ""}&rdquo;</div>
       <p style="color:#888;font-size:13px">You can close this tab.</p>`,
    );
  },
};
