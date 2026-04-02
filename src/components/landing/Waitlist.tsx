'use client';

import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { joinWaitlist } from '@/app/actions/waitlist';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WaitlistProps {
  initialCount: number;
}

export function Waitlist({ initialCount }: WaitlistProps) {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append('email', email);

    startTransition(async () => {
      const result = await joinWaitlist(formData);
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result.success) {
        setMessage({ type: 'success', text: result.success });
        setEmail('');
      }
    });
  }

  return (
    <section id="waitlist" className="bg-[#F5F0E8] py-32 px-6 relative overflow-hidden">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="bg-primary rounded-[48px] p-8 md:p-16 lg:p-24 relative overflow-hidden shadow-2xl shadow-primary/20">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Oferta de Lançamento</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-8">
                Junte-se à <br />
                <span className="text-white/40">Elite Criativa.</span>
              </h2>
              <div className="space-y-6">
                 <p className="text-white/80 text-lg font-medium tracking-tight">
                    Inscreva-se hoje para ter acesso prioritário e garantir <span className="text-white font-black underline decoration-white/20 underline-offset-8">50% de desconto</span> nos primeiros dois meses de lançamento.
                 </p>
                 
                 <div className="flex items-center gap-4 pt-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                             <div key={i} className="size-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center overflow-hidden relative">
                                <Image src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User avatar" width={40} height={40} className="object-cover" />
                            </div>
                        ))}
                    </div>
                    <div className="text-white">
                        <span className="block text-2xl font-black tracking-tighter">
                            +{initialCount + 27} Criativos
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Já garantiram acesso antecipado</span>
                    </div>
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="seu@emai.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 h-16 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-white hover:bg-white/90 text-primary h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-black/10 transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isPending ? 'A Processar...' : (
                        <>Garantir os Meus 50% <ArrowRight className="size-4" /></>
                    )}
                  </Button>
                </form>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mt-6 p-4 rounded-xl flex items-start gap-3",
                      message.type === 'success' ? "bg-green-500/20 text-green-200 border border-green-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"
                    )}
                  >
                    {message.type === 'success' && <CheckCircle2 className="size-5 shrink-0" />}
                    <p className="text-sm font-medium">{message.text}</p>
                  </motion.div>
                )}
                
                <p className="mt-6 text-center text-white/30 text-[10px] font-medium uppercase tracking-[0.1em]">
                    Seja um dos primeiros e mude o seu estúdio hoje.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
