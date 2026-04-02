'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react'

export function ProjectSettings({ projectId, projectName }: { projectId: string, projectName: string }) {
  const [loading, setLoading] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (confirmName !== projectName) {
      alert('O nome do projeto não corresponde.')
      return
    }
    
    // Final warning
    if (!confirm('Atenção: Esta ação é irreversível. Todos os ficheiros, metas e relatórios do projeto serão eliminados para sempre da base de dados. Deseja mesmo continuar?')) return

    try {
      setLoading(true)
      
      // Cleanup files from storage bucket safely (Best effort)
      const { data: filesData } = await supabase.storage.from('project-files').list(projectId)
      if (filesData && filesData.length > 0) {
         const pathsToRemove = filesData.map(f => `${projectId}/${f.name}`)
         await supabase.storage.from('project-files').remove(pathsToRemove)
      }

      // Supabase tables should ideally cascade deletes. If they don't, manually clear files/deliverables first.
      // We'll clean up DB entries explicitly to be perfectly safe inside the JS routine.
      await supabase.from('files').delete().eq('project_id', projectId)
      await supabase.from('project_deliverables').delete().eq('project_id', projectId)
      
      // Delete the main project
      const { error } = await supabase.from('projects').delete().eq('id', projectId)
      if (error) throw error

      router.push('/projetos')
      router.refresh()
    } catch (err: any) {
      alert('Erro ao eliminar o projeto: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="border-red-200 bg-red-50/30 shadow-sm transition-all hover:bg-red-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5 text-red-600 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
               <AlertTriangle size={20} className="text-red-700" />
            </div>
            <CardTitle className="text-red-700 text-xl font-semibold tracking-tight">Zona de Perigo</CardTitle>
          </div>
          <CardDescription className="text-red-800/70 pt-2 font-medium">
            Se eliminar o projeto, ele nunca mais poderá ser recuperado. 
            Isso vai limpar da cloud todas as entregas, metas, documentos associados e históricos inteiros deste cliente para este projeto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="bg-background border border-red-100 p-5 rounded-xl shadow-inner">
            <h4 className="font-semibold text-[15px] mb-2 text-text-primary">Tem a certeza que quer eliminar &quot;{projectName}&quot;?</h4>
            <p className="text-sm text-text-secondary mb-5">
              Escreva <strong>{projectName}</strong> no campo de texto para garantir que não elimina acidentalmente enquanto navega.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
               <Input 
                 type="text" 
                 value={confirmName} 
                 onChange={e => setConfirmName(e.target.value)} 
                 className="flex-1 bg-surface border-red-200/50 focus:border-red-400 focus:ring-red-400/20 placeholder:text-text-secondary/50"
                 placeholder={`Escreva ${projectName} para confirmar`}
                 disabled={loading}
               />
               <Button 
                 variant="destructive" 
                 disabled={loading || confirmName !== projectName}
                 onClick={handleDelete}
                 className="shrink-0 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto font-medium transition-all focus:ring-red-500"
               >
                 {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                 {loading ? 'A Destruir Projeto...' : 'Apagar Permanentemente'}
               </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
