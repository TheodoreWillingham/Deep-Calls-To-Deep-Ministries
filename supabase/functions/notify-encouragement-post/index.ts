// @ts-nocheck
// Deno edge function — emails the admin when a testimony or praise is submitted.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function hmacToken(id: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(id));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export default {
  fetch: async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const CLIENT_EMAIL = Deno.env.get("CLIENT_EMAIL");
    const APPROVAL_SECRET = Deno.env.get("APPROVAL_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const { public_id, kind, name, body, topics, is_anonymous, admin_email } =
      await req.json();
    const recipient = admin_email || CLIENT_EMAIL;

    if (!RESEND_API_KEY || !recipient || !APPROVAL_SECRET || !SUPABASE_URL || !public_id) {
      return Response.json(
        { error: "Missing environment variables" },
        { status: 500, headers: corsHeaders },
      );
    }

    const token = await hmacToken(public_id, APPROVAL_SECRET);
    const approvalUrl =
      `${SUPABASE_URL}/functions/v1/approve-encouragement-post?id=${encodeURIComponent(public_id)}&token=${token}`;

    const label = kind === "praise" ? "Praise" : "Testimony";
    const displayName = is_anonymous
      ? `Anonymous (privately submitted as: ${esc(name)})`
      : esc(name);

    const html = `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#333">
  <h2 style="color:#2a3a2c;margin-top:0">New ${label}</h2>
  <p><strong>From:</strong> ${displayName}</p>
  <p><strong>Posted anonymously:</strong> ${is_anonymous ? "Yes" : "No"}</p>
  <p><strong>Categories:</strong> ${esc((topics ?? []).join(", ")) || "None"}</p>
  <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;margin:16px 0">
    <p style="margin:0;line-height:1.6;white-space:pre-wrap">${esc(body)}</p>
  </div>
  <p style="margin:16px 0 8px">Click to show this ${label.toLowerCase()} on the website:</p>
  <a href="${approvalUrl}"
     style="display:inline-block;background:#3d4f3e;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">
    Approve for Website
  </a>
  <p style="font-size:11px;color:#888;margin-top:10px;word-break:break-all">Link: ${approvalUrl}</p>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: recipient,
        subject: `New ${label} Submitted`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.text());
      return Response.json(
        { error: "Email failed" },
        { status: 500, headers: corsHeaders },
      );
    }
    return Response.json({ success: true }, { headers: corsHeaders });
  },
};
