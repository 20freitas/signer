'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="bg-[#F5F0E8] min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-12 hover:opacity-70 transition-all">
          <ArrowLeft className="size-4" /> Voltar à Home
        </Link>
        
        <header className="mb-16">
          <Scale className="size-12 text-primary mb-6" strokeWidth={1} />
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-4">
            Termos de Serviço
          </h1>
          <p className="text-text-secondary font-medium">Última atualização: 2 de Abril, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none space-y-12 text-text-primary/80 font-medium">
          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">1. Aceitação dos Termos</h2>
            <p>
              Ao utilizar este website e ao inscrever-se na nossa lista de espera, concorda em cumprir e estar vinculado aos seguintes Termos de Serviço. Se não concordar com alguma parte destes termos, não deverá utilizar os nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">2. Regras da Lista de Espera</h2>
            <p>
              A inscrição na lista de espera não garante o acesso imediato à plataforma. O acesso será concedido por fases, seguindo critérios de ordem de inscrição e perfil de utilizador, a critério exclusivo do Signer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">3. Oferta de Lançamento (50% OFF)</h2>
            <p>
              A oferta de 50% de desconto nos primeiros dois meses é válida apenas para utilizadores que:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Se inscrevam com um e-mail válido antes da abertura pública.</li>
              <li>Utilizem o código de convite ou link enviado para esse e-mail no momento do registo.</li>
              <li>Ativem uma subscrição paga dentro dos primeiros 60 dias de lançamento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">4. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo presente neste website, incluindo textos, logótipos e design, é propriedade intelectual do Signer. É proibida qualquer reprodução ou utilização não autorizada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">5. Limitação de Responsabilidade</h2>
            <p>
              O Signer é fornecido "tal como está". Não garantimos que o serviço seja ininterrupto ou isento de erros. Não seremos responsáveis por quaisquer danos indiretos ou perda de dados decorrentes do uso da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">6. Alterações aos Termos</h2>
            <p>
              Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entrarão em vigor assim que publicadas no website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">7. Jurisdição</h2>
            <p>
              Estes termos são regidos pelas leis de Portugal. Qualquer disputa será resolvida nos tribunais competentes da jurisdição onde a sede do Signer estiver localizada.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
