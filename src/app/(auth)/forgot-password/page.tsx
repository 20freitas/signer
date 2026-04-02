'use client';

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { resetPassword } from '@/app/actions/auth'
import { ArrowLeft, MailCheck } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)
    
    const result = await resetPassword(formData)
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
      setLoading(false)
    } else if (result?.success) {
      setMessage({ type: 'success', text: result.success })
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* Left Side: Premium Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src="/auth-hero.png" 
          alt="Studio Workspace" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
        
        {/* Quote Overlay */}
        <div className="absolute inset-0 flex items-end p-12 bg-gradient-to-t from-primary/60 to-transparent">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[40px] shadow-2xl max-w-lg">
                <p className="text-white text-2xl font-black tracking-tight leading-tight mb-6">
                    "Recuperar o acesso ao teu estúdio deve ser tão profissional como as tuas entregas."
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=12" alt="Sarah" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-black uppercase tracking-widest">Equipa Signer</p>
                        <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-none">Suporte de Elite</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Side: Recovery Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#F5F0E8]/40 overflow-hidden relative">
        <div className="w-full max-w-sm flex flex-col">
          {/* Centered Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/">
              <img src="/SIGNER.png" alt="Signer" className="h-10 w-auto brightness-0" />
            </Link>
          </div>

          <div className="mb-10 text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tighter text-text-primary italic italic">Recover access.</h2>
            <p className="text-text-secondary font-medium tracking-tight text-base">
                Insere o teu email para receberes instruções de recuperação.
            </p>
          </div>

          {message?.type === 'success' ? (
            <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center space-y-6 animate-in zoom-in duration-500">
                <div className="size-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-green-500/20">
                    <MailCheck className="size-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-black text-green-800 uppercase tracking-widest">Email Enviado</h3>
                    <p className="text-green-700/70 text-sm font-medium leading-relaxed">
                        {message.text}
                    </p>
                </div>
                <Link href="/login">
                    <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all mt-4">
                        Voltar ao Login
                    </Button>
                </Link>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-4">Email Address</label>
                    <div className="group flex items-center w-full bg-white border border-black/5 h-14 rounded-2xl overflow-hidden px-6 gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                        <svg width="18" height="13" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary opacity-40 shrink-0">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="currentColor"/>
                        </svg>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="ex: diogo@estudio.com" 
                            className="flex-1 bg-transparent text-text-primary placeholder-text-secondary/40 outline-none text-sm font-black h-full" 
                            required 
                        />
                    </div>
                </div>

                {message?.type === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                    <p className="text-xs font-black uppercase tracking-widest text-red-600 text-center">{message.text}</p>
                  </div>
                )}

                <div className="pt-2">
                    <Button type="submit" disabled={loading} className="w-full h-14 bg-primary hover:bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                        {loading ? "A processar..." : "Recuperar Conta"}
                    </Button>
                </div>
            </form>
          )}

          <div className="mt-10 flex justify-center">
            <Link href="/login" className="group flex items-center gap-2 text-text-secondary hover:text-primary transition-all">
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar ao Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
