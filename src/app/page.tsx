import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/landing/HeroSection'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { Waitlist } from '@/components/landing/Waitlist'
import { Footer } from '@/components/landing/Footer'
import { getWaitlistCount } from '@/app/actions/waitlist'

export default async function Home() {
  const initialCount = await getWaitlistCount();
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
       <HeroSection user={user} />
       <Features />
       <ComparisonTable />
       <Testimonials />
       
       <Waitlist initialCount={initialCount} />

       <Footer />
    </div>
  )
}
