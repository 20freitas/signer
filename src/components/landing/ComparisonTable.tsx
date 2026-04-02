'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    name: 'Portal de Marca Própria (White-label)',
    signer: true,
    drive: false,
    wetransfer: false,
    slack: false,
    asana: false,
  },
  {
    name: 'Aprovação do Cliente em 1 Clique',
    signer: true,
    drive: 'Manual',
    wetransfer: false,
    slack: 'Caótico',
    asana: 'Limitado',
  },
  {
    name: 'Ficheiros e Revisões num só lugar',
    signer: true,
    drive: false,
    wetransfer: false,
    slack: 'Caótico',
    asana: 'Tarefas',
  },
  {
    name: 'Calendário Visual de Estúdio',
    signer: true,
    drive: false,
    wetransfer: false,
    slack: false,
    asana: true,
  },
  {
    name: 'Segurança e Portal Privado para Clientes',
    signer: true,
    drive: 'Pastas Soltas',
    wetransfer: false,
    slack: false,
    asana: false,
  },
];

const competitors = [
  { id: 'signer', name: 'Signer', icon: '/SIGNER.png' },
  { id: 'drive', name: 'Drive / Dropbox' },
  { id: 'wetransfer', name: 'WeTransfer' },
  { id: 'slack', name: 'Slack / WhatsApp' },
  { id: 'asana', name: 'Trello / Asana' },
];

export function ComparisonTable() {
  return (
    <section id="comparison" className="bg-primary py-32 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-6 block">
            Análise Estratégica
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter max-w-4xl mx-auto">
            Porquê o Signer <br />
            <span className="text-white/40">vs ferramentas comuns?</span>
          </h2>
        </motion.div>

        <div className="relative overflow-x-auto rounded-[40px] border border-black/5 bg-[#F5F0E8] shadow-2xl shadow-black/10 p-4 md:p-8">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="p-8 text-black/40 font-black uppercase text-[11px] tracking-widest border-b border-black/5">Funcionalidade</th>
                {competitors.map((comp) => (
                  <th key={comp.id} className={cn(
                    "p-8 text-center border-b border-black/5 min-w-[160px] transition-all",
                    comp.id === 'signer' ? "bg-primary rounded-t-[32px] ring-1 ring-primary-light/10 shadow-2xl" : ""
                  )}>
                    <div className="flex flex-col items-center gap-3">
                        {comp.id === 'signer' ? (
                            <img src={comp.icon} alt="Signer Logo" className="h-7 w-auto invert brightness-0" />
                        ) : (
                            <span className="text-black font-black text-xs uppercase tracking-tighter opacity-40 leading-tight">
                                {comp.name}
                            </span>
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="group hover:bg-black/[0.03] transition-colors duration-200">
                  <td className="p-8 text-text-primary font-black text-lg tracking-tight border-b border-black/5 group-last:border-0 opacity-90">
                    {feature.name}
                  </td>
                  {competitors.map((comp) => {
                    const value = feature[comp.id as keyof typeof feature];
                    const isSigner = comp.id === 'signer';
                    return (
                      <td key={comp.id} className={cn(
                        "p-8 text-center border-b border-black/5 group-last:border-0 transition-all",
                        isSigner && "bg-primary"
                      )}>
                        <div className="flex justify-center">
                          {value === true ? (
                            <div className={cn(
                                "rounded-full p-2 shadow-lg",
                                isSigner ? "bg-white shadow-white/20" : "bg-black/[0.1]"
                            )}>
                                <Check className={cn(
                                    "size-4 stroke-[4px]",
                                    isSigner ? "text-primary" : "text-black/40"
                                )} />
                            </div>
                          ) : value === false ? (
                            <X className={cn(
                                "size-5",
                                isSigner ? "text-white/20" : "text-black/30"
                            )} />
                          ) : (
                            <span className={cn(
                                "text-[11px] font-black uppercase tracking-tighter px-4 py-2 rounded-xl whitespace-nowrap",
                                isSigner ? "text-white/70 bg-white/10" : "text-black/60 bg-black/[0.05]"
                            )}>
                                {value as string}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-8 border-t border-black/5" />
                <td className="bg-primary rounded-b-[32px] p-8 border-t border-black/5">
                    <div className="flex justify-center">
                         <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">O Único Completo</div>
                    </div>
                </td>
                {competitors.slice(1).map((_, i) => (
                    <td key={i} className="p-8 border-t border-black/5" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
           viewport={{ once: true }}
           className="mt-20 text-center"
        >
            <p className="text-white/60 font-medium text-lg">As ferramentas genéricas resolvem problemas isolados. O Signer resolve o seu <span className="text-white font-black underline decoration-white/20 underline-offset-8">Estúdio de Elite.</span></p>
        </motion.div>
      </div>
    </section>
  );
}
