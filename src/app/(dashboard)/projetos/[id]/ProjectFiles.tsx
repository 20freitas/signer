'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { File, Upload, Trash2, Loader2, Download } from 'lucide-react'

export function ProjectFiles({ projectId, userId }: { projectId: string, userId: string }) {
  const supabase = createClient()
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchFiles() {
    setLoading(true)
    const { data } = await supabase.from('files').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
    if (data) setFiles(data)
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: publicUrl } = supabase.storage.from('project-files').getPublicUrl(filePath)
      
      await supabase.from('files').insert({
        project_id: projectId,
        name: file.name,
        file_url: publicUrl.publicUrl,
        size: file.size,
        uploaded_by: userId
      })

      fetchFiles()
    } catch (err: any) {
      alert('Erro ao fazer upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(fileId: string, url: string) {
    if (!confirm('Eliminar este ficheiro?')) return
    
    try {
      const path = url.split('/').slice(-2).join('/') 
      await supabase.storage.from('project-files').remove([path])
      await supabase.from('files').delete().eq('id', fileId)
      fetchFiles()
    } catch (err: any) {
      console.error(err)
      alert("Erro ao apagar. " + err.message)
    }
  }

  return (
    <Card className="border-0 shadow-card-subtle bg-surface">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium">Documentos do Projeto</h3>
          <div>
            <input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={uploading} />
            <label htmlFor="file-upload">
              <span className={`inline-flex h-9 items-center justify-center rounded-md bg-primary text-white px-4 text-sm font-medium shadow transition-colors hover:bg-primary-light focus-visible:outline-none cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {uploading ? 'A carregar...' : 'Fazer Upload'}
              </span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-text-secondary" /></div>
        ) : files.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-border rounded-lg bg-background">
             <File className="h-10 w-10 mb-4 opacity-50" />
             <p>Sem ficheiros partilhados.</p>
          </div>
        ) : (
          <div className="space-y-3">
             {files.map(file => (
               <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                 <div className="flex items-center gap-3 overflow-hidden">
                   <div className="p-2 bg-gradient-to-br from-accent to-accent-light rounded-md text-white shrink-0">
                     <File size={16} />
                   </div>
                   <div className="truncate">
                     <p className="text-sm font-medium truncate">{file.name}</p>
                     <p className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-surface rounded-md text-text-secondary transition-colors">
                      <Download size={16} />
                    </a>
                    <button onClick={() => handleDelete(file.id, file.file_url)} className="p-2 hover:bg-destructive/10 text-text-secondary hover:text-destructive rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
