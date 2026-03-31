'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Link as LinkIcon, Copy, Check, ExternalLink, Globe, ShieldAlert, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ProjectShareLink({ project }: { project: any }) {
  const [active, setActive] = useState(project.share_active || false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Construct the public URL
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/p/${project.share_token}` 
    : '';

  async function toggleShare(enabled: boolean) {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('projects')
        .update({ share_active: enabled })
        .eq('id', project.id)

      if (error) throw error
      setActive(enabled)
      router.refresh()
    } catch (err: any) {
      alert("Erro ao alterar estado do link: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Card className="border-border/50 shadow-sm bg-surface">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2.5 text-primary mb-1">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Globe size={20} className="text-primary" />
             </div>
             <CardTitle className="text-xl font-semibold tracking-tight">Vínculo Público para o Cliente</CardTitle>
          </div>
          <CardDescription className="text-text-secondary pt-2">
            Gere um link seguro que permite ao seu cliente visualizar o progresso do projeto, 
            descarregar ficheiros e consultar as metas sem precisar de criar conta ou fazer login.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-2">
          {/* Main Toggle Area */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${active ? 'bg-primary/[0.03] border-primary/20 shadow-sm' : 'bg-background/50 border-border/60 opacity-80'}`}>
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-primary/20 text-primary' : 'bg-text-secondary/10 text-text-secondary'}`}>
                  {active ? <LinkIcon size={24} /> : <ShieldAlert size={24} />}
               </div>
               <div>
                  <h4 className="font-semibold text-text-primary">
                    Acesso ao Portal {active ? 'Ativado' : 'Desativado'}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {active ? 'O seu cliente já pode aceder ao link.' : 'Ninguém consegue ver este projeto via link público.'}
                  </p>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-sm font-medium text-text-secondary">{active ? 'Ativo' : 'Inativo'}</span>
               <Switch 
                 checked={active} 
                 onCheckedChange={toggleShare} 
                 disabled={loading}
                 className="data-[state=checked]:bg-primary"
               />
            </div>
          </div>

          {/* Link Box */}
          {active && (
             <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Link de Partilha</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                   <div className="flex-1 bg-background border border-border/80 rounded-xl px-4 py-3 flex items-center gap-3 group relative overflow-hidden">
                      <LinkIcon size={16} className="text-text-secondary shrink-0" />
                      <span className="text-sm text-text-primary font-mono truncate">{publicUrl}</span>
                      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background pointer-events-none"></div>
                   </div>
                   <div className="flex gap-2 shrink-0">
                      <Button 
                        variant="outline" 
                        className="h-12 px-5 gap-2 rounded-xl bg-background hover:bg-surface-hover border-border/80"
                        onClick={copyToClipboard}
                      >
                         {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                         {copied ? 'Copiado' : 'Copiar'}
                      </Button>
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        <Button 
                          className="h-12 px-5 gap-2 rounded-xl bg-primary text-white hover:bg-primary-light border-0 shadow-md"
                        >
                           <ExternalLink size={16} />
                           Abrir Portal
                        </Button>
                      </a>
                   </div>
                </div>
                <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-2 pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Link seguro e encriptado. Pode desativá-lo a qualquer momento.
                </p>
             </div>
          )}
        </CardContent>
      </Card>
      
      {/* Information Alert */}
      <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/30 flex gap-4">
         <div className="mt-0.5 text-blue-600"><Globe size={18} /></div>
         <div className="space-y-1">
            <h5 className="text-sm font-semibold text-blue-900">Como funciona o Portal do Cliente?</h5>
            <p className="text-sm text-blue-800/70 leading-relaxed">
              O seu cliente verá uma versão simplificada e elegante deste projeto, focada na visualização e download. 
              As cores e logotipos exibidos no portal serão aqueles que configurou na sua página de <strong>Branding</strong>.
            </p>
         </div>
      </div>
    </div>
  )
}
