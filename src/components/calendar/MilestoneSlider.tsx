'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ExternalLink, Calendar, Target, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Milestone {
  id: string
  title: string
  status: string
  due_date: string
  isProjectDeadline?: boolean
  project: {
    id: string
    name: string
    slug: string
  }
}

export function MilestoneSlider({ milestones, agencySlug }: { milestones: Milestone[], agencySlug: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollX, setScrollX] = useState(0)
  
  const cardWidth = 300
  const gap = 16
  const visibleCards = 4
  const step = cardWidth + gap
  const maxScroll = Math.max(0, (milestones.length - visibleCards) * step)

  const handleScroll = (direction: 'left' | 'right') => {
    setScrollX(prev => {
      let next = direction === 'left' ? prev + step : prev - step
      if (next > 0) next = 0
      if (next < -maxScroll) next = -maxScroll
      return next
    })
  }

  return (
    <div className="relative group/slider max-w-[1248px] mx-auto">
      {/* Navigation Arrows */}
      {milestones.length > visibleCards && (
        <>
          {scrollX < 0 && (
            <button 
              onClick={() => handleScroll('left')}
              className="absolute -left-14 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl border border-black/[0.03] flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-text-primary"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {scrollX > -maxScroll && (
            <button 
              onClick={() => handleScroll('right')}
              className="absolute -right-14 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl border border-black/[0.03] flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-text-primary"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </>
      )}

      {/* Viewport */}
      <div className="overflow-hidden py-2 px-0.5">
        <motion.div 
          ref={containerRef}
          animate={{ x: scrollX }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex gap-4"
          style={{ width: 'max-content' }}
        >
        {milestones.map((m) => {
          const isLate = new Date(m.due_date) < new Date() && m.status !== 'completed'
          const projectUrl = `/projetos/${m.project.id}`
          const isProject = m.isProjectDeadline

          return (
            <Link key={m.id} href={projectUrl} className="flex-shrink-0">
              <motion.div 
                whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.01)' }}
                className={`w-[300px] h-[160px] bg-white rounded-3xl p-5 border shadow-sm transition-shadow flex flex-col justify-between group ${
                  isProject ? 'border-primary/20' : 'border-black/[0.04]'
                }`}
              >
                {/* Top Label */}
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isProject ? 'bg-primary/10 text-primary' : 'bg-black/[0.03] text-text-secondary'
                      }`}>
                         {isProject ? <Briefcase size={14} /> : <Target size={14} />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                        isLate ? 'text-red-500' : 'text-text-secondary opacity-40'
                      }`}>
                        {format(new Date(m.due_date), "EEEE", { locale: pt })}
                      </span>
                   </div>
                   <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                     isLate ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-primary/5 text-primary border border-primary/10'
                   }`}>
                      {format(new Date(m.due_date), "dd MMM", { locale: pt })}
                   </div>
                </div>

                {/* Content */}
                <div className="mt-2">
                   <h3 className="text-[15px] font-bold text-text-primary leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {m.title}
                   </h3>
                   <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[11px] font-medium text-text-secondary truncate">
                        {m.project.name}
                      </span>
                   </div>
                </div>

                {/* Bottom Stats */}
                <div className="flex justify-between items-center pt-3 border-t border-black/[0.03]">
                   <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isLate ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary opacity-60">
                         {isLate ? 'Urgente' : 'Programado'}
                      </span>
                   </div>
                   <div className="w-7 h-7 rounded-lg bg-black/[0.02] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                   </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
        </motion.div>
      </div>
    </div>
  )
}
