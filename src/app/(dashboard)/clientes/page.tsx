import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Phone, Mail } from 'lucide-react'
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
                <Link href={`/clientes/${client.id}`} className="block h-full">
                  <Card className="h-full border-0 shadow-card-subtle bg-surface hover:shadow-md transition-shadow relative z-0">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="pr-16">
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">{client.name}</h3>
                          {client.company && (
                            <div className="flex items-center text-sm text-text-secondary mt-1 gap-1.5">
                              <Building2 size={14} />
                              {client.company}
                            </div>
                          )}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {client.status === 'active' ? 'Ativo' : 'Inativo'}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-text-secondary">
                        {client.email && (
                          <div className="flex items-center gap-2">
                             <Mail size={14} />
                             {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-2">
                             <Phone size={14} />
                             {client.phone}
                          </div>
                        )}
                      </div>
                      {client.notes && (
                        <div className="mt-4 text-sm bg-background p-3 rounded-md line-clamp-2">
                           {client.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>

                <div className="absolute top-4 right-20 z-10 flex">
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
