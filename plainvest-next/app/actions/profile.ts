'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendPasswordChangedEmail } from '@/lib/email/service';

const VALID_LANGS     = ['en', 'pt'] as const;
const VALID_CURRENCIES = ['AUD', 'USD', 'BRL'] as const;

export async function savePreferences(formData: FormData) {
  const lang     = String(formData.get('lang') || 'en');
  const currency = String(formData.get('currency') || 'AUD');

  const safeLang     = VALID_LANGS.includes(lang as 'en' | 'pt') ? lang : 'en';
  const safeCurrency = VALID_CURRENCIES.includes(currency as 'AUD' | 'USD' | 'BRL') ? currency : 'AUD';

  const cookieStore = await cookies();
  const opts = { maxAge: 60 * 60 * 24 * 365, path: '/' } as const;
  cookieStore.set('pv_lang', safeLang, opts);
  cookieStore.set('pv_currency', safeCurrency, opts);

  redirect('/profile?success=Preferences saved.');
}

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get('full_name') || '').trim();
  const dateOfBirth = String(formData.get('date_of_birth') || '').trim();
  const gender = String(formData.get('gender') || '').trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, date_of_birth: dateOfBirth, gender },
  });

  if (error) {
    redirect('/profile?message=Could not update profile. Please try again.');
  }

  redirect('/profile?success=Profile updated successfully.');
}

export async function changePassword(formData: FormData) {
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('password_confirm') || '');

  if (password.length < 6) {
    redirect('/profile?message=Password must be at least 6 characters.#security');
  }

  if (password !== confirm) {
    redirect('/profile?message=Passwords do not match.#security');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect('/profile?message=Could not update password. Please try again.#security');
  }

  const name = user.user_metadata?.full_name || '';
  if (user.email) sendPasswordChangedEmail(user.email, name).catch(() => {});

  redirect('/profile?success=Password updated successfully.');
}
