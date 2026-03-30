'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ClientFormDialog({ triggerVariant = 'default', customTrigger, client }: { triggerVariant?: 'default' | 'outline', customTrigger?: React.ReactNode, client?: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sem sessão")

      if (client) {
        const { error } = await supabase.from('clients').update({
          name: formData.get('name'),
          company: formData.get('company'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          notes: formData.get('notes'),
          status: formData.get('status') || 'active'
        }).eq('id', client.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('clients').insert({
          user_id: user.id,
          name: formData.get('name'),
          company: formData.get('company'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          notes: formData.get('notes'),
          status: formData.get('status') || 'active'
        })
        if (error) throw error
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao criar cliente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTrigger ? customTrigger : (
          <Button variant={triggerVariant as any} className={triggerVariant === 'default' ? "bg-primary text-white hover:bg-primary-light h-10 px-6 gap-2" : "mt-6 gap-2"}>
            <Plus size={16} />
            {triggerVariant === 'default' ? 'Novo Cliente' : 'Adicionar Cliente'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="bg-gradient-to-b from-primary/5 to-transparent px-6 pt-6 pb-5 border-b border-border/40">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UserPlus className="text-primary w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight">{client ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          <DialogDescription className="mt-1.5 text-text-secondary">
            {client ? 'Atualize os dados e contactos do cliente.' : 'Adicione os dados principais e os contactos do seu cliente para começar a faturar e a associar projetos.'}
          </DialogDescription>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Nome / Responsável *</Label>
              <Input 
                id="name" name="name" required 
                defaultValue={client?.name}
                placeholder="Ex: João Silva" 
                className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Empresa (opcional)</Label>
                <Input 
                  id="company" name="company" 
                  defaultValue={client?.company}
                  placeholder="Ex: Studio Neo Lda" 
                  className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Estado do Cliente</Label>
                <select 
                  id="status" name="status" 
                  defaultValue={client?.status || 'active'}
                  className="flex h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring hover:border-border transition-colors text-text-primary"
                >
                  <option value="active">Ativo (Em curso)</option>
                  <option value="inactive">Inativo (Pausado/Terminado)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border/40" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">E-mail (opcional)</Label>
              <Input 
                id="email" name="email" type="email" 
                defaultValue={client?.email}
                placeholder="joao@exemplo.com" 
                className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Telefone (opcional)</Label>
              <Input 
                id="phone" name="phone" 
                defaultValue={client?.phone}
                placeholder="+351 900 000 000" 
                className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Notas Internas</Label>
            <Textarea 
              id="notes" name="notes" 
              defaultValue={client?.notes}
              placeholder="Detalhes ou preferências do cliente..." 
              className="resize-none min-h-[80px] bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
            />
          </div>

          <div className="pt-2 pb-1">
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-10">Cancelar</Button>
              <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-primary-light h-10 px-6 shadow-md hover:shadow-lg transition-all">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {client ? 'Guardar Alterações' : 'Adicionar Cliente'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
