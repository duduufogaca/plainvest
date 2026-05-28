'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function addPortfolioEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const assetName = String(formData.get('asset_name') || '').trim();
  const ticker = String(formData.get('ticker') || '').trim() || null;
  const assetType = String(formData.get('asset_type') || 'stock');
  const currency = String(formData.get('currency') || 'AUD');
  const quantity = parseFloat(String(formData.get('quantity') || '0'));
  const buyPrice = parseFloat(String(formData.get('buy_price') || '0'));
  const buyDate = String(formData.get('buy_date') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim() || null;

  if (!assetName || quantity <= 0 || buyPrice <= 0) {
    redirect('/portfolio?message=Please fill in asset name, quantity, and buy price correctly.');
  }

  const { error } = await supabase.from('portfolio_entries').insert({
    user_id: user.id,
    asset_name: assetName,
    ticker,
    asset_type: assetType,
    currency,
    quantity,
    buy_price: buyPrice,
    current_price: null,
    buy_date: buyDate,
    notes,
  });

  if (error) {
    const msg = error.code === '42P01'
      ? 'Portfolio table not found. Please run the Supabase setup SQL first.'
      : `Could not add position: ${error.message}`;
    redirect(`/portfolio?message=${encodeURIComponent(msg)}`);
  }

  redirect('/portfolio?success=Position added successfully.');
}

export async function updatePortfolioEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const id = String(formData.get('id') || '');
  const redirectTo = String(formData.get('redirect_to') || '/portfolio');
  const quantity = parseFloat(String(formData.get('quantity') || '0'));
  const buyPrice = parseFloat(String(formData.get('buy_price') || '0'));
  const buyDate = String(formData.get('buy_date') || '').trim() || null;
  const notes = String(formData.get('notes') || '').trim() || null;

  if (!id || quantity <= 0 || buyPrice <= 0) {
    redirect(`${redirectTo}?message=Invalid data. Check quantity and price.`);
  }

  const { error } = await supabase
    .from('portfolio_entries')
    .update({ quantity, buy_price: buyPrice, buy_date: buyDate, notes })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    redirect(`${redirectTo}?message=Could not update entry. Please try again.`);
  }

  redirect(`${redirectTo}?success=Purchase updated.`);
}

export async function deletePortfolioEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const id = String(formData.get('id') || '');
  const redirectTo = String(formData.get('redirect_to') || '/portfolio');
  if (!id) redirect('/portfolio');

  const { error } = await supabase
    .from('portfolio_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    redirect(`${redirectTo}?message=Could not remove position. Please try again.`);
  }

  redirect(`${redirectTo}?success=Purchase removed.`);
}

export async function updateCurrentPrice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const id = String(formData.get('id') || '');
  const rawPrice = String(formData.get('current_price') || '').trim();
  const currentPrice = rawPrice ? parseFloat(rawPrice) : null;
  const redirectTo = String(formData.get('redirect_to') || '/portfolio');

  if (!id) redirect('/portfolio');

  const { error } = await supabase
    .from('portfolio_entries')
    .update({ current_price: currentPrice })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    redirect(`${redirectTo}?message=Could not update price. Please try again.`);
  }

  redirect(`${redirectTo}?success=Market price updated.`);
}
