'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Circle, Clock, Loader2, Pencil, Trash2, Calendar, Target, Paperclip } from 'lucide-react'
import { DeliverableFormDialog } from './DeliverableFormDialog'
import { Button } from '@/components/ui/button'
import { format, isBefore, startOfDay } from 'date-fns'
import { pt } from 'date-fns/locale'

export function ProjectDeliverables({ projectId, userId }: { projectId: string, userId: string }) {
  const [deliverables, setDeliverables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchDeliverables()
    
    // Subscribe to realtime changes for both deliverables and files
    const channel = supabase
      .channel(`project_deliverables_${projectId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'project_deliverables',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchDeliverables()
      })
      .on('postgres_changes', {
        event: '*', 
        schema: 'public', 
        table: 'files',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchDeliverables()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  async function fetchDeliverables() {
    // Fetch deliverables and their linked files in one query
    const { data, error } = await supabase
      .from('project_deliverables')
      .select('*, files(id, name, file_url)')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true, nullsFirst: false })

    if (error) {
       console.error("Error fetching deliverables:", error)
    }

    if (!error && data) {
      // Client-side sort to ensure correct order
      const sorted = [...data].sort((a, b) => {
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })
      setDeliverables(sorted)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem a certeza que deseja eliminar esta entrega?')) return
    
    setDeletingId(id)
    await supabase.from('project_deliverables').delete().eq('id', id)
    setDeletingId(null)
  }

  async function handleToggleStatus(deliverable: any) {
    setTogglingId(deliverable.id)
    try {
      const newStatus = deliverable.status === 'completed' ? 'pending' : 'completed'
      const { error } = await supabase
        .from('project_deliverables')
        .update({ status: newStatus })
        .eq('id', deliverable.id)
      
      if (error) throw error
      await fetchDeliverables() // Ensure UI updates even if Realtime is off
    } catch (err: any) {
      console.error(err)
      alert("Erro ao alterar estado: " + err.message)
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
      </div>
    )
  }

  const today = startOfDay(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border/50 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="text-primary w-5 h-5" />
            Metas e Entregas
          </h2>
          <p className="text-sm text-text-secondary mt-1">Organize o plano do projeto com objetivos e as suas datas limites.</p>
        </div>
        <DeliverableFormDialog projectId={projectId} onSuccess={fetchDeliverables} />
      </div>

      {deliverables.length === 0 ? (
        <div className="text-center py-16 bg-surface/50 rounded-xl border border-dashed border-border/60">
          <Target size={48} className="mx-auto text-text-secondary opacity-20 mb-4" />
          <h3 className="text-text-primary font-medium text-lg">Sem plano definido</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
            Ainda não criou nenhuma meta ou entrega para este projeto. Utilize o botão acima para começar a adicionar milestones.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-border/60 ml-3 md:ml-6 space-y-8 py-4">
          {deliverables.map((deliverable) => {
            const dueDate = new Date(deliverable.due_date)
            const isLate = deliverable.status !== 'completed' && deliverable.due_date && isBefore(startOfDay(dueDate), today)
            const isCompleted = deliverable.status === 'completed'

            return (
              <div key={deliverable.id} className="relative pl-6 md:pl-8 group">
                {/* Timeline Node - fixed positioning and z-index to be clickable */}
                <button 
                  onClick={() => handleToggleStatus(deliverable)}
                  disabled={togglingId === deliverable.id}
                  className="absolute -left-[13px] top-6 bg-background rounded-full transition-transform hover:scale-110 focus:outline-none z-10 cursor-pointer shadow-sm border border-transparent hover:border-border"
                  title={isCompleted ? "Marcar como pendente" : "Marcar como concluído"}
                >
                  {togglingId === deliverable.id ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                  ) : isLate ? (
                    <Clock className="w-6 h-6 text-red-500 fill-red-50" />
                  ) : (
                    <Circle className="w-6 h-6 text-border fill-background" />
                  )}
                </button>

                {/* Content Card */}
                <div className={`p-4 md:p-5 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                  isCompleted ? 'bg-background/80 border-border/40 opacity-70 hover:opacity-100' :
                  isLate ? 'bg-red-50/30 border-red-200/50' : 
                  'bg-surface border-border/60'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h4 className={`font-semibold text-lg truncate ${isCompleted ? 'text-text-secondary/80' : 'text-text-primary'}`}>
                          {deliverable.title}
                        </h4>
                        
                        {/* Estado Visível Explicito Solicitado */}
                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                          {isCompleted ? (
                            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                              Concluído
                            </span>
                          ) : isLate ? (
                            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                              Atrasado
                            </span>
                          ) : (
                            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                              Pendente
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {deliverable.description && (
                         <p className={`text-sm mt-2 whitespace-pre-wrap ${isCompleted ? 'text-text-secondary/70' : 'text-text-secondary'}`}>
                           {deliverable.description}
                         </p>
                      )}

                      <div className="flex items-center gap-2 mt-4 text-[13px] font-medium text-text-secondary">
                        <Calendar className={`w-4 h-4 ${isLate ? 'text-red-500' : ''}`} />
                        <span className={isLate ? 'text-red-600' : ''}>
                          {deliverable.due_date ? format(dueDate, "d 'de' MMMM, yyyy", { locale: pt }) : 'Data Indefinida'}
                        </span>
                      </div>

                      {/* Attached Files List */}
                      {deliverable.files && deliverable.files.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Ficheiros Associados</p>
                          <div className="flex flex-wrap gap-2">
                            {deliverable.files.map((file: any) => (
                              <a 
                                key={file.id} 
                                href={`${file.file_url}?download=${encodeURIComponent(file.name)}`} 
                                download={file.name}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border/60 rounded-md text-sm hover:bg-primary/5 hover:text-primary transition-colors hover:border-primary/30"
                              >
                                <Paperclip size={14} className="opacity-70" />
                                <span className="truncate max-w-[200px]">{file.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <DeliverableFormDialog 
                        projectId={projectId} 
                        deliverable={deliverable}
                        onSuccess={fetchDeliverables}
                        customTrigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-primary hover:bg-primary/10">
                            <Pencil size={14} />
                          </Button>
                        }
                      />
                      <Button 
                        variant="ghost" size="icon" 
                        onClick={() => handleDelete(deliverable.id)}
                        disabled={deletingId === deliverable.id}
                        className="h-8 w-8 text-text-secondary hover:text-red-600 hover:bg-red-50"
                      >
                        {deletingId === deliverable.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
