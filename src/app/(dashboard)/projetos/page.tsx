import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { FolderKanban, Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import { ProjectFormDialog } from './ProjectFormDialog'
import Link from 'next/link'

export default async function ProjetosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch clients for the dropdown
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name')

  // Fetch projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-text-secondary mt-1">Acompanhe todos os trabalhos em curso e concluídos.</p>
        </div>
        <ProjectFormDialog clients={clients || []} />
      </div>

      <div className="mt-8">
        {!projects || projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-lg bg-surface">
            <h3 className="text-lg font-medium text-text-primary">Sem projetos abertos</h3>
            <p className="text-sm text-text-secondary mt-1 max-w-sm">
              Crie um projeto para começar a adicionar ficheiros e trocar mensagens.
            </p>
            {(!clients || clients.length === 0) ? (
              <p className="text-sm text-destructive mt-4">Precisa de criar primeiro um cliente no menu Clientes.</p>
            ) : (
              <ProjectFormDialog clients={clients || []} triggerVariant="outline" />
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Link key={project.id} href={`/projetos/${project.id}`}>
                <Card className="border-0 shadow-card-subtle bg-surface hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/10 p-2 rounded-md text-primary">
                        <FolderKanban size={18} />
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {project.status === 'in_progress' ? 'Em curso' : project.status === 'completed' ? 'Concluído' : 'Em pausa'}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-1">
                      {project.clients?.name || 'Cliente desconhecido'}
                    </p>
                    
                    <div className="mt-auto pt-6 flex items-center justify-between text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon size={14} />
                        {project.due_date ? new Date(project.due_date).toLocaleDateString('pt-PT') : 'Sem data límite'}
                      </div>
                      <ArrowRight size={14} className="text-primary opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
