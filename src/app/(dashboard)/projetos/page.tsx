import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Folder, User, Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
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
              <Link key={project.id} href={`/projetos/${project.id}`} className="block h-full relative group">
                <Card className="h-full border-0 shadow-card-subtle bg-surface hover:shadow-lg transition-all duration-300 relative z-0 overflow-hidden rounded-[24px]">
                  {/* Background Watermark Icon - Switched to simple Folder for clean aesthetics */}
                  <div className="absolute -bottom-12 -right-12 text-primary/10 pointer-events-none z-0">
                    <Folder size={240} strokeWidth={2} />
                  </div>
                  
                  <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6 flex-grow">
                      <div className="pr-6">
                        <h3 className="font-bold text-[22px] leading-tight text-foreground tracking-tight line-clamp-2">
                          {project.name}
                        </h3>
                      </div>
                      <div className={`text-[12px] whitespace-nowrap font-medium px-3 py-1 rounded-full border bg-white/80 backdrop-blur-sm shadow-sm ${project.status === 'in_progress' ? 'border-blue-200 text-blue-700' : project.status === 'completed' ? 'border-green-200 text-green-700' : 'border-yellow-200 text-yellow-700'}`}>
                        {project.status === 'in_progress' ? 'Em curso' : project.status === 'completed' ? 'Concluído' : 'Em pausa'}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 flex flex-col gap-3">
                      {project.clients?.name && (
                        <div className="flex items-center text-[15px] text-text-primary gap-2">
                          <User size={16} strokeWidth={1.5} className="text-foreground/80" />
                          {project.clients.name}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-[15px] text-text-secondary">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={16} strokeWidth={1.5} className="text-foreground/80" />
                          {project.due_date ? new Date(project.due_date).toLocaleDateString('pt-PT') : 'Sem data límite'}
                        </div>
                        <ArrowRight size={16} strokeWidth={1.5} className="text-primary/50 group-hover:text-primary transition-colors" />
                      </div>
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
