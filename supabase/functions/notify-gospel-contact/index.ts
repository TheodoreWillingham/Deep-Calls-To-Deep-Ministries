// @ts-nocheck
export default {
  fetch: async (req: Request): Promise => {
    // Handle CORS preflight requests from the browser
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        },
      });
    }

    try {
      // Parse the data sent from the frontend
      const { name, knowsJesus, contact } = await req.json();
      
      // Grab the existing secrets we set up earlier
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      const CLIENT_EMAIL = Deno.env.get("CLIENT_EMAIL");

      if (!RESEND_API_KEY || !CLIENT_EMAIL) {
        throw new Error("Missing email credentials.");
      }

      // Build the email body
      const emailHtml = `
        New Connection Request
        Someone reached out from the "Know Jesus" page on the website.
        
          Name:${name}
          Knows Jesus?${knowsJesus === 'yes' ? 'Yes' : 'No'}
          Contact Info:${contact}
        
      `;

      // Send to Resend
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev", // Still using the test sandbox address!
          to: CLIENT_EMAIL,
          subject: `Connection Request from ${name}`,
          html: emailHtml,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });

    } catch (err) {
      console.error("Function Error:", err.message);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};