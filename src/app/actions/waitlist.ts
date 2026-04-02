'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { error: 'E-mail inválido. Por favor, tente novamente.' };
  }

  const supabase = await createClient();

  // Check if subscriber already exists - more robust check
  const { data: existing, error: checkError } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Check Error:', checkError);
    return { error: `Erro na verificação: ${checkError.message}` };
  }

  if (existing) {
    return { error: 'Este e-mail já está na nossa lista de espera. Obrigado!' };
  }

  // Insert with detailed error capture
  const { error: insertError } = await supabase
    .from('waitlist')
    .insert([{ email }]);

  if (insertError) {
    console.error('Insert Error:', insertError);
    // Returning the actual message for debugging in dev
    return { error: `Erro ao registar: ${insertError.message} (Código: ${insertError.code})` };
  }

  revalidatePath('/');
  return { success: 'Obrigado por se juntar à elite do Signer! Fique atento ao seu e-mail.' };
}

export async function getWaitlistCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching waitlist count:', error);
    return 0;
  }

  return count || 0;
}
