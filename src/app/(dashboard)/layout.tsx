import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardDock } from '@/components/layouts/DashboardDock'
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary overflow-x-hidden pt-28 relative">
      <main className="flex-1 p-6 md:p-10 min-w-0">
        {children}
      </main>
      <DashboardDock userEmail={user.email} />
    </div>
  )
}

