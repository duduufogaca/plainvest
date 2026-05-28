'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

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

  redirect('/profile?success=Password updated successfully.');
}
