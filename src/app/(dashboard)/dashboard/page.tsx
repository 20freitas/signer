import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/shared/MetricCard'
import { Briefcase, CheckCircle, Clock, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { pt } from 'date-fns/locale'
import { format } from 'date-fns'

export default async function DashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // --- DATA FETCHING ---
  const { data: profile } = await supabase.from('profiles').select('studio_name').eq('id', user.id).single()
  
  // Count real clients
  const { count: clientsCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Count projects by status
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'in_progress')

  const { count: completedCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  // Fetch recent projects
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('id, name, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 pb-20 animate-in fade-in duration-1000 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-text-primary">
            Olá, {profile?.studio_name || 'Designer'}! 👋
          </h1>
          <p className="text-[15px] text-text-secondary mt-3 max-w-lg leading-relaxed">
            Aqui está o resumo do seu estúdio. Tem {projectsCount || 0} projetos a aguardar a sua atenção hoje.
          </p>
        </div>
      </div>

      {/* Main Stats Cards (3 Columns) */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard 
          title="Clientes Ativos" 
          value={clientsCount || 0} 
          icon={Users} 
          description="Total na plataforma"
        />
        <MetricCard 
          title="Projetos em Curso" 
          value={projectsCount || 0} 
          icon={Briefcase} 
          description="Aguardando entrega"
        />
        <MetricCard 
          title="Projetos Concluídos" 
          value={completedCount || 0} 
          icon={CheckCircle} 
          description="Finalizados com sucesso"
        />
      </div>

      {/* Secondary Section: Activity & Quick Feed */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Projects Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Atividade Recente</h2>
              <Link href="/projetos" className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline px-2">Ver Todos</Link>
           </div>
           
           <div className="space-y-3">
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((p) => (
                  <Link key={p.id} href={`/projetos/${p.id}`} className="group block">
                    <div className="bg-white p-5 rounded-3xl border border-black/[0.04] shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            p.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-primary/5 text-primary'
                          }`}>
                             {p.status === 'completed' ? <CheckCircle size={18} /> : <Briefcase size={18} />}
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{p.name}</h4>
                             <p className="text-[11px] font-medium text-text-secondary opacity-60">
                               Iniciado em {format(new Date(p.created_at), "dd 'de' MMMM", { locale: pt })}
                             </p>
                          </div>
                       </div>
                       <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          p.status === 'completed' 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : 'bg-primary/5 text-primary border border-primary/10'
                       }`}>
                          {p.status === 'completed' ? 'Concluído' : 'Em Curso'}
                       </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-black/[0.05] rounded-[32px] bg-white/50">
                   <Clock className="w-8 h-8 text-text-secondary opacity-20 mb-3" />
                   <p className="text-[11px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-40 text-center">
                     Nenhuma atividade registada ainda.
                   </p>
                </div>
              )}
           </div>
        </div>

        {/* Quick Tips or Stats Sidebar */}
        <div className="space-y-6">
           <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight px-1">Foco Semanal</h2>
           <Card className="border-0 shadow-sm bg-white rounded-[32px] overflow-hidden p-8 border-t-[4px] border-primary">
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary opacity-40">Taxa de Conclusão</span>
                    <span className="text-2xl font-black text-text-primary">
                      {Math.round(((completedCount || 0) / ((projectsCount || 0) + (completedCount || 0) || 1)) * 100)}%
                    </span>
                 </div>
                 <div className="w-full bg-black/[0.03] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${((completedCount || 0) / ((projectsCount || 0) + (completedCount || 0) || 1)) * 100}%` }} 
                    />
                 </div>
                 <p className="text-[11px] text-text-secondary leading-relaxed opacity-60">
                    O seu estúdio está a manter um ritmo de produção estável. Continue assim para atingir as suas metas mensais!
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
