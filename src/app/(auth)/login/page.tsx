'use client';

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (formData: FormData) => {
    setLoading(true)
    setError('')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Credenciais inválidas. Tente novamente.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
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
                    "O Signer mudou a forma como gerimos o nosso estúdio. A clareza nas entregas é outro nível."
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=32" alt="Sarah" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-black uppercase tracking-widest">Sarah C.</p>
                        <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-none">Creative Director</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Side: Elite Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#F5F0E8]/40 overflow-hidden relative">
        <div className="w-full max-w-sm flex flex-col">
          {/* Centered and Balanced Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/">
              <img src="/SIGNER.png" alt="Signer" className="h-10 w-auto brightness-0" />
            </Link>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black tracking-tighter text-text-primary mb-3 italic">Welcome back.</h2>
            <p className="text-text-secondary font-medium tracking-tight text-base">Coloca os teus dados para entrar no teu estúdio.</p>
          </div>

          <form action={login} className="space-y-6">
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
                  style={{ backgroundColor: 'transparent' }}
                  className="flex-1 bg-transparent text-text-primary placeholder-text-secondary/40 outline-none text-sm font-black h-full" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Password</label>
              </div>
              <div className="group flex items-center w-full bg-white border border-black/5 h-14 rounded-2xl overflow-hidden px-6 pr-2 gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                <svg width="16" height="19" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary opacity-40 shrink-0">
                    <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="currentColor"/>
                </svg>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••" 
                  style={{ backgroundColor: 'transparent' }}
                  className="flex-1 bg-transparent text-text-primary placeholder-text-secondary/40 outline-none text-sm font-black h-full" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-black/5 rounded-xl transition-all text-text-secondary opacity-40 hover:opacity-100"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" name="remember" className="peer appearance-none w-5 h-5 border-2 border-black/10 rounded-lg checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary group-hover:text-primary transition-colors">Lembrar-me (30 dias)</span>
              </label>
              <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline transition-all" href="/forgot-password">Esqueceu-se?</Link>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                <p className="text-xs font-black uppercase tracking-widest text-red-600 text-center">{error}</p>
              </div>
            )}

            <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full h-14 bg-primary hover:bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                    {loading ? "A entrar..." : "Entrar no Studio"}
                </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-text-secondary font-medium tracking-tight text-sm">
            Ainda não faz parte?{' '}
            <Link href="/signup" className="text-primary font-black uppercase text-xs tracking-[0.1em] hover:underline ml-2">
                Criar Conta Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
