declare const process: { env: Record<string, string | undefined> };

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { ok: false, error: 'Missing Supabase environment variables' },
      { status: 500 }
    );
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/be_still_moments?select=id&limit=1`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ ok: false, status: res.status, error: text }, { status: 500 });
  }

  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
}