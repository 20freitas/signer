import { createClient } from '@/lib/supabase/server'
import { BrandingWorkspace } from './BrandingWorkspace'
import { redirect } from 'next/navigation'

export default async function BrandingPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch the user's branding settings safely
  const { data: brandingData, error } = await supabase
    .from('user_branding')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Note: if the table doesn't exist yet (42P01 error), pass empty initialData
  // If it does exist but is empty (PGRST116), same thing.
  const isMissingTable = error && error.code === '42P01'
  const isNoRow = error && error.code === 'PGRST116'
  
  if (error && !isMissingTable && !isNoRow) {
     console.error("Error fetching branding data:", error)
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <BrandingWorkspace 
        initialData={brandingData || null} 
        userId={user.id} 
      />
    </div>
  )
}
