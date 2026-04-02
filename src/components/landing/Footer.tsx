'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F0E8] border-t border-black/5 py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-24">
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="inline-block">
              <img src="/SIGNER.png" alt="Signer Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-text-secondary font-medium text-lg max-w-sm tracking-tight">
              O ecossistema definitivo para freelancers e agências que querem profissionalizar a gestão de projetos e a relação com os seus clientes.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 underline decoration-primary/20 underline-offset-8">
              Páginas
            </h4>
            <ul className="space-y-4">
              {['Funcionalidades', 'Comparativo', 'Testemunhos'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase() === 'comparativo' ? 'comparison' : item.toLowerCase()}`}
                    className="text-text-primary/60 hover:text-primary font-black uppercase text-[11px] tracking-widest transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 underline decoration-primary/20 underline-offset-8">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/legal/terms" 
                  className="text-text-primary/60 hover:text-primary font-black uppercase text-[11px] tracking-widest transition-colors"
                >
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal/privacy" 
                  className="text-text-primary/60 hover:text-primary font-black uppercase text-[11px] tracking-widest transition-colors"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary/40">
            © {currentYear} Signer Labs. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary/40 italic">
            Proudly built for Creative Minds.
          </div>
        </div>
      </div>
    </footer>
  );
}
