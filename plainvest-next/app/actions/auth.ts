'use server';

import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';

function getOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase is not connected yet.';
    redirect(`/login?message=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { isPremium } = await getPremiumAccess(supabase, user.id);

    if (isPremium) {
      redirect('/index.html#member');
    }
  }

  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase is not connected yet.';
    redirect(`/signup?message=${encodeURIComponent(message)}`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getOrigin()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`);
  }

  redirect('/login?message=Check your email to confirm your account.');
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // If auth configuration is missing, still let the user leave the dashboard.
  }
  redirect('/login');
}
