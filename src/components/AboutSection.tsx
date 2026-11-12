import React from 'react';
import {
  Compass,
  Lightbulb,
  HelpCircle,
  FileCheck2,
  GraduationCap,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Compass,
      title: 'First-Principles Derivations',
      desc: 'We never ask students to memorize a formula before proving it from geometric axioms or algebraic roots. When you know why a theorem holds, recall is instantaneous.',
    },
    {
      icon: Lightbulb,
      title: 'Real-World Visualization',
      desc: 'Quadratic equations become bridge suspension arches, trigonometry maps GPS satellites, and light refraction explains optical fibers. Math becomes exciting and intuitive.',
    },
    {
      icon: FileCheck2,
      title: 'Board Step Presentation Discipline',
      desc: 'CBSE and ICSE examiners award step marks. We train students on exact statement framing, geometric theorem quotes, and neat calculation layout to secure 100/100.',
    },
    {
      icon: HelpCircle,
      title: 'No Question is "Silly" Policy',
      desc: 'A student who hesitates to ask cannot grow. Satyam Sir conducts daily dedicated doubt clearance where students ask questions freely without judgment.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-16 space-y-3">
          <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
            <GraduationCap className="w-3.5 h-3.5 text-[#E63946]" />
            <span>[ THE TEACHING METHODOLOGY ]</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
            How Satyam Sir Transforms{' '}
            <span className="text-[#E63946]">Math Fear into Mastery</span>
          </h2>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            Most students struggle not because mathematics is difficult, but because conventional schools force formula cramming without concept intuition. At <strong className="text-[#111113]">MATHS FACT</strong>, every topic is dismantled into simple, logical building blocks.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-[#111113] border-2 border-[#111113] shadow-[8px_8px_0px_#111113]">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="group bg-[#F8F7F4] hover:bg-white p-6 sm:p-8 transition-colors flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#E63946]">
                      PILLAR 0{idx + 1}
                    </span>
                    <div className="w-10 h-10 bg-[#111113] text-white flex items-center justify-center border border-[#111113] group-hover:bg-[#E63946] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading font-black text-xl text-[#111113] group-hover:text-[#E63946] transition-colors leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#111113]/10 font-mono text-[11px] uppercase tracking-wider text-[#111113] font-bold">
                  Zero Rote Learning
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
