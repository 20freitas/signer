'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Users, FolderKanban, Calendar, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const routes = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/projetos', label: 'Projetos', icon: FolderKanban },
  { href: '/dashboard/calendario', label: 'Calendário', icon: Calendar },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const stored = localStorage.getItem('signer:sidebar:collapsed')
    if (stored) setIsCollapsed(JSON.parse(stored))
    
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile({ ...data, email: user.email })
      }
    }
    loadUser()
  }, [supabase])

  const toggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('signer:sidebar:collapsed', JSON.stringify(newState))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside 
      className={`relative flex flex-col m-3 bg-sidebar text-white transition-all duration-300 rounded-sidebar shadow-sidebar-float z-20 ${isCollapsed ? 'w-16' : 'w-[240px]'}`}
    >
      <div className="flex items-center justify-between p-4 mb-2">
        {!isCollapsed && <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2 truncate">
          <div className="w-8 h-8 rounded-md bg-accent shrink-0 flex items-center justify-center text-sm">S</div>
          Signer
        </div>}
        {isCollapsed && <div className="w-8 h-8 mx-auto rounded-md bg-accent flex items-center justify-center text-sm font-bold">S</div>}
        
        <button 
          onClick={toggle}
          className={`absolute -right-3 top-6 bg-white border border-border text-text-primary rounded-full p-1 shadow-sm hover:bg-surface`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-hidden">
        {routes.map((route) => {
          const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)
          return (
            <Link 
              key={route.href} 
              href={route.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive ? 'bg-primary text-white' : 'hover:bg-white/10 text-white/70 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0 w-10 mx-auto' : ''}`}
              title={isCollapsed ? route.label : undefined}
            >
              <route.icon size={18} className="shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{route.label}</span>}
            </Link>
          )
        })}

        <div className="my-4 h-px bg-white/10 mx-3" />

        <Link 
          href="/dashboard/definicoes"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
            pathname.includes('/definicoes') ? 'bg-primary text-white' : 'hover:bg-white/10 text-white/70 hover:text-white'
          } ${isCollapsed ? 'justify-center px-0 w-10 mx-auto' : ''}`}
          title={isCollapsed ? 'Definições' : undefined}
        >
          <Settings size={18} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Definições</span>}
        </Link>
      </nav>

      <div className={`p-3 mt-auto border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/20 shrink-0 select-none">
            <AvatarImage src={profile?.logo_url || ''} />
            <AvatarFallback className="bg-white/10 text-white">
              {profile?.studio_name?.charAt(0) || profile?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden max-w-[140px]">
              <span className="text-sm font-medium truncate">{profile?.studio_name || profile?.full_name || 'Usuário'}</span>
              <span className="text-xs text-white/50 truncate">{profile?.email}</span>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={handleLogout}
            className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50 bg-white/5 hover:bg-white/10 hover:text-white rounded-md py-2 w-full transition-colors"
          >
            <LogOut size={14} />
            Terminar Sessão
          </button>
        )}
      </div>
    </aside>
  )
}
