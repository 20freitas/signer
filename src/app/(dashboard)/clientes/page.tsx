import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Phone, Mail, CircleUserRound } from 'lucide-react'
import { ClientFormDialog } from './ClientFormDialog'
import { ClientCardActions } from './ClientCardActions'
import Link from 'next/link'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-text-secondary mt-1">Gira os seus clientes e associe projetos.</p>
        </div>
        <ClientFormDialog />
      </div>

      <div className="mt-8">
        {!clients || clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-lg bg-surface">
            <h3 className="text-lg font-medium text-text-primary">Ainda não tem clientes</h3>
            <p className="text-sm text-text-secondary mt-1 max-w-sm">
              Adicione o seu primeiro cliente para começar a organizar os seus projetos.
            </p>
            <ClientFormDialog triggerVariant="outline" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map(client => (
              <div key={client.id} className="relative group">
                <Link href={`/clientes/${client.id}`} className="block h-full relative">
                  <Card className="h-full border-0 shadow-card-subtle bg-surface hover:shadow-lg transition-all duration-300 relative z-0 overflow-hidden rounded-[24px]">
                    {/* Background Watermark Icon - Balanced size and thickness */}
                    <div className="absolute -bottom-12 -right-8 text-primary/10 pointer-events-none z-0">
                      <CircleUserRound size={240} strokeWidth={2} />
                    </div>
                    
                    <CardContent className="p-6 sm:p-8 relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="pr-12">
                          <h3 className="font-bold text-[22px] leading-tight text-foreground tracking-tight mb-2">
                            {client.name}
                          </h3>
                          {client.company && (
                            <div className="flex items-center text-[15px] text-text-primary gap-2">
                              <Building2 size={16} strokeWidth={1.5} className="text-foreground/80" />
                              {client.company}
                            </div>
                          )}
                        </div>
                        <div className={`text-[12px] font-medium px-3 py-1 rounded-full border bg-white/80 backdrop-blur-sm ${client.status === 'active' ? 'border-green-200 text-green-700' : 'border-gray-200 text-gray-600'}`}>
                          {client.status === 'active' ? 'Ativo' : 'Inativo'}
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-3">
                        {client.email && (
                          <div className="flex items-center gap-3 text-[15px] text-text-primary">
                             <Mail size={16} strokeWidth={1.5} className="text-foreground/80" />
                             {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-3 text-[15px] text-text-primary">
                             <Phone size={16} strokeWidth={1.5} className="text-foreground/80" />
                             {client.phone}
                          </div>
                        )}
                      </div>
                      {client.notes && (
                        <div className="mt-4 text-sm bg-background/80 backdrop-blur-sm p-3 rounded-md line-clamp-2">
                           {client.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>

                <div className="absolute top-6 right-[90px] sm:top-8 sm:right-[100px] z-10 flex">
                  <ClientCardActions client={client} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
