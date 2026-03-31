'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Loader2, Pencil, Check, X, Globe } from 'lucide-react'
import { slugify } from '@/lib/slugify'
import { createClient } from '@/lib/supabase/client'

export function ProjectDetailsForm({ project, clients }: { project: any, clients: any[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: project.name || '',
    client_id: project.client_id || '',
    status: project.status || 'in_progress',
    due_date: project.due_date || '',
    description: project.description || '',
    slug: project.slug || ''
  })
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSave() {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          client_id: formData.client_id,
          status: formData.status,
          due_date: formData.due_date || null,
          description: formData.description,
          slug: slugify(formData.slug)
        })
        .eq('id', project.id)

      if (error) throw error

      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error(error)
      alert('Erro ao guardar as alterações.')
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Card className="border-0 shadow-card-subtle bg-surface relative group">
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-2 text-text-secondary hover:text-primary">
            <Pencil size={14} />
            Editar
          </Button>
        </div>
        <CardHeader>
          <CardTitle>Sobre este projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-secondary">Estado</p>
              <div className={`mt-1 inline-flex text-xs px-2 py-1 rounded-full ${project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {project.status === 'in_progress' ? 'Em curso' : project.status === 'completed' ? 'Concluído' : 'Em pausa'}
              </div>
            </div>
            <div>
              <p className="text-text-secondary">Data Límite</p>
              <div className="mt-1 flex items-center gap-1.5 font-medium">
                <CalendarIcon size={14} />
                {project.due_date ? new Date(project.due_date).toLocaleDateString('pt-PT') : 'Não definida'}
              </div>
            </div>
            <div>
              <p className="text-text-secondary">Identificador URL (Slug)</p>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] bg-background px-2 py-0.5 rounded border border-border/60">
                <Globe size={11} className="text-primary" />
                {project.slug || 'Não definido'}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-text-secondary mb-1">Descrição</p>
            <p className="text-sm whitespace-pre-wrap">{project.description || 'Nenhuma descrição providenciada.'}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-primary/20 shadow-md bg-surface">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Editar Detalhes</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => {
              setFormData({
                name: project.name || '',
                client_id: project.client_id || '',
                status: project.status || 'in_progress',
                due_date: project.due_date || '',
                description: project.description || '',
                slug: project.slug || ''
              })
              setIsEditing(false)
            }} disabled={loading} className="text-text-secondary">
              <X size={16} className="mr-1" />
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading} className="bg-primary text-white hover:bg-primary-light">
              {loading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Check size={16} className="mr-1" />}
              Guardar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome do Projeto</Label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={formData.client_id} onValueChange={val => setFormData({...formData, client_id: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">Em curso</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="paused">Em pausa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data de Entrega</Label>
            <Input 
              type="date" 
              value={formData.due_date} 
              onChange={e => setFormData({...formData, due_date: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              Slug do Projeto
              <span className="text-[10px] text-text-secondary normal-case">ex: website-venda</span>
            </Label>
            <Input 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: slugify(e.target.value)})}
              placeholder="id-do-projeto"
              className="font-mono text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}
