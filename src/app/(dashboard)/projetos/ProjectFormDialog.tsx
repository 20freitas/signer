'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ProjectFormDialog({ clients, triggerVariant = 'default' }: { clients: any[], triggerVariant?: 'default' | 'outline' }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  const [selectedClient, setSelectedClient] = useState<string>("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (!selectedClient) throw new Error("Selecione um cliente.")
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sem sessão")

      const { data: project, error } = await supabase.from('projects').insert({
        user_id: user.id,
        client_id: selectedClient,
        name: formData.get('name'),
        description: formData.get('description'),
        due_date: formData.get('due_date') || null,
        status: 'in_progress'
      }).select().single()

      if (error) throw error

      setOpen(false)
      router.push(`/dashboard/projetos/${project.id}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erro ao criar projeto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
           variant={triggerVariant as any} 
           disabled={clients.length === 0}
           className={triggerVariant === 'default' ? "bg-primary text-white hover:bg-primary-light h-10 px-6 gap-2" : "mt-6 gap-2"}
        >
          <Plus size={16} />
          {triggerVariant === 'default' ? 'Novo Projeto' : 'Criar Projeto'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>
            Crie um novo projeto associado a um cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input id="name" name="name" required placeholder="Ex: Website Redesign" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Cliente *</Label>
            <Select onValueChange={setSelectedClient} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente associado" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Data de Entrega</Label>
            <Input id="due_date" name="due_date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição Mínima</Label>
            <Textarea id="description" name="description" placeholder="Resumo dos objetivos..." />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || !selectedClient} className="bg-primary text-white hover:bg-primary-light">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
