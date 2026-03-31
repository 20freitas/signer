import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { CheckCircle2, Circle, Clock, File, Download, Target, Calendar, Paperclip, MessageSquare } from 'lucide-react'

export default async function PublicProjectPage({ params }: { params: { token: string } }) {
  const supabase = await createClient()

  // 1. Fetch Project by Token
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*, deliverables:project_deliverables(*, files(id, name, file_url, size)), files(*)')
    .eq('share_token', params.token)
    .eq('share_active', true)
    .single()

  if (!project || projectError) {
    return notFound()
  }

  // 2. Fetch Branding of the project owner
  const { data: branding } = await supabase
    .from('user_branding')
    .select('*')
    .eq('user_id', project.user_id)
    .single()

  // Styles Injection
  const brandColor = branding?.primary_color || '#2563eb'
  const brandBg = branding?.secondary_color || '#fdfcfb'

  const deliverables = project.deliverables || []
  const generalFiles = project.files?.filter((f: any) => !f.deliverable_id) || []

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: brandBg }}>
      {/* Dynamic Style Injection for some specific elements if needed */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-primary: ${brandColor};
        }
        .text-brand { color: ${brandColor}; }
        .bg-brand { background-color: ${brandColor}; }
        .border-brand { border-color: ${brandColor}; }
        .bg-brand-soft { background-color: color-mix(in srgb, ${brandColor} 10%, transparent); }
      `}} />

      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              {branding?.logo_url ? (
                <div className="relative h-10 w-32">
                   <Image src={branding.logo_url} alt={branding.agency_name} fill className="object-contain object-left" />
                </div>
              ) : (
                <span className="text-xl font-bold tracking-tight text-brand">
                   {branding?.agency_name || 'Portal do Cliente'}
                </span>
              )}
           </div>
           
           <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
              <a href="#entregas" className="hover:text-brand transition-colors">Progresso</a>
              <a href="#ficheiros" className="hover:text-brand transition-colors">Ficheiros</a>
           </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Project Hero */}
        <section className="mb-20">
           <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-brand-soft text-brand border border-brand/10">
                 {project.status === 'completed' ? 'Concluído' : 'Projeto em Curso'}
              </span>
              <span className="text-text-secondary text-sm">•</span>
              <span className="text-text-secondary text-sm flex items-center gap-1.5">
                 <Calendar size={14} />
                 Criado em {format(new Date(project.created_at), "d 'de' MMMM", { locale: pt })}
              </span>
           </div>
           
           <h1 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary mb-6 leading-[1.1]">
              {project.name}
           </h1>
           
           {branding?.agency_description && (
             <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                {branding.agency_description}
             </p>
           )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
           
           {/* Timeline & Deliverables */}
           <div className="lg:col-span-2 space-y-12">
              <div id="entregas">
                 <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Target className="text-brand" size={24} />
                    Progresso e Metas
                 </h2>

                 <div className="relative border-l-2 border-black/5 ml-3 space-y-10 py-2">
                    {deliverables.length === 0 ? (
                       <p className="text-text-secondary italic pl-6 pt-2">Nenhuma meta definida para visualização.</p>
                    ) : (
                       deliverables.sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map((del: any) => {
                          const isCompleted = del.status === 'completed'
                          const isLate = !isCompleted && new Date(del.due_date) < new Date()
                          
                          return (
                             <div key={del.id} className="relative pl-8 group">
                                <div className={`absolute -left-[11px] top-6 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${isCompleted ? 'bg-green-500' : isLate ? 'bg-red-500' : 'bg-brand'}`}></div>
                                
                                <div className="bg-white/40 border border-black/[0.03] backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                      <div>
                                         <h3 className={`text-lg font-bold ${isCompleted ? 'text-text-secondary/60' : 'text-text-primary'}`}>
                                            {del.title}
                                         </h3>
                                         <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-text-secondary font-medium">
                                               Prazo: {format(new Date(del.due_date), "d 'de' MMM", { locale: pt })}
                                            </span>
                                            {isCompleted && <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Finalizado</span>}
                                         </div>
                                      </div>
                                   </div>
                                   
                                   {del.description && (
                                      <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                         {del.description}
                                      </p>
                                   )}

                                   {/* Files in Milestone */}
                                   {del.files && del.files.length > 0 && (
                                      <div className="flex flex-wrap gap-2 pt-4 border-t border-black/5">
                                         {del.files.map((file: any) => (
                                            <a 
                                              key={file.id} 
                                              href={`${file.file_url}?download=${encodeURIComponent(file.name)}`}
                                              download={file.name}
                                              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-black/5 rounded-xl text-xs font-semibold text-text-primary hover:bg-brand hover:text-white transition-all shadow-sm"
                                            >
                                               <Paperclip size={14} />
                                               {file.name}
                                            </a>
                                         ))}
                                      </div>
                                   )}
                                </div>
                             </div>
                          )
                       })
                    )}
                 </div>
              </div>
           </div>

           {/* Sidebar: General Files & Info */}
           <div className="space-y-12">
              <div id="ficheiros">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <File className="text-brand" size={20} />
                    Documentação Geral
                 </h2>
                 
                 <div className="space-y-3">
                    {generalFiles.length === 0 ? (
                       <div className="p-8 text-center border-2 border-dashed border-black/5 rounded-2xl">
                          <p className="text-sm text-text-secondary">Sem ficheiros gerais anexados.</p>
                       </div>
                    ) : (
                       generalFiles.map((file: any) => (
                          <a 
                            key={file.id} 
                            href={`${file.file_url}?download=${encodeURIComponent(file.name)}`}
                            download={file.name}
                            className="group flex items-center justify-between p-4 bg-white/60 border border-black/[0.03] rounded-2xl hover:bg-white transition-all shadow-sm"
                          >
                             <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2.5 bg-brand-soft rounded-lg text-brand group-hover:scale-110 transition-transform">
                                   <File size={18} />
                                </div>
                                <div className="min-w-0">
                                   <p className="text-sm font-bold text-text-primary truncate">{file.name}</p>
                                   <p className="text-[10px] text-text-secondary">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                </div>
                             </div>
                             <div className="p-2 text-text-secondary group-hover:text-brand transition-colors">
                                <Download size={16} />
                             </div>
                          </a>
                       ))
                    )}
                 </div>
              </div>

              {/* Support / Contact Placeholder */}
              <div className="p-6 rounded-2xl bg-brand text-white shadow-xl shadow-brand/20">
                 <MessageSquare size={24} className="mb-4 opacity-80" />
                 <h3 className="font-bold text-lg mb-2">Precisa de ajuda?</h3>
                 <p className="text-sm opacity-90 leading-relaxed mb-6">
                    Se tiver dúvidas sobre o progresso ou ficheiros, entre em contacto direto com a nossa equipa.
                 </p>
                 <Button className="w-full bg-white text-brand font-bold hover:bg-white/90">
                    Enviar Mensagem
                 </Button>
              </div>
           </div>

        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 hover:opacity-100 transition-opacity">
         <p className="text-xs font-medium text-text-secondary">
            © {new Date().getFullYear()} {branding?.agency_name}. Todos os direitos reservados.
         </p>
         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            <span>Powered by</span>
            <Image src="/SIGNER.png" alt="Signer" width={60} height={20} className="grayscale" />
         </div>
      </footer>
    </div>
  )
}
