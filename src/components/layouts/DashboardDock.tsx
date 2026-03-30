"use client"
import { Dock } from "@/components/ui/dock-two"
import { LayoutDashboard, Users, FolderKanban, Calendar, Settings, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function DashboardDock() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const items = [
    { icon: LayoutDashboard, label: "Overview", href: '/dashboard' },
    { icon: Users, label: "Clientes", href: '/clientes' },
    { icon: FolderKanban, label: "Projetos", href: '/projetos' },
    { icon: Calendar, label: "Calendário", href: '/calendario' },
    { icon: Settings, label: "Definições", href: '/definicoes' },
    { icon: LogOut, label: "Sair", onClick: handleLogout }
  ]

  // Add active state styles later if needed, but Dock usually shines as a simple action bar

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <Dock items={items} className="mt-0 h-auto" />
    </div>
  )
}
