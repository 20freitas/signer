import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/shared/MetricCard'
import { Briefcase, CheckCircle, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('studio_name').eq('id', user.id).single()

  const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'in_progress')
  const { count: completedCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed')

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-text-secondary mt-1">Bem-vindo(a) de volta, {profile?.studio_name || 'Designer'}! Aqui está o resumo atual do seu estúdio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        />
        <MetricCard 
          title="Mensagens por Ler" 
          value="0" 
          icon={Clock} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-card-subtle bg-surface">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Empty state for now */}
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border rounded-lg bg-background/50">
              <Clock className="w-10 h-10 text-text-secondary mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-text-primary">Nenhuma atividade</h3>
              <p className="text-sm text-text-secondary mt-1 max-w-sm">
                A sua feed de atividade aparecerá aqui assim que começar a trabalhar em projetos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
