// @ts-nocheck
// Deno edge function: not checked by the frontend TypeScript compiler.
// Emails the site owner when someone submits the Connect form.
//
// The browser only sends the id of the row it just saved. This function reads the row itself
// (using the service role key), so it can only ever email details that were really stored,
// and it marks the row as notified so the same submission can't trigger a second email.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default {
  fetch: async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { id } = await req.json();
      if (typeof id !== "string" || !UUID_RE.test(id)) {
        return Response.json({ error: "Invalid id" }, { status: 400, headers: corsHeaders });
      }

      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      const CLIENT_EMAIL = Deno.env.get("CLIENT_EMAIL");
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (!RESEND_API_KEY || !CLIENT_EMAIL || !SUPABASE_URL || !SERVICE_KEY) {
        return Response.json(
          { error: "Missing environment variables" },
          { status: 500, headers: corsHeaders },
        );
      }

      const dbHeaders = {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      };

      const rowRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contact_submissions?id=eq.${id}&select=*`,
        { headers: dbHeaders },
      );
      const rows = rowRes.ok ? await rowRes.json() : [];
      const row = rows[0];
      if (!row) {
        return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
      }
      if (row.notified_at) {
        return Response.json({ success: true, alreadySent: true }, { headers: corsHeaders });
      }

      const fullName = `${row.first_name} ${row.last_name}`.trim();
      const html = `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#333">
  <h2 style="margin-top:0">New message from the Connect page</h2>
  <p>Someone would like to connect with you.</p>
  <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;margin:16px 0;line-height:1.8">
    <div><strong>Name:</strong> ${esc(fullName)}</div>
    <div><strong>Email:</strong> <a href="mailto:${esc(row.email)}">${esc(row.email)}</a></div>
    <div><strong>Phone:</strong> ${row.phone ? esc(row.phone) : "Not provided"}</div>
  </div>
  ${row.message
    ? `<p style="margin:16px 0 6px"><strong>Message:</strong></p>
  <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;line-height:1.6;white-space:pre-wrap">${esc(row.message)}</div>`
    : ""}
  <p style="font-size:12px;color:#888">You can reply to this email to respond to them directly.</p>
</body>
</html>`;

      const sendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: CLIENT_EMAIL,
          reply_to: row.email,
          subject: `New Connect message from ${fullName}`,
          html,
        }),
      });

      if (!sendRes.ok) {
        console.error("Resend error:", await sendRes.text());
        return Response.json({ error: "Email failed" }, { status: 500, headers: corsHeaders });
      }

      await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...dbHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({ notified_at: new Date().toISOString() }),
      });

      return Response.json({ success: true }, { headers: corsHeaders });
    } catch (err) {
      console.error("Function error:", err?.message);
      return Response.json({ error: "Something went wrong" }, { status: 500, headers: corsHeaders });
    }
  },
};
