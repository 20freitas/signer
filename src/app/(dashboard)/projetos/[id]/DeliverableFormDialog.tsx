'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2, Target, Calendar as CalendarIcon, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function DeliverableFormDialog({ 
  projectId, 
  deliverable, 
  customTrigger,
  onSuccess
}: { 
  projectId: string, 
  deliverable?: any, 
  customTrigger?: React.ReactNode,
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(deliverable?.status || 'pending')
  
  // File association state
  const [projectFiles, setProjectFiles] = useState<any[]>([])
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])

  const router = useRouter()
  const supabase = createClient()

  // Load project files when dialog opens
  useEffect(() => {
    if (open) {
      supabase.from('files').select('id, name, deliverable_id, size').eq('project_id', projectId)
        .then(({ data }) => {
          if (data) {
            setProjectFiles(data)
            if (deliverable) {
              const assigned = data.filter(f => f.deliverable_id === deliverable.id).map(f => f.id)
              setSelectedFileIds(assigned)
            } else {
              setSelectedFileIds([])
            }
          }
        })
    }
  }, [open, projectId, deliverable, supabase])

  const toggleFile = (fileId: string) => {
    setSelectedFileIds(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sem sessão")

      const dueDate = formData.get('due_date') 
        ? new Date(formData.get('due_date') as string).toISOString() 
        : new Date().toISOString() // fallback

      let currentDeliverableId = deliverable?.id;

      if (deliverable) {
        const { error } = await supabase.from('project_deliverables').update({
          title: formData.get('title'),
          description: formData.get('description'),
          due_date: dueDate,
          status: status
        }).eq('id', deliverable.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('project_deliverables').insert({
          user_id: user.id,
          project_id: projectId,
          title: formData.get('title'),
          description: formData.get('description'),
          due_date: dueDate,
          status: 'pending' // new deliverables are always pending initially
        }).select().single()
        if (error) throw error
        currentDeliverableId = data.id
      }

      // Handle File Associations
      if (projectFiles.length > 0 && currentDeliverableId) {
        const initiallyAssigned = projectFiles.filter(f => f.deliverable_id === currentDeliverableId).map(f => f.id)
        const toRemove = initiallyAssigned.filter(id => !selectedFileIds.includes(id))
        const toAdd = selectedFileIds.filter(id => !initiallyAssigned.includes(id))

        if (toRemove.length > 0) {
          await supabase.from('files').update({ deliverable_id: null }).in('id', toRemove)
        }
        if (toAdd.length > 0) {
          await supabase.from('files').update({ deliverable_id: currentDeliverableId }).in('id', toAdd)
        }
      }

      setOpen(false)
      if (onSuccess) onSuccess()
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao guardar entrega ou ficheiros associados.')
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

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
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

            {deliverable && (
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  Estado da Entrega
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-10 bg-background/50 border-border/60 hover:border-border focus:bg-background transition-colors">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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

            {projectFiles.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} /> Associar Ficheiros do Projeto
                </Label>
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 p-2 bg-background/50 border border-border/60 rounded-md styled-scrollbar pt-2 px-3 pb-3">
                  {projectFiles.map((file, idx) => {
                    const isSelected = selectedFileIds.includes(file.id)
                    const isAssignedElsewhere = file.deliverable_id && file.deliverable_id !== deliverable?.id
                    
                    return (
                      <label key={file.id} className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-surface border-transparent hover:bg-surface-hover'}`}>
                        <input 
                          type="checkbox" 
                          className="mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded border border-border/60 text-primary focus:ring-primary/20 cursor-pointer shadow-sm relative z-0 transition-opacity"
                          checked={isSelected}
                          onChange={() => toggleFile(file.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-medium leading-tight truncate ${isSelected ? 'text-primary' : 'text-text-primary/90'}`}>{file.name}</p>
                          {isAssignedElsewhere && !isSelected && (
                            <p className="text-[10px] text-yellow-600/80 mt-1 font-medium bg-yellow-50 inline-flex px-1.5 py-0.5 rounded border border-yellow-100">
                              ⚠️ Já associado a outra meta
                            </p>
                          )}
                          {!isAssignedElsewhere && !isSelected && (
                            <p className="text-[10px] text-text-secondary/60 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 pb-1 bg-background border-t border-border/40 -mx-6 px-6 -mb-5 sticky bottom-0 z-10 py-4">
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
