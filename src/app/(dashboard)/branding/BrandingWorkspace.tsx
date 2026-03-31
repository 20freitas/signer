'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImagePlus, Loader2, Save, CheckCircle2, Link as LinkIcon, RefreshCw, FileText, Image as ImageIcon, Package, Download } from 'lucide-react'
import { slugify } from '@/lib/slugify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function BrandingWorkspace({ initialData, userId }: { initialData: any, userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  
  // States
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Branding Variables
  const [agencyName, setAgencyName] = useState(initialData?.agency_name || '')
  const [agencyDesc, setAgencyDesc] = useState(initialData?.agency_description || '')
  const [primaryColor, setPrimaryColor] = useState(initialData?.primary_color || '#2563eb')
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondary_color || '#fdfcfb')
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '')
  const [agencySlug, setAgencySlug] = useState(initialData?.slug || '')

  // Handle Logo Upload
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `branding/${userId}/logo_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('project-files').getPublicUrl(filePath)
      setLogoUrl(data.publicUrl)
    } catch (err: any) {
      alert("Erro ao fazer upload do logotipo: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Handle Save
  async function handleSave() {
    setLoading(true)
    try {
      const payload = {
        user_id: userId,
        agency_name: agencyName.trim(),
        agency_description: agencyDesc.trim(),
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        logo_url: logoUrl,
        slug: agencySlug.trim() || null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_branding')
        .upsert(payload, { onConflict: 'user_id' })

      if (error) {
         if (error.code === '42P01') {
             throw new Error("A tabela user_branding ainda não foi criada na Base de Dados. Executa o script de migração primeiro!")
         }
         throw error
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const previewStyle = {
    '--brand-color': primaryColor,
    '--brand-bg': secondaryColor,
  } as any

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: Controls */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 pb-10 styled-scrollbar">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personalizar Identidade</h1>
          <p className="text-sm text-text-secondary mt-1">
            Configura como os teus clientes vão ver a área deles.
          </p>
        </div>

        {/* Logo Card */}
        <Card className="shadow-sm border-border/50 bg-surface">
          <CardContent className="p-5 space-y-4">
            <Label className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">Logotipo da Agência</Label>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center bg-background shrink-0 relative overflow-hidden group">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
                ) : (
                   <ImagePlus className="w-6 h-6 text-text-secondary/40" />
                )}
              </div>
              <div className="flex-1">
                <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <span className="inline-flex h-9 items-center justify-center rounded-md bg-background border shadow-sm px-4 text-sm font-medium transition-colors hover:bg-surface-hover hover:text-primary">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fazer Upload"}
                  </span>
                </Label>
                <p className="text-[11px] text-text-secondary mt-2">Recomendado: Fundo transparente (PNG/SVG).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="shadow-sm border-border/50 bg-surface">
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">Nome Oficial</Label>
              <Input 
                value={agencyName} 
                onChange={e => setAgencyName(e.target.value)} 
                placeholder="Exemplo Studio" 
                className="bg-background/50 border-border/60 focus:bg-background h-10"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">URL da Agência (Slug)</Label>
                <button
                  type="button"
                  onClick={() => setAgencySlug(slugify(agencyName))}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
                  title="Gerar automaticamente a partir do nome"
                >
                  <RefreshCw size={11} />
                  Auto-gerar
                </button>
              </div>
              <div className="flex items-center gap-0 rounded-lg border border-border/60 overflow-hidden bg-background/50 focus-within:ring-1 focus-within:ring-primary/30 focus-within:border-primary/50">
                <span className="px-3 py-2 text-[11px] text-text-secondary/60 bg-surface border-r border-border/40 shrink-0 font-mono select-none">
                  signer.pt/
                </span>
                <input
                  type="text"
                  value={agencySlug}
                  onChange={e => setAgencySlug(slugify(e.target.value))}
                  placeholder="minha-agencia"
                  className="flex-1 px-3 py-2 text-sm font-mono bg-transparent outline-none text-text-primary placeholder:text-text-secondary/40"
                />
              </div>
              <p className="text-[10px] text-text-secondary">Este será o identificador principal nos links dos teus projetos.</p>
              {agencySlug && (
                <p className="text-[10px] text-text-secondary/60 flex items-center gap-1 mt-1">
                  <LinkIcon size={10} />
                  Exemplo: <span className="font-mono text-primary/80">signer.pt/{agencySlug}/nome-projeto</span>
                </p>
              )}
            </div>
            
            <div className="space-y-4 pt-2 border-t border-border/40">
               <div className="space-y-2">
                 <Label className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">Cores da Marca</Label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-medium text-text-secondary">Primária</label>
                       <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-border/50">
                             <input 
                               type="color" 
                               value={primaryColor} 
                               onChange={e => setPrimaryColor(e.target.value)}
                               className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer"
                             />
                          </div>
                          <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="font-mono text-[10px] uppercase h-8 px-2" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-medium text-text-secondary">Secundária (Fundo)</label>
                       <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm border border-border/50">
                             <input 
                               type="color" 
                               value={secondaryColor} 
                               onChange={e => setSecondaryColor(e.target.value)}
                               className="absolute -inset-2 w-[150%] h-[150%] cursor-pointer"
                             />
                          </div>
                          <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="font-mono text-[10px] uppercase h-8 px-2" />
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">Mensagem de Boas-vindas</Label>
              <Textarea 
                value={agencyDesc} 
                onChange={e => setAgencyDesc(e.target.value)}
                placeholder="Escreve uma frase de boas-vindas ou apresentação..." 
                className="resize-none h-24 bg-background/50 border-border/60 focus:bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          disabled={loading} 
          className={`w-full h-11 shadow-md transition-all ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary-light'} text-white`}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? 'A Guardar...' : saved ? 'Guardado!' : 'Guardar Configurações'}
        </Button>
      </div>

      {/* RIGHT COLUMN: Live Preview Canvas */}
      <div className="flex-1 flex flex-col bg-surface/50 border border-border/50 rounded-2xl overflow-hidden relative shadow-inner">
        
        {/* Canvas Toolbar */}
        <div className="h-14 border-b border-border/50 bg-background/80 flex items-center justify-between px-4 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span className="ml-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Live Preview</span>
          </div>
        </div>

        {/* Render Environment Constraint */}
        <div className="flex-1 overflow-hidden bg-black/5 flex justify-center items-center py-6 sm:py-10 px-4">
           <div 
             className="w-full h-full max-w-6xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
             style={{
               backgroundColor: secondaryColor
             }}
           >
              <div className="flex-1 overflow-y-auto styled-scrollbar w-full h-full relative" style={previewStyle}>
                 {/* --- MOCK CLIENT PORTAL --- */}
                 <div className="min-h-full pb-10 flex flex-col">
                    {/* Fake Header */}
                    <header className="px-6 sm:px-10 py-6 border-b border-black/5 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-20">
                       <div className="flex items-center">
                          {logoUrl ? (
                            <div className="relative h-8 w-24"><Image src={logoUrl} alt="Logo" fill className="object-contain object-left" /></div>
                          ) : (
                            <div className="text-lg font-bold tracking-tight" style={{ color: 'var(--brand-color)' }}>
                               {agencyName || 'Your Logo Here'}
                            </div>
                          )}
                       </div>
                    </header>

                    {/* Main Mock Content - Single Column */}
                    <div className="max-w-[800px] w-full mx-auto px-6 py-10 flex-1">
                       {/* Hero Section */}
                       <div className="mb-12">
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--brand-color) 10%, transparent)', color: 'var(--brand-color)', borderColor: 'color-mix(in srgb, var(--brand-color) 15%, transparent)' }}
                          >
                            Em Curso
                          </span>
                          <h2 className="text-3xl font-black tracking-tighter mb-4 text-[#0f172a]">Website "Exemplo Global"</h2>
                          <p className="text-text-secondary leading-relaxed max-w-lg text-sm">
                             {agencyDesc || 'Bem-vindo ao seu portal dedicado. Aqui poderá acompanhar os avanços do seu projeto em tempo real.'}
                          </p>
                       </div>

                       {/* Unified List Part 1: Milestones */}
                       <div className="mb-12">
                          <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-[#0f172a]">
                             <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-color) 15%, transparent)', color: 'var(--brand-color)' }}>
                               <CheckCircle2 size={14} />
                             </div>
                             Progresso e Metas
                          </h3>
                          
                          <div className="space-y-6 border-l-2 border-black/[0.03] ml-2.5">
                             {[1, 2].map((i) => (
                               <div key={i} className="relative pl-7">
                                 <div className="absolute -left-[11px] top-6 w-4 h-4 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: i === 1 ? '#22c55e' : 'var(--brand-color)' }}></div>
                                 <div className="p-5 rounded-2xl bg-white/50 border border-black/[0.03] shadow-sm">
                                   <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-sm text-[#0f172a]">Entrega Milestone {i}</h4>
                                      <span className="text-[9px] font-bold text-text-secondary">Prazo: 1{i} Março</span>
                                   </div>
                                   <p className="text-xs text-text-secondary">Descrição breve desta meta para simular o aspeto final.</p>
                                 </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Unified List Part 2: Files */}
                       <div className="mb-12">
                          <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-[#0f172a]">
                             <div className="w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--brand-color) 15%, transparent)', color: 'var(--brand-color)' }}>
                               <Save size={14} />
                             </div>
                             Documentação Geral
                          </h3>
                          
                          <div className="space-y-3">
                             {[
                               { name: 'Contrato_Assinado.pdf', icon: <FileText size={16} /> },
                               { name: 'Manual_Marca.zip', icon: <Package size={16} /> },
                               { name: 'Assets_Branding.jpg', icon: <ImageIcon size={16} /> }
                             ].map((file) => (
                               <div key={file.name} className="flex items-center justify-between p-4 bg-white/50 border border-black/[0.03] rounded-2xl">
                                 <div className="flex items-center gap-3">
                                   <div 
                                     className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm"
                                     style={{ 
                                       background: `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor}, white 20%))` 
                                     }}
                                   >
                                      {file.icon}
                                   </div>
                                   <span className="text-sm font-bold text-[#0f172a]">{file.name}</span>
                                 </div>
                                 <div className="w-8 h-8 rounded-full border border-black/[0.05] flex items-center justify-center text-text-secondary">
                                   <Download size={12} />
                                 </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Footer - Made by Signer */}
                    <footer className="mt-auto py-10 border-t border-black/[0.05] flex flex-col items-center gap-3">
                       <p className="text-[10px] font-medium text-text-secondary opacity-60 uppercase tracking-widest">
                          © {new Date().getFullYear()} {agencyName || 'Agência Exemplo'}
                       </p>
                       <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-black/[0.05] shadow-sm">
                          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-70">Powered by</span>
                          <Image src="/SIGNER.png" alt="Signer" width={52} height={16} className="grayscale" />
                       </div>
                    </footer>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
