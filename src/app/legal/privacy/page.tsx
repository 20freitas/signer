'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="bg-[#F5F0E8] min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-12 hover:opacity-70 transition-all">
          <ArrowLeft className="size-4" /> Voltar à Home
        </Link>
        
        <header className="mb-16">
          <Shield className="size-12 text-primary mb-6" strokeWidth={1} />
          <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-4">
            Política de Privacidade
          </h1>
          <p className="text-text-secondary font-medium">Última atualização: 2 de Abril, 2026</p>
        </header>

        <article className="prose prose-slate max-w-none space-y-12 text-text-primary/80 font-medium">
          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">1. Introdução</h2>
            <p>
              O Signer (&quot;nós&quot;, &quot;nosso&quot;) está empenhado em proteger a privacidade dos seus utilizadores. Esta Política de Privacidade descreve como recolhemos, utilizamos e protegemos a sua informação pessoal quando se inscreve na nossa lista de espera (&quot;Waitlist&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">2. Dados Recolhidos</h2>
            <p>
              Para efeitos de inscrição na Waitlist, recolhemos o seu endereço de e-mail. Estes dados são submetidos voluntariamente por si. Podemos também recolher dados analíticos anónimos (como o seu endereço IP e tipo de browser) para melhorar a performance da nossa landing page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">3. Finalidade do Processamento</h2>
            <p>
              Utilizamos o seu e-mail exclusivamente para:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Notificá-lo sobre o lançamento oficial do Signer.</li>
              <li>Enviar a sua recompensa de 50% de desconto (Early Bird Access).</li>
              <li>Comunicar atualizações críticas sobre o estado da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">4. Base Legal</h2>
            <p>
              O processamento dos seus dados baseia-se no seu <strong>consentimento explícito</strong>, fornecido ao submeter o seu e-mail no nosso formulário de inscrição.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">5. Segurança e Retenção</h2>
            <p>
              Os seus dados são armazenados de forma cifrada na infraestrutura do <strong>Supabase</strong>. Manteremos os seus dados apenas enquanto forem necessários para os fins descritos, ou até que solicite a sua eliminação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">6. Partilha de Dados</h2>
            <p>
              Não vendemos, trocamos nem partilhamos os seus dados pessoais com entidades externas para fins de marketing. Poderemos partilhar dados estritamente limitados com fornecedores de serviços (como o alojamento da base de dados) essenciais para a operação do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">7. Os seus Direitos (RGPD)</h2>
            <p>
              Ao abrigo do Regulamento Geral de Proteção de Dados (RGPD), tem o direito de:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Aceder à sua informação guardada.</li>
                <li>Retificar qualquer dado incorreto.</li>
                <li>Solicitar o esquecimento (eliminação permanente).</li>
                <li>Retirar o seu consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase text-xs tracking-widest text-primary">8. Contacto</h2>
            <p>
              Para qualquer questão sobre a sua privacidade, contacte-nos através do e-mail oficial do Studio Signer.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
