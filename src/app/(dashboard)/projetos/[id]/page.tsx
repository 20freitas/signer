import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Clock, Link as LinkIcon } from 'lucide-react'
import { ProjectMessages } from './ProjectMessages'
import { ProjectFiles } from './ProjectFiles'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // fetch project
  const { data: project } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!project) return notFound()

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
          <span>Projetos</span>
          <span>/</span>
          <span className="text-text-primary">{project.name}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-text-secondary mt-1">Cliente: {project.clients?.name}</p>
      </div>

      <Tabs defaultValue="detalhes" className="w-full mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="ficheiros">Ficheiros</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalhes" className="mt-6 space-y-6">
          <Card className="border-0 shadow-card-subtle bg-surface">
            <CardHeader>
              <CardTitle>Sobre este projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary">Estado</p>
                  <div className={`mt-1 inline-flex text-xs px-2 py-1 rounded-full ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {project.status === 'in_progress' ? 'Em curso' : project.status === 'completed' ? 'Concluído' : 'Em pausa'}
                  </div>
                </div>
                <div>
                  <p className="text-text-secondary">Data Límite</p>
                  <div className="mt-1 flex items-center gap-1.5 font-medium">
                    <CalendarIcon size={14} />
                    {project.due_date ? new Date(project.due_date).toLocaleDateString('pt-PT') : 'Não definida'}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-text-secondary mb-1">Descrição</p>
                <p className="text-sm whitespace-pre-wrap">{project.description || 'Nenhuma descrição providenciada.'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ficheiros" className="mt-6">
          <ProjectFiles projectId={project.id} userId={user.id} />
        </TabsContent>

        <TabsContent value="mensagens" className="mt-6">
          <ProjectMessages projectId={project.id} userId={user.id} />
        </TabsContent>

      </Tabs>
    </div>
  )
}
