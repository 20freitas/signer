'use client'

import { useState } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek,
  isToday
} from 'date-fns'
import { pt } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Milestone {
  id: string
  title: string
  status: string
  due_date: string
  project: {
    id: string
    name: string
    slug: string
  }
}

export function CalendarGrid({ milestones, agencySlug }: { milestones: Milestone[], agencySlug: string }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  return (
    <div className="bg-white border border-border/60 rounded-[32px] shadow-sm overflow-hidden p-8">
      {/* Calendar Header with Controls */}
      <div className="flex items-center justify-between mb-8">
         <div className="flex flex-col">
            <h2 className="text-2xl font-black text-text-primary capitalize px-1">
               {format(currentDate, 'MMMM yyyy', { locale: pt })}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-primary" />
               <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{milestones.length} Metas Registadas</span>
            </div>
         </div>
         
         <div className="flex items-center gap-3 bg-surface p-1.5 rounded-2xl border border-border/40">
           <button 
             onClick={prevMonth}
             className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all"
           >
             <ChevronLeft size={18} />
           </button>
           <button 
             onClick={() => setCurrentDate(new Date())}
             className="px-4 py-1 text-[11px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors min-w-[80px]"
           >
             {format(currentDate, 'MMMM', { locale: pt })}
           </button>
           <button 
             onClick={nextMonth}
             className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all"
           >
             <ChevronRight size={18} />
           </button>
         </div>
      </div>

      {/* Week Days Label */}
      <div className="grid grid-cols-7 mb-4">
         {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
           <div key={day} className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-text-secondary opacity-40">
             {day}
           </div>
         ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-black/[0.03] rounded-3xl border border-black/[0.03] overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
        {calendarDays.map((day, i) => {
          const dayMilestones = milestones.filter(m => isSameDay(new Date(m.due_date), day))
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isTodayDay = isToday(day)

          return (
            <div 
              key={day.toISOString()} 
              onClick={() => {
                if (dayMilestones.length > 0) {
                  setSelectedDay(day)
                  setIsDetailOpen(true)
                }
              }}
              className={`min-h-[160px] p-4 transition-all relative flex flex-col gap-2 ${
                isCurrentMonth ? 'bg-white' : 'bg-surface/40'
              } ${dayMilestones.length > 0 ? 'cursor-pointer hover:bg-primary/[0.02]' : ''}`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-2 h-8">
                 <span className={`text-sm font-black transition-colors ${
                   isTodayDay 
                     ? 'w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30' 
                     : isCurrentMonth ? 'text-[#0f172a]' : 'text-text-secondary/30'
                 }`}>
                   {format(day, 'd')}
                 </span>
              </div>

              {/* Day Events */}
              <div className="flex flex-col gap-1.5 flex-1 overflow-hidden pr-1 relative z-10">
                {dayMilestones.slice(0, 1).map(m => {
                  const isCompleted = m.status === 'completed'
                  const isLate = !isCompleted && new Date(m.due_date) < new Date()

                  return (
                    <div 
                      key={m.id} 
                      className={`p-2.5 rounded-xl border-l-[3px] border-y border-r transition-all text-left shadow-sm ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200 border-l-green-500 text-green-800' 
                          : isLate 
                            ? 'bg-red-50 border-red-200 border-l-red-500 text-red-800' 
                            : 'bg-primary/5 border-primary/20 border-l-primary text-primary-dark font-medium'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                         <div className="flex items-center gap-1.5">
                            {isCompleted ? <CheckCircle2 size={10} className="text-green-600" /> : isLate ? <AlertCircle size={10} className="text-red-600" /> : <Clock size={10} className="text-primary" />}
                            <span className="text-[10px] font-black uppercase tracking-tight truncate leading-none">{m.title}</span>
                         </div>
                         <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest truncate mt-0.5">
                           {m.project.name}
                         </p>
                      </div>
                    </div>
                  )
                })}

                {dayMilestones.length > 1 && (
                  <div className="p-2.5 rounded-xl border border-black/10 bg-surface shadow-sm flex items-center justify-between group-hover:border-primary/40 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                      + {dayMilestones.length - 1} Meta{dayMilestones.length - 1 > 1 ? 's' : ''}
                    </span>
                    <ArrowRight size={10} className="text-primary opacity-40 group-hover:opacity-100 transition-all" />
                  </div>
                )}
              </div>

              {/* Visual Decoration for non-current month */}
              {!isCurrentMonth && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[0.5px] pointer-events-none" />
              )}
            </div>
          )
        })}
      </div>

      {/* Daily Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-border/50 shadow-2xl">
           {selectedDay && (
             <>
               <div className="bg-gradient-to-b from-primary/5 to-transparent px-6 pt-8 pb-6 border-b border-border/40">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-[20px] bg-white border border-black/[0.04] shadow-sm flex items-center justify-center">
                        <CalendarIcon className="text-primary w-6 h-6" />
                     </div>
                     <div>
                        <DialogTitle className="text-xl font-black text-text-primary capitalize">
                          {format(selectedDay, "dd 'de' MMMM", { locale: pt })}
                        </DialogTitle>
                        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] opacity-40">
                           {format(selectedDay, "EEEE", { locale: pt })}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="px-6 py-6 space-y-4 max-h-[60vh] overflow-y-auto styled-scrollbar">
                  {milestones
                    .filter(m => isSameDay(new Date(m.due_date), selectedDay))
                    .map(m => {
                      const isCompleted = m.status === 'completed'
                      const isLate = !isCompleted && new Date(m.due_date) < new Date()
                      const projectUrl = `/projetos/${m.project.id}`

                      return (
                        <Link 
                          key={m.id} 
                          href={projectUrl}
                          className="block group"
                        >
                          <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                            isCompleted 
                              ? 'bg-green-50/50 border-green-100 text-green-700/70' 
                              : isLate 
                                ? 'bg-red-50 border-red-100 text-red-700' 
                                : 'bg-white border-black/[0.05] hover:border-primary/20 hover:shadow-md hover:shadow-primary/5'
                          }`}>
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                 isCompleted ? 'bg-green-100' : isLate ? 'bg-red-100' : 'bg-primary/5'
                               }`}>
                                  {isCompleted ? <CheckCircle2 size={18} /> : isLate ? <AlertCircle size={18} /> : <Clock size={18} className="text-primary" />}
                               </div>
                               <div>
                                  <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                                    {m.title}
                                  </h4>
                                  <p className="text-[11px] font-medium text-text-secondary opacity-60">
                                    {m.project.name}
                                  </p>
                               </div>
                            </div>
                            <ArrowRight size={16} className="text-text-secondary opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all translate-x-1 group-hover:translate-x-0" />
                          </div>
                        </Link>
                      )
                    })}
               </div>

               <div className="p-6 bg-surface border-t border-border/40 text-center">
                  <p className="text-[10px] font-black text-text-secondary opacity-30 uppercase tracking-[0.2em]">
                     Signer Agenda Inteligente
                  </p>
               </div>
             </>
           )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
