import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { File, Download, Calendar, Paperclip, CheckCircle2, FileText, Image as ImageIcon, Video, Music, Package } from 'lucide-react'

export default async function SlugProjectPage({ 
  params 
}: { 
  params: { agencySlug: string; projectSlug: string } 
}) {
  const supabase = await createClient()

  // 1. Find agency by slug
  const { data: branding, error: brandingError } = await supabase
    .from('user_branding')
    .select('*')
    .eq('slug', params.agencySlug)
    .single()

  if (!branding || brandingError) {
    return notFound()
  }

  // 2. Find project by user_id and project slug
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*, deliverables:project_deliverables(*, files:files(id, name, file_url, size, deliverable_id)), projects_files:files(id, name, file_url, size, deliverable_id)')
    .eq('user_id', branding.user_id)
    .eq('slug', params.projectSlug)
    .eq('share_active', true)
    .single()

  if (!project || projectError) {
    return notFound()
  }

  const brandColor = branding.primary_color || '#2563eb'
  const brandBg = branding.secondary_color || '#fdfcfb'

  const deliverables = (project.deliverables || []).sort(
    (a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  )
  
  // Show ALL files for a complete list, or just general ones as per preference
  const generalFiles = project.projects_files || []

  function getFileIcon(filename: string, fileUrl?: string) {
    // Try to get extension from filename, or from URL if filename lacks a dot
    const target = filename.includes('.') ? filename : (fileUrl || '')
    const ext = target.split('.').pop()?.split('?')[0].toLowerCase() || ''
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return <ImageIcon size={18} />
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return <Video size={18} />
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return <FileText size={18} />
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) return <Package size={18} />
    if (['mp3', 'wav', 'ogg'].includes(ext)) return <Music size={18} />
    return <File size={18} />
  }

  return (
    <div style={{ backgroundColor: brandBg, minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --brand: ${brandColor}; }
        .c-brand  { color: ${brandColor}; }
        .bg-brand { background-color: ${brandColor}; }
        .bg-brand-gradient { 
          background: linear-gradient(135deg, ${brandColor}, color-mix(in srgb, ${brandColor}, white 20%)); 
        }
        .bg-brand-soft { background-color: color-mix(in srgb, ${brandColor} 12%, transparent); }
        .border-brand { border-color: ${brandColor}; }
        .chip-file:hover { background-color: ${brandColor}; color: white; border-color: transparent; }
      `}} />

      {/* Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md border-b border-black/5 bg-white/80">
        <div className="max-w-[800px] mx-auto px-6 h-[60px] flex items-center">
          {branding.logo_url ? (
            <div className="relative h-[30px] w-[96px]">
              <Image src={branding.logo_url} alt={branding.agency_name || 'Logo'} fill className="object-contain object-left" unoptimized />
            </div>
          ) : (
            <span className="text-base font-extrabold tracking-tight c-brand">
              {branding.agency_name || 'Portal do Cliente'}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Hero */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="bg-brand-soft c-brand border border-brand/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {project.status === 'completed' ? 'Concluído' : 'Em Curso'}
            </span>
            <span className="text-[13px] text-text-secondary flex items-center gap-1.5">
              <Calendar size={13} />
              {format(new Date(project.created_at), "d 'de' MMMM 'de' yyyy", { locale: pt })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-[1.1] mb-4">
            {project.name}
          </h1>

          {branding.agency_description && (
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
              {branding.agency_description}
            </p>
          )}
        </section>

        {/* Deliverables List */}
        <section className="mb-12">
          <h2 className="text-text-primary font-bold flex items-center gap-2 mb-8 text-base">
            <div className="w-6 h-6 rounded-full bg-brand-soft c-brand flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
            Progresso e Metas
          </h2>

          <div className="relative border-l-2 border-black/[0.03] ml-3 space-y-8">
            {deliverables.length === 0 ? (
              <p className="text-text-secondary italic pl-6 pt-2 text-sm">Nenhuma meta definida para visualização.</p>
            ) : (
              deliverables.map((del: any) => {
                const isCompleted = del.status === 'completed'
                const isLate = !isCompleted && new Date(del.due_date) < new Date()
                return (
                  <div key={del.id} className="relative pl-8 group">
                    <div className={`absolute -left-[11px] top-6 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${isCompleted ? 'bg-green-500' : isLate ? 'bg-red-500' : 'bg-brand'}`}></div>
                    
                    <div className="bg-white/50 border border-black/[0.03] backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`font-bold text-sm ${isCompleted ? 'text-text-secondary/60 line-through' : 'text-text-primary'}`}>{del.title}</h3>
                          <p className="text-[11px] text-text-secondary mt-0.5">Prazo: {format(new Date(del.due_date), "d 'de' MMM", { locale: pt })}</p>
                        </div>
                        {isCompleted && (
                           <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Finalizado</span>
                        )}
                      </div>
                      {del.description && <p className="text-xs text-text-secondary leading-relaxed mb-4">{del.description}</p>}
                      
                      {del.files && del.files.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-black/5">
                          {del.files.map((file: any) => (
                            <a key={file.id} href={`${file.file_url}?download=${encodeURIComponent(file.name)}`} download={file.name} className="inline-flex items-center gap-2 px-3 py-2 bg-white/50 border border-black/5 rounded-xl text-[11px] font-bold text-text-primary hover:bg-brand hover:text-white transition-all shadow-sm group/file">
                              <div className="w-6 h-6 rounded-lg bg-brand-gradient text-white flex items-center justify-center shrink-0 group-hover/file:bg-white group-hover/file:text-brand transition-colors">
                                {getFileIcon(file.name, file.file_url)}
                              </div>
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
        </section>

        {/* General Files */}
        {generalFiles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-text-primary font-bold flex items-center gap-2 mb-6 text-base">
              <div className="w-6 h-6 rounded-full bg-brand-soft c-brand flex items-center justify-center">
                <File size={16} />
              </div>
              Documentação Geral
            </h2>
            <div className="space-y-3">
              {generalFiles.map((file: any) => (
                <a key={file.id} href={`${file.file_url}?download=${encodeURIComponent(file.name)}`} download={file.name} className="flex items-center justify-between p-4 bg-white/50 border border-black/[0.03] rounded-2xl hover:bg-white transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-brand-gradient text-white flex items-center justify-center shadow-lg shadow-brand/10 group-hover:scale-105 transition-transform">
                      {getFileIcon(file.name, file.file_url)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider opacity-60">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-black/[0.1] flex items-center justify-center text-text-secondary group-hover:bg-brand group-hover:text-white group-hover:border-transparent transition-all">
                    <Download size={14} />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 flex flex-col items-center gap-4">
        <p className="text-[11px] font-medium text-text-secondary opacity-60">
          © {new Date().getFullYear()} {branding.agency_name || 'Agência'}. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-black/5 shadow-sm opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Powered by</span>
          <Image src="/SIGNER.png" alt="Signer" width={52} height={16} className="grayscale" />
        </div>
      </footer>
    </div>
  )
}
