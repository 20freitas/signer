import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Building2, Mail, Phone, Calendar as CalendarIcon, FileText, ArrowLeft, FolderKanban, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientFormDialog } from '../ClientFormDialog'

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch client details
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !client) {
    notFound()
  }

  // Fetch projects for this client
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
      <Link href="/clientes" className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Voltar aos clientes
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-xl border border-border/50 shadow-card-subtle">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {client.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {client.company && (
            <div className="flex items-center text-text-secondary mt-2 gap-1.5">
              <Building2 size={16} />
              <span className="text-lg">{client.company}</span>
            </div>
          )}
        </div>
        
        <ClientFormDialog 
          client={client} 
          customTrigger={
            <button className="flex items-center gap-2 h-10 px-4 bg-background border border-border/60 rounded-md text-sm font-medium hover:bg-surface hover:border-border transition-colors shadow-sm">
              <Pencil size={14} className="text-text-secondary" />
              Editar Cliente
            </button>
          } 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-0 shadow-card-subtle bg-surface">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText size={18} className="text-primary" /> 
                Contactos e Detalhes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {client.email && (
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">E-mail</div>
                  <div className="flex items-center gap-2 text-text-primary">
                    <Mail size={16} className="text-text-secondary" />
                    <a href={`mailto:${client.email}`} className="hover:text-primary transition-colors truncate">{client.email}</a>
                  </div>
                </div>
              )}
              {client.phone && (
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Telefone</div>
                  <div className="flex items-center gap-2 text-text-primary">
                    <Phone size={16} className="text-text-secondary" />
                    <a href={`tel:${client.phone}`} className="hover:text-primary transition-colors">{client.phone}</a>
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Cliente desde</div>
                <div className="flex items-center gap-2 text-text-primary">
                  <CalendarIcon size={16} className="text-text-secondary" />
                  {new Date(client.created_at).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </CardContent>
          </Card>

          {client.notes && (
            <Card className="border-0 shadow-card-subtle bg-surface">
              <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Notas Internas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-card-subtle bg-surface h-full min-h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 pt-6 border-b border-border/40 mb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FolderKanban size={18} className="text-primary" />
                Projetos do Cliente
              </CardTitle>
              <div className="text-sm text-text-secondary bg-background px-3 py-1 rounded-full font-medium">
                {projects?.length || 0} {(projects?.length === 1) ? 'Projeto' : 'Projetos'}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {!projects || projects.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <FolderKanban size={48} className="mx-auto text-text-secondary opacity-20 mb-4" />
                  <h3 className="text-text-primary font-medium text-lg">Sem projetos ah?</h3>
                  <p className="text-sm text-text-secondary mt-1 mb-6 max-w-sm mx-auto">Ainda não há nenhum trabalho associado a este cliente.</p>
                  <Link href="/projetos">
                    <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                      Começar um novo projeto
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map(project => (
                    <Link key={project.id} href={`/projetos/${project.id}`} className="block">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-background/80 border border-border/40 hover:border-border hover:shadow-sm transition-all group">
                        <div>
                          <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors">{project.name}</h4>
                          <div className="flex items-center text-xs text-text-secondary mt-1.5 gap-3">
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon size={14} className="opacity-70" />
                              {project.due_date ? new Date(project.due_date).toLocaleDateString('pt-PT') : 'Sem prazo'}
                            </span>
                          </div>
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                          {project.status === 'in_progress' ? 'Em curso' : project.status === 'completed' ? 'Concluído' : 'Em Pausa'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
