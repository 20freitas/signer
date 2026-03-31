'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImagePlus, Smartphone, Monitor, Loader2, Save, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function BrandingWorkspace({ initialData, userId }: { initialData: any, userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  
  // States
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [saved, setSaved] = useState(false)
  
  // Branding Variables
  const [agencyName, setAgencyName] = useState(initialData?.agency_name || '')
  const [agencyDesc, setAgencyDesc] = useState(initialData?.agency_description || '')
  const [primaryColor, setPrimaryColor] = useState(initialData?.primary_color || '#2563eb')
  const [secondaryColor, setSecondaryColor] = useState(initialData?.secondary_color || '#fdfcfb')
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '')

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

  // Preview CSS Variables
  const previewStyle = {
    '--brand-color': primaryColor,
    '--brand-bg': secondaryColor,
  } as React.CSSProperties

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
          
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as any)} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-surface border">
              <TabsTrigger value="desktop" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Monitor className="w-3.5 h-3.5 mr-1.5" />PC</TabsTrigger>
              <TabsTrigger value="mobile" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary"><Smartphone className="w-3.5 h-3.5 mr-1.5" />Móvel</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Render Environment Constraint */}
        <div className="flex-1 overflow-hidden bg-black/5 flex justify-center items-center py-6 sm:py-10 px-4 transition-all duration-500 ease-in-out">
           
           <div 
             className={`transition-all duration-500 ease-in-out relative shadow-2xl flex flex-col ${
               previewMode === 'mobile' 
                 ? 'w-[375px] h-[760px] rounded-[3.5rem] border-[14px] border-gray-900 bg-gray-900 overflow-hidden scale-[0.75] md:scale-90 lg:scale-100' 
                 : 'w-full h-full max-w-6xl rounded-2xl border border-border bg-background'
             }`}
             style={{
               ...previewStyle,
               backgroundColor: 'var(--brand-bg)'
             }}
           >
              {/* Fake Notch for Mobile */}
              {previewMode === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-[60] flex items-center justify-center">
                  <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
                </div>
              )}

              {/* Internal Content Scroller */}
              <div className="flex-1 overflow-y-auto styled-scrollbar w-full h-full relative">
                 {/* --- MOCK CLIENT PORTAL --- */}
                 <div className={`min-h-full pb-10 ${previewMode === 'mobile' ? 'px-2' : ''}`}>
                    {/* Fake Header */}
                    <header className={`px-6 sm:px-10 py-6 ${previewMode === 'mobile' ? 'pt-12' : ''} border-b border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between`}>
                       <div className="flex items-center justify-center sm:justify-start">
                          {logoUrl ? (
                            <div className="relative h-10 w-32"><Image src={logoUrl} alt="Logo" fill className="object-contain object-center sm:object-left" /></div>
                          ) : (
                            <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--brand-color)' }}>
                               {agencyName || 'Your Logo Here'}
                            </div>
                          )}
                       </div>
                       {previewMode === 'desktop' && (
                          <nav className="flex gap-6 text-sm font-medium text-text-secondary">
                            <span className="text-text-primary">Dashboard</span>
                            <span>Ficheiros</span>
                            <span>Contactar</span>
                          </nav>
                       )}
                    </header>

                    {/* Fake Hero / Details */}
                    <div className={`${previewMode === 'mobile' ? 'px-6 py-8' : 'px-6 sm:px-10 py-10'} max-w-3xl`}>
                       <span 
                         className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
                         style={{ backgroundColor: 'color-mix(in srgb, var(--brand-color) 15%, transparent)', color: 'var(--brand-color)' }}
                       >
                         Em Progresso
                       </span>
                       <h2 className={`${previewMode === 'mobile' ? 'text-3xl leading-tight' : 'text-3xl sm:text-4xl'} font-extrabold tracking-tight mb-4`}>Website "Exemplo Global"</h2>
                       <p className={`text-text-secondary leading-relaxed max-w-2xl mb-8 ${previewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
                          {agencyDesc || 'Bem-vindo ao seu portal dedicado. Aqui poderá acompanhar os avanços do seu projeto, submeter feedback e aceder a todos os documentos essenciais assim que aprovados.'}
                       </p>

                       {/* Fake CTA Action */}
                       <button 
                         className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 shadow-lg"
                         style={{ backgroundColor: 'var(--brand-color)' }}
                       >
                         Ver Faturação
                       </button>
                    </div>

                    {/* Fake Milestone timeline */}
                    <div className={`${previewMode === 'mobile' ? 'px-4' : 'px-6 sm:px-10'} mt-2`}>
                       <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--brand-color)' }} />
                          Próximas Entregas
                       </h3>
                       
                       <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="p-4 sm:p-5 rounded-2xl bg-white/40 border border-border/60 shadow-sm transition-all hover:shadow-md">
                              <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  {i === 1 ? (
                                     <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--brand-color)' }} />
                                  ) : (
                                     <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: 'color-mix(in srgb, var(--brand-color) 40%, transparent)' }}></div>
                                  )}
                                  <h4 className={`font-bold ${i === 1 ? 'text-text-primary' : 'text-text-secondary'} ${previewMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
                                    Entrega Exemplo {i}
                                  </h4>
                                </div>
                                {i === 1 && (
                                   <span className="text-[10px] bg-green-50 text-green-700 font-black px-2 py-0.5 rounded-full border border-green-200 w-max shrink-0 uppercase">Concluído</span>
                                )}
                              </div>
                              <p className={`text-text-secondary mt-1 pl-6 ${previewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>Resumo desta entrega de teste para verificar a adaptação das cores em ambiente real.</p>
                              
                              {i === 1 && (
                                <div className="mt-4 pt-4 border-t border-border/50 pl-6 flex flex-wrap gap-2">
                                   <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border/60 rounded-xl text-[10px] font-bold hover:bg-black/5 transition-colors cursor-pointer shadow-sm">
                                     📄 preview_file.zip
                                   </span>
                                </div>
                              )}
                            </div>
                          ))}
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
