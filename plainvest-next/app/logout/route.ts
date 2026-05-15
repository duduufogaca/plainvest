import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // A logout link should still return the visitor to the public site.
  }

  return NextResponse.redirect('https://plainvest.app', { status: 303 });
}
