'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signup } from '@/app/actions/auth'
import { Eye, EyeOff, Check, X } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Password validation logic
  const passwordStatus = useMemo(() => {
    const p = formData.password;
    return {
      length: p.length >= 8 && p.length <= 16,
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      match: p === formData.confirmPassword && p.length > 0
    }
  }, [formData.password, formData.confirmPassword])

  const isPasswordValid = passwordStatus.length && passwordStatus.hasUpper && passwordStatus.hasLower && passwordStatus.hasNumber;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email) {
        setMessage('Por favor preencha todos os campos.')
        return
      }
      if (!formData.email.includes('@')) {
        setMessage('Por favor insira um email válido.')
        return
      }
      setMessage('')
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordValid) {
      setMessage('A palavra-passe não cumpre todos os requisitos de segurança.')
      return
    }

    if (!passwordStatus.match) {
      setMessage('As palavras-passe não coincidem.')
      return
    }

    setLoading(true)
    setMessage('')

    const submissionData = new FormData()
    submissionData.append('email', formData.email)
    submissionData.append('password', formData.password)
    submissionData.append('fullName', formData.fullName)

    const result = await signup(submissionData)
    
    if (result?.error) {
      setMessage(result.error)
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
                    "O Signer é o braço direito que todo o freelancer precisa para escalar com profissionalismo."
                </p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=11" alt="Tiago" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-black uppercase tracking-widest">Tiago R.</p>
                        <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-none">Independent Designer</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Side: Elite Multi-Step Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#F5F0E8]/40 overflow-hidden relative">
        
        {/* Progress Bar Container */}
        <div className="absolute top-0 left-0 w-full h-1 bg-black/5">
            <div 
                className="h-full bg-primary transition-all duration-700 ease-in-out" 
                style={{ width: `${(step / 2) * 100}%` }}
            />
        </div>

        <div className="w-full max-w-sm flex flex-col">
          {/* Centered and Balanced Logo */}
          <div className="flex justify-center mb-10">
            <Link href="/">
              <img src="/SIGNER.png" alt="Signer" className="h-10 w-auto brightness-0" />
            </Link>
          </div>

          <div className="mb-10 text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tighter text-text-primary italic">
                {step === 1 ? "Get started." : "Security check."}
            </h2>
            <p className="text-text-secondary font-medium tracking-tight text-base">
                {step === 1 
                    ? "Cria a tua conta e profissionaliza as tuas entregas hoje." 
                    : "Escolhe uma palavra-passe forte para o teu estúdio."}
            </p>
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); nextStep() } : handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-4">Nome Completo</label>
                  <div className="group flex items-center w-full bg-white border border-black/5 h-14 rounded-2xl overflow-hidden px-6 gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary opacity-40 shrink-0">
                        <path d="M20 21C20 19.6045 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8955 15.5 14.5 15.5H9.5C8.10448 15.5 7.40671 15.5 6.83892 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6045 4 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="ex: Diogo Freitas" 
                      className="flex-1 bg-transparent text-text-primary placeholder-text-secondary/40 outline-none text-sm font-black h-full" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-4">Email Address</label>
                  <div className="group flex items-center w-full bg-white border border-black/5 h-14 rounded-2xl overflow-hidden px-6 gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <svg width="18" height="13" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary opacity-40 shrink-0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="currentColor"/>
                    </svg>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ex: diogo@estudio.com" 
                      className="flex-1 bg-transparent text-text-primary placeholder-text-secondary/40 outline-none text-sm font-black h-full" 
                      required 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-4">Password</label>
                  <div className="group flex items-center w-full bg-white border border-black/5 h-14 rounded-2xl overflow-hidden px-6 pr-2 gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <svg width="16" height="19" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary opacity-40 shrink-0">
                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="currentColor"/>
                    </svg>
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••" 
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
                  
                  {/* Validation Requirements Checklist */}
                  <div className="grid grid-cols-2 gap-2 px-4 mt-2">
                    <RequirementItem label="8-16 carateres" met={passwordStatus.length} />
                    <RequirementItem label="Maiúscula" met={passwordStatus.hasUpper} />
                    <RequirementItem label="Minúscula" met={passwordStatus.hasLower} />
                    <RequirementItem label="Número" met={passwordStatus.hasNumber} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary ml-4">Confirmar Password</label>
                  <div className="group flex items-center w-full bg-white border border-black/5 h-14 rounded-2xl overflow-hidden px-6 pr-2 gap-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <svg width="16" height="19" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-secondary opacity-40 shrink-0">
                        <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="currentColor"/>
                    </svg>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••" 
                      className="flex-1 bg-transparent text-text-primary placeholder-text-secondary/40 outline-none text-sm font-black h-full" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-2 hover:bg-black/5 rounded-xl transition-all text-text-secondary opacity-40 hover:opacity-100"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordStatus.match && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-4">As passwords não coincidem</p>
                  )}
                </div>
              </div>
            )}

            {message && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-shake">
                <p className="text-xs font-black uppercase tracking-widest text-red-600 text-center">{message}</p>
              </div>
            )}

            <div className="pt-2 flex gap-4">
                {step === 2 && (
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="h-14 px-6 text-text-secondary font-black uppercase tracking-widest text-[10px] hover:bg-black/5 rounded-2xl transition-all"
                    >
                        Voltar
                    </button>
                )}
                <Button 
                    type="submit" 
                    disabled={loading || (step === 2 && (!isPasswordValid || !passwordStatus.match))}
                    className="flex-1 h-14 bg-primary hover:bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                    {loading ? "A processar..." : (step === 1 ? "Próximo Passo" : "Criar a minha Conta")}
                </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-text-secondary font-medium tracking-tight text-[11px]">
            Ao registar-se, concorda com os nossos <Link href="/legal/terms" className="underline">Termos</Link> e <Link href="/legal/privacy" className="underline">Privacidade</Link>.
          </p>

          <p className="mt-8 text-center text-text-secondary font-medium tracking-tight border-t border-black/5 pt-6 text-sm">
            Já faz parte da elite?{' '}
            <Link href="/login" className="text-primary font-black uppercase text-xs tracking-[0.1em] hover:underline ml-2">
                Entrar no Studio
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function RequirementItem({ label, met }: { label: string, met: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-3 rounded-full flex items-center justify-center transition-all ${met ? 'bg-green-500 text-white' : 'bg-black/5 text-transparent'}`}>
        <Check className="size-2" strokeWidth={4} />
      </div>
      <span className={`text-[10px] uppercase font-black tracking-widest transition-colors ${met ? 'text-green-600' : 'text-text-secondary opacity-40'}`}>
        {label}
      </span>
    </div>
  )
}
