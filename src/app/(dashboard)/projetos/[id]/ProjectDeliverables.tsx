'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Circle, Clock, Loader2, Pencil, Trash2, Calendar, Target } from 'lucide-react'
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
    
    // Subscribe to realtime changes
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
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  async function fetchDeliverables() {
    const { data, error } = await supabase
      .from('project_deliverables')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date', { ascending: true })

    if (!error && data) {
      setDeliverables(data)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem a certeza que deseja eliminar esta entrega?')) return
    
    setDeletingId(id)
    await supabase.from('project_deliverables').delete().eq('id', id)
    setDeletingId(null)
    // Realtime covers the UI update!
  }

  async function handleToggleStatus(deliverable: any) {
    setTogglingId(deliverable.id)
    const newStatus = deliverable.status === 'completed' ? 'pending' : 'completed'
    
    await supabase
      .from('project_deliverables')
      .update({ status: newStatus })
      .eq('id', deliverable.id)
      
    setTogglingId(null)
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
        <DeliverableFormDialog projectId={projectId} />
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
          {deliverables.map((deliverable, index) => {
            const dueDate = new Date(deliverable.due_date)
            const isLate = deliverable.status !== 'completed' && isBefore(startOfDay(dueDate), today)
            const isCompleted = deliverable.status === 'completed'

            return (
              <div key={deliverable.id} className="relative pl-6 md:pl-8 group">
                {/* Timeline Node */}
                <button 
                  onClick={() => handleToggleStatus(deliverable)}
                  disabled={togglingId === deliverable.id}
                  className="absolute -left-[13px] top-1.5 bg-background rounded-full transition-transform hover:scale-110 focus:outline-none"
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
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-semibold text-lg truncate ${isCompleted ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                          {deliverable.title}
                        </h4>
                        {isLate && (
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            Atrasado
                          </span>
                        )}
                      </div>
                      
                      {deliverable.description && (
                         <p className={`text-sm mt-2 whitespace-pre-wrap ${isCompleted ? 'text-text-secondary/70' : 'text-text-secondary'}`}>
                           {deliverable.description}
                         </p>
                      )}

                      <div className="flex items-center gap-2 mt-4 text-[13px] font-medium text-text-secondary">
                        <Calendar className={`w-4 h-4 ${isLate ? 'text-red-500' : ''}`} />
                        <span className={isLate ? 'text-red-600' : ''}>
                          {format(dueDate, "d 'de' MMMM, yyyy", { locale: pt })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <DeliverableFormDialog 
                        projectId={projectId} 
                        deliverable={deliverable}
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
