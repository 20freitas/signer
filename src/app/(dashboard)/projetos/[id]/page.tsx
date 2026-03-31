import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Clock, Link as LinkIcon, Target, ArrowLeft } from 'lucide-react'
import { ProjectFiles } from './ProjectFiles'
import { ProjectDeliverables } from './ProjectDeliverables'
import { ProjectDetailsForm } from './ProjectDetailsForm'
import { ProjectSettings } from './ProjectSettings'
import { ProjectShareLink } from './ProjectShareLink'

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

  // fetch clients for the edit form dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name')

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Link href="/projetos" className="inline-flex items-center gap-2 text-[15px] font-medium text-text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} strokeWidth={2} />
          Voltar aos projetos
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-text-secondary mt-1">Cliente: {project.clients?.name}</p>
      </div>

      <Tabs defaultValue="entregas" className="w-full mt-8">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="entregas">Metas & Entregas</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="ficheiros">Ficheiros</TabsTrigger>
          <TabsTrigger value="link">Link - Cliente</TabsTrigger>
          <TabsTrigger value="definicoes">Definições</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entregas" className="mt-6">
          <ProjectDeliverables projectId={project.id} userId={user.id} />
        </TabsContent>

        <TabsContent value="detalhes" className="mt-6 space-y-6">
          <ProjectDetailsForm project={project} clients={clients || []} />
        </TabsContent>

        <TabsContent value="ficheiros" className="mt-6">
          <ProjectFiles projectId={project.id} userId={user.id} />
        </TabsContent>

        <TabsContent value="link" className="mt-6">
          <ProjectShareLink project={project} />
        </TabsContent>

        <TabsContent value="definicoes" className="mt-6">
          <ProjectSettings projectId={project.id} projectName={project.name} />
        </TabsContent>

      </Tabs>
    </div>
  )
}
