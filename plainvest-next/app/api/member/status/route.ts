import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, premium: false });
    }

    const { isPremium } = await getPremiumAccess(supabase, user.id);

    return NextResponse.json({
      authenticated: true,
      premium: isPremium,
      email: user.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to check member access.';
    return NextResponse.json({ authenticated: false, premium: false, error: message }, { status: 500 });
  }
}
