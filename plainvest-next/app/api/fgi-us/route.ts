import { NextResponse } from 'next/server';

const CNN_URL = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata/';

export async function GET() {
  try {
    const res = await fetch(CNN_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Plainvest/1.0)',
        Accept: 'application/json',
      },
      next: { revalidate: 1800 }, // cache 30 min
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'upstream_error', status: res.status }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 });
  }
}
