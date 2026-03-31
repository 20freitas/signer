"use client"
import { Dock } from "@/components/ui/dock-two"
import { LayoutDashboard, Users, FolderKanban, Calendar, Settings, LogOut, Palette } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
}

export function DashboardDock({ userEmail }: { userEmail?: string }) {
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
    { icon: Palette, label: "Branding", href: '/branding' },
    { icon: Calendar, label: "Calendário", href: '/calendario' },
    { icon: Settings, label: "Definições", href: '/definicoes' },
  ]

  return (
    <>
      <div className="fixed top-8 left-8 z-50 flex h-[60px] items-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center justify-center px-4 p-2 rounded-2xl",
            "backdrop-blur-lg border shadow-lg",
            "bg-background/90 border-border",
            "hover:shadow-xl transition-shadow duration-300"
          )}
        >
          <Image src="/SIGNER.png" alt="Signer Logo" width={130} height={44} priority className="w-auto h-[44px]" />
        </motion.div>
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <Dock items={items} className="mt-0 h-auto" />
      </div>

      <div className="fixed top-8 right-8 z-50 flex h-[60px] items-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center gap-3 p-2 rounded-2xl",
            "backdrop-blur-lg border shadow-lg",
            "bg-background/90 border-border",
            "hover:shadow-xl transition-shadow duration-300"
          )}
        >
          {userEmail && (
            <span className="text-sm font-medium text-foreground px-3">
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="p-3 rounded-lg hover:bg-primary/10 transition-colors group flex items-center justify-center relative cursor-pointer"
            title="Sair"
          >
            <LogOut className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            <span className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2",
              "px-2 py-1 rounded text-xs",
              "bg-popover text-popover-foreground",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity whitespace-nowrap pointer-events-none"
            )}>
              Sair
            </span>
          </button>
        </motion.div>
      </div>
    </>
  )
}

