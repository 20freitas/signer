'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { File, Upload, Trash2, Loader2, Download, Pencil, Search, SlidersHorizontal, Tag, FileText, Image as ImageIcon, Video, Music, Package } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ProjectFiles({ projectId, userId }: { projectId: string, userId: string }) {
  const supabase = createClient()
  const [files, setFiles] = useState<any[]>([])
  const [deliverables, setDeliverables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customName, setCustomName] = useState('')
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string>('none')
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  // Edit state
  const [editingFile, setEditingFile] = useState<any>(null)
  const [editName, setEditName] = useState('')
  const [editDeliverableId, setEditDeliverableId] = useState<string>('none')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Filter and Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  useEffect(() => {
    fetchFilesAndDeliverables()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchFilesAndDeliverables() {
    setLoading(true)
    
    // Fetch files with their associated deliverable title
    const { data: filesData } = await supabase
      .from('files')
      .select('*, project_deliverables(id, title)')
      .eq('project_id', projectId)
      
    if (filesData) setFiles(filesData)

    // Fetch deliverables for the select dropdowns
    const { data: delivData } = await supabase
      .from('project_deliverables')
      .select('id, title')
      .eq('project_id', projectId)
      .order('created_at')
      
    if (delivData) setDeliverables(delivData)
    
    setLoading(false)
  }

  // --- Upload Flow ---
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setCustomName(file.name)
    setSelectedDeliverableId('none')
    setIsUploadDialogOpen(true)
    e.target.value = ''
  }

  async function confirmUpload() {
    if (!selectedFile) return

    setUploading(true)
    const fileExt = selectedFile.name.split('.').pop()
    const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`

    try {
      const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, selectedFile)
      if (uploadError) throw uploadError

      const { data: publicUrl } = supabase.storage.from('project-files').getPublicUrl(filePath)
      
      const insertData: any = {
        project_id: projectId,
        name: customName.trim() || selectedFile.name,
        file_url: publicUrl.publicUrl,
        size: selectedFile.size,
        uploaded_by: userId
      }

      if (selectedDeliverableId !== 'none') {
        insertData.deliverable_id = selectedDeliverableId
      }

      await supabase.from('files').insert(insertData)

      fetchFilesAndDeliverables()
      setIsUploadDialogOpen(false)
      setSelectedFile(null)
      setCustomName('')
      setSelectedDeliverableId('none')
    } catch (err: any) {
      alert('Erro ao fazer upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // --- Edit Flow ---
  function openEditDialog(file: any) {
    setEditingFile(file)
    setEditName(file.name)
    setEditDeliverableId(file.deliverable_id || 'none')
    setIsEditDialogOpen(true)
  }

  async function confirmEdit() {
    if (!editingFile) return
    setUploading(true)
    try {
      const updateData: any = {
        name: editName.trim() || editingFile.name,
        deliverable_id: editDeliverableId === 'none' ? null : editDeliverableId
      }
      
      await supabase.from('files').update(updateData).eq('id', editingFile.id)
      
      fetchFilesAndDeliverables()
      setIsEditDialogOpen(false)
      setEditingFile(null)
    } catch (err: any) {
      alert("Erro ao editar ficheiro: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  // --- Delete Flow ---
  async function handleDelete(fileId: string, url: string) {
    if (!confirm('Eliminar este ficheiro permanentemente?')) return
    
    try {
      const path = url.split('/').slice(-2).join('/') 
      await supabase.storage.from('project-files').remove([path])
      await supabase.from('files').delete().eq('id', fileId)
      fetchFilesAndDeliverables()
    } catch (err: any) {
      console.error(err)
      alert("Erro ao apagar. " + err.message)
    }
  }

  // --- Derived State (Search & Sort) ---
  const processedFiles = files
    .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      
      switch (sortOrder) {
        case 'newest': return dateB - dateA
        case 'oldest': return dateA - dateB
        case 'name_asc': return a.name.localeCompare(b.name)
        case 'name_desc': return b.name.localeCompare(a.name)
        default: return 0
      }
    })

  function getFileIcon(filename: string, fileUrl?: string) {
    const target = filename.includes('.') ? filename : (fileUrl || '')
    const ext = target.split('.').pop()?.split('?')[0].toLowerCase() || ''
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <ImageIcon size={20} className="relative z-10" />
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return <Video size={20} className="relative z-10" />
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText size={20} className="relative z-10" />
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) return <Package size={20} className="relative z-10" />
    if (['mp3', 'wav', 'ogg'].includes(ext)) return <Music size={20} className="relative z-10" />
    return <File size={20} className="relative z-10" />
  }

  return (
    <Card className="border-0 shadow-card-subtle bg-surface">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-medium text-lg">Documentos do Projeto</h3>
            <p className="text-[13px] text-text-secondary mt-1">
              Formatos suportados: PDF, Imagens (JPG, PNG, WEBP), ZIP/RAR, Docs e Vídeos (MP4).
            </p>
          </div>
          <div className="shrink-0">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png,.webp,.svg,.doc,.docx,.xls,.xlsx,.zip,.rar,.mp4,.mov"
              onChange={handleFileSelect} 
              disabled={uploading || loading} 
            />
            <label htmlFor="file-upload">
              <span className={`inline-flex h-10 items-center justify-center rounded-md bg-primary text-white px-4 text-sm font-medium shadow transition-colors hover:bg-primary-light focus-visible:outline-none cursor-pointer w-full sm:w-auto ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Upload className="mr-2 h-4 w-4" />
                Fazer Upload
              </span>
            </label>
          </div>
        </div>

        {/* Search & Filter Bar */}
        {files.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-background/50 p-3 rounded-lg border border-border/40">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary opacity-50" />
              <Input 
                placeholder="Pesquisar ficheiros por nome..." 
                className="pl-9 bg-surface border-border/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sm:w-[220px] shrink-0">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="bg-surface border-border/60 text-text-secondary h-10 flex gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <SlidersHorizontal className="h-4 w-4 opacity-50 shrink-0" />
                    <SelectValue placeholder="Ordenar por" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigos</SelectItem>
                  <SelectItem value="name_asc">Nome (A - Z)</SelectItem>
                  <SelectItem value="name_desc">Nome (Z - A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary opacity-50" /></div>
        ) : files.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-text-secondary border border-dashed border-border/60 rounded-xl bg-surface/50">
             <File className="h-12 w-12 mb-4 opacity-20" />
             <p className="font-medium">Sem ficheiros partilhados.</p>
             <p className="text-sm mt-1 max-w-sm text-center">Faça upload de documentos, imagens ou outros recursos para organizar o material deste projeto.</p>
          </div>
        ) : processedFiles.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-text-secondary border border-dashed border-border/60 rounded-xl bg-surface/50">
             <Search className="h-10 w-10 mb-3 opacity-20" />
             <p className="font-medium">Nenhum ficheiro encontrado.</p>
             <p className="text-sm mt-1 text-center">Tente utilizar outros termos na barra de pesquisa.</p>
          </div>
        ) : (
          <div className="space-y-3">
             {processedFiles.map(file => (
               <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl border border-border/60 bg-background transition-shadow hover:shadow-sm gap-3 sm:gap-0 group">
                 <div className="flex items-center gap-3 overflow-hidden">
                   <div className="p-2.5 bg-gradient-to-br from-primary to-primary-light rounded-lg text-white shrink-0 shadow-sm relative overflow-hidden group-hover:shadow-md transition-all">
                     {getFileIcon(file.name, file.file_url)}
                   </div>
                   <div className="min-w-0">
                     <div className="flex items-center gap-2">
                       <p className="text-[15px] font-medium text-text-primary truncate">{file.name}</p>
                       {file.project_deliverables && (
                         <span className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium border border-primary/20">
                           <Tag size={10} />
                           {file.project_deliverables.title}
                         </span>
                       )}
                     </div>
                     <p className="text-xs text-text-secondary mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB • Partilhado a {new Date(file.created_at).toLocaleDateString('pt-PT')}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(file)} className="h-8 w-8 text-text-secondary hover:text-primary hover:bg-primary/10" title="Editar">
                      <Pencil size={14} />
                    </Button>
                    <a href={`${file.file_url}?download=${encodeURIComponent(file.name)}`} download={file.name} className="inline-flex items-center justify-center p-2 h-8 w-8 hover:bg-surface rounded-md text-text-secondary transition-colors" title="Descarregar">
                      <Download size={14} />
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id, file.file_url)} className="h-8 w-8 text-text-secondary hover:text-red-600 hover:bg-red-50" title="Apagar">
                      <Trash2 size={14} />
                    </Button>
                 </div>
               </div>
             ))}
          </div>
        )}
      </CardContent>

      {/* Dialog for Uploading */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fazer Upload</DialogTitle>
            <DialogDescription>
              Defina um nome que facilite a identificação deste ficheiro, como "Fotos Entrega 1".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome do Ficheiro</Label>
              <Input 
                value={customName} 
                onChange={(e) => setCustomName(e.target.value)} 
                placeholder="Ex: Briefing V2.pdf"
                autoFocus
              />
            </div>
            
            {deliverables.length > 0 && (
              <div className="space-y-2">
                <Label>Associar a uma Meta/Entrega (Opcional)</Label>
                <Select value={selectedDeliverableId} onValueChange={setSelectedDeliverableId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma meta..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Nenhuma (Ficheiro Geral) --</SelectItem>
                    {deliverables.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="text-xs text-text-secondary p-3 bg-surface rounded-md border text-center break-all">
              Ficheiro selecionado: <br/><strong className="text-text-primary">{selectedFile?.name}</strong> ({(selectedFile?.size ? selectedFile.size / 1024 / 1024 : 0).toFixed(2)} MB)
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsUploadDialogOpen(false); setSelectedFile(null); }} disabled={uploading}>Cancelar</Button>
            <Button onClick={confirmUpload} disabled={uploading || !customName.trim()} className="bg-primary text-white hover:bg-primary-light">
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? 'A Guardar...' : 'Confirmar Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Editing existing file */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Ficheiro</DialogTitle>
            <DialogDescription>
              Altere o nome do ficheiro ou a meta/entrega à qual este ficheiro pertence.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome do Ficheiro</Label>
              <Input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                placeholder="Introduza o novo nome..."
                autoFocus
              />
            </div>

            {deliverables.length > 0 && (
              <div className="space-y-2">
                <Label>Associar a uma Meta/Entrega</Label>
                <Select value={editDeliverableId} onValueChange={setEditDeliverableId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nenhuma associada" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Nenhuma (Ficheiro Geral) --</SelectItem>
                    {deliverables.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingFile(null); }} disabled={uploading}>Cancelar</Button>
            <Button onClick={confirmEdit} disabled={uploading || !editName.trim()} className="bg-primary text-white hover:bg-primary-light">
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {uploading ? 'A Guardar...' : 'Guardar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Card>
  )
}
