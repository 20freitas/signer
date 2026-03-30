'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2, Target, Calendar as CalendarIcon, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DeliverableFormDialog({ 
  projectId, 
  deliverable, 
  customTrigger 
}: { 
  projectId: string, 
  deliverable?: any, 
  customTrigger?: React.ReactNode 
}) {
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

      const dueDate = formData.get('due_date') 
        ? new Date(formData.get('due_date') as string).toISOString() 
        : new Date().toISOString() // fallback but shouldn't happen since it's required

      if (deliverable) {
        const { error } = await supabase.from('project_deliverables').update({
          title: formData.get('title'),
          description: formData.get('description'),
          due_date: dueDate,
        }).eq('id', deliverable.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('project_deliverables').insert({
          user_id: user.id,
          project_id: projectId,
          title: formData.get('title'),
          description: formData.get('description'),
          due_date: dueDate,
          status: 'pending' // new deliverables are always pending
        })
        if (error) throw error
      }

      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao guardar entrega/milestone.')
    } finally {
      setLoading(false)
    }
  }

  // Format date for native date input (YYYY-MM-DD)
  const defaultDate = deliverable?.due_date 
    ? new Date(deliverable.due_date).toISOString().split('T')[0] 
    : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTrigger ? customTrigger : (
          <Button className="bg-primary text-white hover:bg-primary-light h-10 px-4 gap-2 shadow-sm">
            <Plus size={16} />
            Nova Entrega
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="bg-gradient-to-b from-primary/5 to-transparent px-6 pt-6 pb-5 border-b border-border/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="text-primary w-5 h-5" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {deliverable ? 'Editar Entrega' : 'Nova Entrega / Milestone'}
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-text-secondary">
            {deliverable 
              ? 'Atualiza os dados referentes a esta entrega do projeto.' 
              : 'Define um novo objetivo, publicação ou etapa a ser concluída neste projeto.'}
          </DialogDescription>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                Título da Entrega *
              </Label>
              <Input 
                id="title" name="title" required 
                defaultValue={deliverable?.title}
                placeholder="Ex: Entrega do Plano de Marketing" 
                className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                Data Límite (Entrega) *
              </Label>
              <div className="relative">
                <Input 
                  id="due_date" name="due_date" type="date" required 
                  defaultValue={defaultDate}
                  className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors w-full select-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                Descrição e Detalhes (Opcional)
              </Label>
              <Textarea 
                id="description" name="description" 
                defaultValue={deliverable?.description}
                placeholder="Detalhes adicionais sobre o que é esperado..." 
                className="resize-none min-h-[100px] bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 pb-1">
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-10">Cancelar</Button>
              <Button type="submit" disabled={loading} className="bg-primary text-white hover:bg-primary-light h-10 px-6 shadow-md hover:shadow-lg transition-all">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deliverable ? 'Guardar Alterações' : 'Criar Entrega'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
