'use client';

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Calendar, Zap, Layout, ArrowRight } from 'lucide-react'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { Variants } from 'framer-motion'

const transitionVariants: { container?: Variants; item?: Variants } = {
    item: {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.2,
            },
        },
    },
}

export function Features() {
    return (
        <section id="features" className="bg-[#F5F0E8] py-12 md:py-24">
            <div className="mx-auto max-w-7xl px-6">
                <AnimatedGroup variants={transitionVariants}>
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">
                            Ecossistema Completo
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">
                            O poder de uma agência, <br />
                            <span className="text-primary/60">na palma da sua mão.</span>
                        </h2>
                    </div>
                </AnimatedGroup>

                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-6">
                        {/* Card 1: Branding 100% */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-white border-none shadow-xl shadow-black/5 hover:translate-y-[-4px] transition-all duration-500">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <svg className="text-primary opacity-10 absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-black tracking-tighter text-text-primary">100%</span>
                                </div>
                                <h3 className="mt-6 text-center text-xl font-black uppercase tracking-widest text-text-primary">Customizável</h3>
                                <p className="text-center text-text-secondary text-sm mt-3 max-w-[200px] mx-auto font-medium">
                                    O seu logótipo, as suas cores. Portais White-Label que respiram a sua marca.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 2: Segurança */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white border-none shadow-xl shadow-black/5 hover:translate-y-[-4px] transition-all duration-500">
                            <CardContent className="pt-12">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-primary/10 bg-primary/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-primary/5">
                                    <Shield className="m-auto size-12 text-primary" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-8 space-y-3 text-center">
                                    <h3 className="text-xl font-black uppercase tracking-widest text-text-primary">Privacidade Total</h3>
                                    <p className="text-text-secondary text-sm font-medium">Os seus dados e os dos seus clientes estão protegidos por encriptação de elite.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: Dashboard em Tempo Real */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white border-none shadow-xl shadow-black/5 hover:translate-y-[-4px] transition-all duration-500">
                            <CardContent className="pt-6">
                                <div className="pt-6 lg:px-6">
                                    <svg className="text-primary w-full opacity-60" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="386" height="123" rx="10" />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                                            fill="currentColor"
                                            fillOpacity="0.1"
                                        />
                                        <path
                                            className="text-primary"
                                            d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-14 space-y-3 text-center">
                                    <h3 className="text-xl font-black uppercase tracking-widest text-text-primary">Gestão Visual</h3>
                                    <p className="text-text-secondary text-sm font-medium">Acompanhe métricas, prazos e o progresso dos projetos em tempo real.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 4: Milestones/Sync */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white border-none shadow-xl shadow-black/5 hover:translate-y-[-4px] transition-all duration-500">
                            <CardContent className="grid pt-12 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-primary/10 bg-primary/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-primary/5">
                                        <Zap className="m-auto size-6 text-primary" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-black uppercase tracking-widest text-text-primary">Aprovação Ágil</h3>
                                        <p className="text-text-secondary text-sm font-medium">Recolha a aprovação dos seus clientes em segundos com um único link exclusivo.</p>
                                    </div>
                                </div>
                                <div className="rounded-tl-[32px] relative -mb-6 -mr-6 mt-6 h-fit border-l border-t border-black/5 bg-[#F5F0E8]/40 p-6 py-6 sm:ml-6">
                                    <div className="absolute left-4 top-3 flex gap-1.5">
                                        <span className="block size-2 rounded-full bg-primary/20"></span>
                                        <span className="block size-2 rounded-full bg-primary/10"></span>
                                        <span className="block size-2 rounded-full bg-primary/5"></span>
                                    </div>
                                    <div className="mt-4 p-4 rounded-xl bg-white border border-black/5 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Layout className="size-4 text-primary" />
                                            </div>
                                            <div className="h-2 w-24 bg-black/5 rounded-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-black/5 rounded-full" />
                                            <div className="h-1.5 w-4/6 bg-black/5 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 5: Calendário Inteligente */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white border-none shadow-xl shadow-black/5 hover:translate-y-[-4px] transition-all duration-500">
                            <CardContent className="grid h-full pt-12 sm:grid-cols-2 gap-8">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border border-primary/10 bg-primary/5 before:absolute before:-inset-2 before:rounded-full before:border before:border-primary/5">
                                        <Calendar className="m-auto size-6 text-primary" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-black uppercase tracking-widest text-text-primary">Calendário Studio</h3>
                                        <p className="text-text-secondary text-sm font-medium">Controle prazos e marcos de entrega com uma visão cronológica inteligente.</p>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center py-6 border-l border-black/5 mt-6 sm:mt-0">
                                    <div className="grid grid-cols-7 gap-1.5 opacity-40">
                                        {Array.from({ length: 28 }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "size-3 rounded-[3px]",
                                                    i === 12 || i === 15 ? "bg-primary scale-125" : "bg-black/5",
                                                    i === 13 && "bg-primary/40"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <AnimatedGroup variants={transitionVariants}>
                    <div className="mt-16 flex justify-center">
                        <Button 
                            asChild
                            className="bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest px-10 h-14 rounded-2xl shadow-xl shadow-primary/20"
                        >
                            <a href="/auth/signup" className="flex items-center gap-2">
                                Experimentar o Signer Agora <ArrowRight className="size-4" />
                            </a>
                        </Button>
                    </div>
                </AnimatedGroup>
            </div>
        </section>
    )
}
