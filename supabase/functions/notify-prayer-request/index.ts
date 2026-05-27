import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const CLIENT_EMAIL = Deno.env.get('CLIENT_EMAIL')!
const APPROVAL_SECRET = Deno.env.get('APPROVAL_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function hmacToken(id: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(APPROVAL_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(id))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { id, name, request_text, is_anonymous, show_on_website } = await req.json()

    const token = await hmacToken(id)
    const approvalUrl =
      `${SUPABASE_URL}/functions/v1/approve-prayer-request?id=${id}&token=${token}`

    const displayName = is_anonymous
      ? `Anonymous${name ? ` (privately submitted as: ${name})` : ''}`
      : name || 'No name given'

    const approvalSection = show_on_website
      ? `
        <p style="margin:16px 0 8px">This person requested to share publicly. Click below to approve:</p>
        <a href="${approvalUrl}"
           style="display:inline-block;background:#3d4f3e;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">
          ✓ Approve for Website
        </a>
        <p style="font-size:11px;color:#888;margin-top:10px;word-break:break-all">
          Or copy: ${approvalUrl}
        </p>`
      : `<p style="color:#888;font-style:italic">This person did not request public sharing. No approval needed.</p>`

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#333">
        <h2 style="color:#2a3a2c;margin-top:0">New Prayer Request</h2>
        <p><strong>From:</strong> ${displayName}</p>
        <p><strong>Requests website sharing:</strong> ${show_on_website ? 'Yes' : 'No'}</p>
        <div style="background:#f4f4f4;padding:16px 20px;border-radius:8px;margin:16px 0">
          <p style="margin:0;line-height:1.6;white-space:pre-wrap">${request_text}</p>
        </div>
        ${approvalSection}
      </body>
      </html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'prayers@deepcallstodeep.com',
        to: CLIENT_EMAIL,
        subject: show_on_website
          ? 'New Prayer Request — Awaiting Your Approval'
          : 'New Prayer Request Received',
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: 'Email failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
