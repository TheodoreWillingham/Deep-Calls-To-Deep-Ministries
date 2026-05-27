import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const APPROVAL_SECRET = Deno.env.get('APPROVAL_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

async function verifyToken(id: string, token: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(APPROVAL_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    // Restore standard base64 from URL-safe variant
    const padded = token.replace(/-/g, '+').replace(/_/g, '/') + '=='
    const sigBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
    return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(id))
  } catch {
    return false
  }
}

function htmlPage(title: string, body: string) {
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
    { headers: { 'Content-Type': 'text/html' } },
  )
}

serve(async (req) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const token = url.searchParams.get('token')

  if (!id || !token) {
    return htmlPage(
      'Invalid Link',
      '<h2>Invalid Link</h2><p>This approval link is missing required information.</p>',
    )
  }

  const valid = await verifyToken(id, token)
  if (!valid) {
    return htmlPage(
      'Invalid Token',
      '<h2>Invalid Token</h2><p>This link is not valid or may have been tampered with.</p>',
    )
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data, error } = await supabase
    .from('prayer_requests')
    .update({ is_approved: true })
    .eq('id', id)
    .select('request_text, name, is_anonymous, is_approved')
    .single()

  if (error || !data) {
    return htmlPage(
      'Error',
      '<h2>Something went wrong</h2><p>Could not find or update this prayer request. It may have already been approved.</p>',
    )
  }

  const displayName = data.is_anonymous ? 'Anonymous' : (data.name || 'Anonymous')

  return htmlPage(
    'Prayer Request Approved',
    `<h2>&#10003; Prayer Request Approved</h2>
     <p>The prayer request from <strong>${displayName}</strong> will now appear on the website.</p>
     <div class="card">&ldquo;${data.request_text}&rdquo;</div>
     <p style="color:#888;font-size:13px">You can close this tab.</p>`,
  )
})
