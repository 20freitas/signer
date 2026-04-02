'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialsColumn, Testimonial } from '@/components/ui/testimonials-columns';

const testimonials: Testimonial[] = [
  {
    text: "Finalmente uma solução white-label que parece mesmo nossa. Os clientes adoram a experiência e a confiança de estarem num portal privado.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Duarte Mendes",
    role: "Creative Director em Studio D",
  },
  {
    text: "O Signer profissionalizou o meu processo de entrega. Adeus links de WeTransfer e e-mails perdidos. Agora tudo está centralizado.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Sofia Lima",
    role: "Freelance Brand Designer",
  },
  {
    text: "Poupamos 10 horas por semana em gestão de projetos. O dashboard visual é essencial para termos uma visão clara do estado do estúdio.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Ricardo Jorge",
    role: "Founder da Vibe Agency",
  },
  {
    text: "A sincronia de marcos de projeto com o cliente nunca foi tão fácil. Basta um link para partilhar aprovações e ficheiros finais.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Ana Catarina",
    role: "Lead Designer em Pixel Flow",
  },
  {
    text: "Segurança total na partilha. O portal de cliente privado dá uma confiança tremenda aos nossos parceiros mais premium.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Tiago Ferreira",
    role: "Founder do Nexus Studio",
  },
  {
    text: "Interface limpa, rápida e extremamente intuitiva. Os meus clientes elogiam a facilidade com que aprovam as revisões.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Beatriz Rocha",
    role: "Freelancer UI/UX",
  },
  {
    text: "Centralizamos 100% da comunicação. Acabou o caos nas mensagens de WhatsApp e ficheiros soltos em pastas partilhadas.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Miguel Santos",
    role: "Operations Manager",
  },
  {
    text: "O calendário de estúdio permite-me ver toda a carga de trabalho num piscar de olhos. Essencial para planeamento a longo prazo.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Inês Antunes",
    role: "Brand Strategist",
  },
  {
    text: "Entregas rápidas, revisões organizadas. O Signer é o assistente digital que o meu estúdio precisava para escalar.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop",
    name: "Gonçalo Costa",
    role: "Motion Designer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#F5F0E8] py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center"
        >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">
                Prova Social de Elite
            </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
            O que os líderes <br />
            <span className="text-primary/60">criativos dizem.</span>
          </h2>
          <p className="mt-8 text-lg text-text-secondary font-medium tracking-tight">
            Descubra como o Signer está a transformar o dia-a-dia de agências e freelancers <br className="hidden md:block" /> em todo o país.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-20 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[800px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
        </div>
      </div>
    </section>
  );
}
