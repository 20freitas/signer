import { createClient } from '@/lib/supabase/server'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Calendar as CalendarIcon, ExternalLink, Timer } from 'lucide-react'
import Link from 'next/link'
import { MilestoneSlider } from '@/components/calendar/MilestoneSlider'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'

export default async function CalendarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 1. Fetch Branding (to get agency slug)
  const { data: branding } = await supabase
    .from('user_branding')
    .select('slug, agency_name')
    .eq('user_id', user.id)
    .single()

  // 2. Fetch all project deliverables for this user
  const { data: milestonesData } = await supabase
    .from('project_deliverables')
    .select(`
      *,
      project:projects (
        id,
        name,
        slug
      )
    `)
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })

  // 3. Fetch projects themselves if they have a due_date
  const { data: projectsData } = await supabase
    .from('projects')
    .select('id, name, slug, due_date')
    .eq('user_id', user.id)
    .not('due_date', 'is', 'null')

  // Transform projects into a "Milestone" like object for the unified view
  const projectEvents = (projectsData || []).map(p => ({
    id: `p-${p.id}`,
    title: `Entrega Final: ${p.name}`,
    status: 'pending', // Assume pending if it's in this list
    due_date: p.due_date,
    isProjectDeadline: true, // Special flag for styling if needed
    project: {
       name: p.name,
       slug: p.slug
    }
  }))

  const allMilestones = (milestonesData || []).filter(m => m.project)
  
  // Merge and sort everything
  const unifiedEvents = [...allMilestones, ...projectEvents].sort((a, b) => 
    new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )

  // 4. Final filter for the slider vs grid
  const upcomingEvents = unifiedEvents
    .filter(e => e.status !== 'completed')
    .slice(0, 10)

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 px-4 animate-in fade-in duration-1000">
      
      {/* Header & Slider Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-4 text-text-primary">
              <div className="w-14 h-14 rounded-[22px] bg-white border border-black/[0.04] shadow-sm flex items-center justify-center">
                <CalendarIcon className="w-7 h-7 text-primary" />
              </div>
              Calendário de Entregas
            </h1>
            <p className="text-[15px] text-text-secondary mt-3 max-w-lg leading-relaxed">
              Visualize e gira todos os prazos da sua agência num só lugar. 
              Mantenha o controlo sobre cada milestone e nunca perca um deadline.
            </p>
          </div>
          <div className="flex items-center gap-6 px-6 py-4 bg-white border border-black/[0.03] rounded-[24px] shadow-sm shrink-0">
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Próximos Eventos</span>
                <span className="text-xl font-black text-text-primary">{upcomingEvents.length} Ativos</span>
             </div>
             <div className="w-px h-8 bg-black/[0.05]" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40">Hoje</span>
                <span className="text-xl font-black text-primary">{format(new Date(), "dd MMM", { locale: pt })}</span>
             </div>
          </div>
        </div>

        {/* --- MILESTONE SLIDER --- */}
        <div className="relative -mx-4 px-4 overflow-visible">
           {upcomingEvents.length > 0 ? (
             <MilestoneSlider 
               milestones={upcomingEvents as any} 
               agencySlug={branding?.slug || ''} 
             />
           ) : (
             <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-black/[0.05] rounded-[32px] bg-white/50">
                <Timer className="w-8 h-8 text-text-secondary opacity-10 mb-3" />
                <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40">Sem próximas entregas agendadas.</p>
             </div>
           )}
        </div>
      </section>

      {/* Main Calendar Grid Section */}
      <section className="space-y-6">
         <CalendarGrid 
           milestones={unifiedEvents as any} 
           agencySlug={branding?.slug || ''} 
         />
      </section>
    </div>
  )
}
