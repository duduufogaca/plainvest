'use server';

import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { getPostHogClient } from '@/lib/posthog-server';
import { sendPasswordChangedEmail, sendAdminNewUser } from '@/lib/email/service';

function getOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

function getPublicSiteUrl() {
  return process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || 'https://plainvest.app';
}

function friendlyAuthMessage(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('email not confirmed') || lower.includes('confirm')) {
    return 'Please confirm your email first. Open the confirmation email from Plainvest, then try logging in again.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'The email or password is not correct. You can try again or reset your password.';
  }
  return 'We could not complete that request. Please try again.';
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    redirect('/login?message=Login is not available right now. Please try again shortly.');
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const lower = error.message.toLowerCase();
    if (lower.includes('email not confirmed') || lower.includes('confirm')) {
      redirect(`/login?confirm_email=1&email=${encodeURIComponent(email)}`);
    }
    redirect(`/login?message=${encodeURIComponent(friendlyAuthMessage(error.message))}`);
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const posthog = getPostHogClient();
    posthog.identify({ distinctId: user.id, properties: { email: user.email } });
    posthog.capture({ distinctId: user.id, event: 'user_logged_in' });
    await posthog.shutdown();

    const { isPremium } = await getPremiumAccess(supabase, user.id);

    if (isPremium) {
      redirect('/home');
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
  } catch {
    redirect('/signup?message=Signup is not available right now. Please try again shortly.');
  }

  // Clear any existing session so creating an account never leaves a
  // previously logged-in user active (e.g. on a shared/other computer).
  await supabase.auth.signOut().catch(() => {});

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getOrigin()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(friendlyAuthMessage(error.message))}`);
  }

  if (data.user) {
    const posthog = getPostHogClient();
    posthog.identify({ distinctId: data.user.id, properties: { email: data.user.email } });
    posthog.capture({ distinctId: data.user.id, event: 'user_signed_up' });
    await posthog.shutdown();

    const name = data.user.user_metadata?.full_name || '';
    const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
    // Welcome email is sent AFTER the user confirms (in /auth/callback) so it
    // doesn't arrive before the confirmation email. Admin notify on signup.
    sendAdminNewUser({ name: name || email, email, date }).catch(() => {});
  }

  redirect('/login?message=Check your email to confirm your account.');
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    redirect('/forgot-password?message=Password reset is not available right now. Please try again soon.');
  }

  if (email) {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getOrigin()}/auth/callback?next=/update-password`,
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const posthog = getPostHogClient();
      posthog.capture({ distinctId: user.id, event: 'password_reset_requested' });
      await posthog.shutdown();
    }
  }

  redirect('/forgot-password?message=If that email exists, a password reset link has been sent.');
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') || '');
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    redirect('/update-password?message=Password update is not available right now. Please try again soon.');
  }

  if (password.length < 6) {
    redirect('/update-password?message=Use at least 6 characters.');
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect('/update-password?message=We could not update your password. Please request a new reset link.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const posthog = getPostHogClient();
    posthog.capture({ distinctId: user.id, event: 'password_updated' });
    await posthog.shutdown();

    const name = user.user_metadata?.full_name || '';
    if (user.email) sendPasswordChangedEmail(user.email, name).catch(() => {});
  }

  redirect('/login?message=Password updated. You can log in now.');
}

export async function resendConfirmation(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect('/login?message=Could not send email right now. Please try again shortly.');
  }
  if (email) {
    await supabase.auth.resend({ type: 'signup', email });
  }
  redirect('/login?message=Confirmation email sent — check your inbox and spam folder.');
}

export async function signOut() {
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
    await supabase.auth.signOut();
  } catch {
    // If auth configuration is missing, still let the user leave the dashboard.
  }

  if (userId) {
    const posthog = getPostHogClient();
    posthog.capture({ distinctId: userId, event: 'user_logged_out' });
    await posthog.shutdown();
  }

  redirect(getPublicSiteUrl());
}
