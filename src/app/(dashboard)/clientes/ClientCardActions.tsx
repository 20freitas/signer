'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ClientFormDialog } from './ClientFormDialog'

export function ClientCardActions({ client }: { client: any }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('Tem a certeza que deseja apagar este cliente? Esta ação não pode ser desfeita.')) return
    
    setIsDeleting(true)
    const { error } = await supabase.from('clients').delete().eq('id', client.id)
    if (error) {
      alert("Erro ao apagar cliente.")
      console.error(error)
    }
    router.refresh()
    setIsDeleting(false)
  }

  return (
    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
      <ClientFormDialog 
        client={client} 
        customTrigger={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-primary hover:bg-primary/10">
            <Pencil size={14} />
          </Button>
        } 
      />
      <Button 
        variant="ghost" size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-text-secondary hover:text-red-600 hover:bg-red-50"
      >
        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </Button>
    </div>
  )
}
