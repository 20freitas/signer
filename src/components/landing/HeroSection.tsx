'use client';

import React from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { Variants } from 'framer-motion'

const transitionVariants: { container?: Variants; item?: Variants } = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection({ user }: { user: User | null }) {
    return (
        <>
            <HeroHeader user={user} />
            <main className="overflow-x-hidden bg-background">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-30 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,#5B4FE8e0_0,#5B4FE805_50%,transparent_80%)]" />
                </div>
                
                <section className="relative">
                    <div className="relative pt-32 md:pt-48">
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto">
                                <AnimatedGroup variants={transitionVariants}>
                                    <div className="flex justify-center mb-8">
                                       <Link
                                           href={user ? "/dashboard" : "/signup"}
                                           className="hover:bg-white/80 bg-white/40 backdrop-blur-sm group flex w-fit items-center gap-4 rounded-full border border-black/5 p-1 pl-4 shadow-sm transition-all duration-300">
                                           <span className="text-text-primary text-xs font-black uppercase tracking-widest">
                                               {user ? "Bem-vindo de volta ao Studio" : "Novo: Portal de Marca Própria"}
                                           </span>
                                           <div className="bg-primary size-7 overflow-hidden rounded-full duration-500 flex items-center justify-center text-white">
                                               <ArrowRight className="size-4" />
                                           </div>
                                       </Link>
                                    </div>
                        
                                    <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-text-primary">
                                        A sua agência em <span className="text-primary">piloto automático.</span>
                                    </h1>
                                    
                                    <p className="mx-auto mt-8 max-w-2xl text-balance text-lg md:text-xl text-text-secondary leading-relaxed font-medium">
                                        A plataforma definitiva para freelancers e estúdios criativos. 
                                        Centralize clientes, projetos e entregas numa interface incrivelmente limpa.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: 0.8,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <Button
                                        asChild
                                        size="xl"
                                        className="rounded-2xl px-10 h-14 text-lg font-black bg-primary hover:bg-primary-light shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                        <Link href={user ? "/dashboard" : "/signup"}>
                                            <span>{user ? "Ir para o Dashboard" : "Começar Agora"}</span>
                                        </Link>
                                    </Button>
                                    
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="xl"
                                        className="h-14 rounded-2xl px-8 text-lg font-black hover:bg-black/5">
                                        <Link href="#features">
                                            <span className="flex items-center gap-2 text-text-secondary">Ver Funcionalidades <ChevronRight className="size-5" /></span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        {/* Dashboard Image Display */}
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 1.2,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="relative mt-20 max-w-6xl mx-auto px-4 lg:px-0 pb-16">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/10 rounded-[40px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
                                <div className="relative bg-white rounded-[32px] border border-black/5 p-3 shadow-2xl shadow-primary/5 ring-1 ring-black/5 overflow-hidden translate-y-0 group-hover:-translate-y-2 transition-transform duration-700">
                                    <Image
                                        className="w-full h-auto rounded-[24px]"
                                        src="/dashboard-screenshot.png"
                                        alt="Signer Dashboard Real Interface"
                                        width={1200}
                                        height={800}
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>

            </main>
        </>
    )
}

const menuItems = [
    { name: 'Funcionalidades', href: '#features' },
    { name: 'Comparativo', href: '#comparison' },
    { name: 'Testemunhos', href: '#testimonials' },
]

const HeroHeader = ({ user }: { user: User | null }) => {
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
            <nav
                className={cn(
                    "mx-auto flex h-16 items-center justify-between rounded-3xl border border-black/5 bg-white/70 px-6 shadow-sm backdrop-blur-xl transition-all duration-500 pointer-events-auto",
                    isScrolled ? "max-w-4xl px-4 h-14" : "max-w-6xl"
                )}>
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image 
                            src="/SIGNER.png" 
                            alt="Signer Logo" 
                            width={120}
                            height={40}
                            className={cn("w-auto brightness-0", isScrolled ? "h-6 md:h-7" : "h-9 md:h-10")}
                        />
                    </Link>

                    <ul className="hidden lg:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors",
                                        isScrolled && "text-[9px]"
                                    )}>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link href="/dashboard">
                            <Button className={cn("bg-primary hover:bg-primary-light text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20", isScrolled ? "px-5 h-9 text-xs" : "px-8 h-11")}>
                                Ir para o Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className={cn("text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary px-4 hover:text-text-primary hidden md:block")}>
                                Entrar
                            </Link>
                            <Link href="/signup">
                                <Button className={cn("bg-primary hover:bg-primary-light text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20", isScrolled ? "px-5 h-9 text-xs" : "px-8 h-11")}>
                                    Criar Conta
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}
