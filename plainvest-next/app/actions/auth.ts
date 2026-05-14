'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function getOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = await createClient();

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
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
