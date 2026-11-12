import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  GraduationCap,
  ShieldCheck,
  Star,
  MapPin,
  Box,
} from 'lucide-react';
import { Hero3DCanvas } from './Hero3DCanvas';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onOpenDemoBooking: () => void;
  onExploreRail: () => void;
  onExplore3DLab: () => void;
  onExploreMaterials: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDemoBooking,
  onExploreRail,
  onExplore3DLab,
  onExploreMaterials,
}) => {
  const [activeTab, setActiveTab] = useState<'3d-model' | 'faculty'>('3d-model');

  return (
    <section id="home" className="relative pt-48 sm:pt-40 lg:pt-36 pb-16 lg:pb-24 bg-[#F8F7F4] border-b-2 border-[#111113] overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Editorial Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Monospace Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <span className="w-2 h-2 bg-[#E63946]" />
              <span className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946]">
                [ ADMISSIONS 2026 • CBSE &amp; ICSE • DHANBAD ]
              </span>
            </div>

            {/* Giant Editorial Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-[#111113] tracking-tighter leading-[0.94]">
              Unlock True <br />
              <span className="text-[#E63946] underline decoration-4 underline-offset-8">
                Mathematical Thinking.
              </span>
            </h1>

            {/* Subtitle from Design Variation */}
            <p className="text-base sm:text-xl text-[#3F3F46] max-w-2xl font-normal leading-relaxed">
              Premier coaching for Class III-XII (CBSE &amp; ICSE). Led by <strong>Satyam Sir</strong>. We don't just teach, we build thinkers through step derivations, 3D visualization, and zero rote memorization.
            </p>

            {/* 3 Core Trust Criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-xl">
              <div className="flex items-center gap-2 p-2.5 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-xs font-mono uppercase font-bold text-[#111113]">
                <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>Formula Derivations</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-xs font-mono uppercase font-bold text-[#111113]">
                <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>Daily Doubt Solves</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-xs font-mono uppercase font-bold text-[#111113]">
                <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>Weekly Mock Tests</span>
              </div>
            </div>

            {/* High-Contrast Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-3">
              <button
                onClick={() => {
                  sound.playStreak();
                  onOpenDemoBooking();
                }}
                className="btn-ink flex items-center justify-center gap-2 text-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 1-Week Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playTick();
                  onExplore3DLab();
                }}
                className="btn-outline-ink flex items-center justify-center gap-2 text-xs"
              >
                <Box className="w-4 h-4 text-[#E63946]" />
                <span>Explore 3D Math Lab</span>
              </button>

              <button
                onClick={() => {
                  sound.playTick();
                  onExploreRail();
                }}
                className="btn-outline-ink flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#E63946]" />
                <span>3D Formula Rail</span>
              </button>
            </div>

            {/* Center Location Address */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-[#52525B]">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Aanand+nagar+Lohar+Kulli+Dhanbad+Jharkhand+826007"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#111113] text-[#111113] hover:text-[#E63946] hover:border-[#E63946] transition-colors"
                title="Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand 826007"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                <span className="font-bold underline">Aanand nagar, Lohar Kulli, Dhanbad - 826007</span>
              </a>
              <span className="text-[#A1A1AA] hidden sm:inline">•</span>
              <a
                href="tel:7004995470"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#111113] text-[#111113] hover:text-[#E63946] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#111113]" />
                <span className="font-bold">7004995470 / 8294112559</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Contrast 3D Showcase & Faculty Profile */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-[#111113] shadow-[8px_8px_0px_#111113] p-5 sm:p-6 space-y-4">
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#F8F7F4] border-2 border-[#111113]">
                <button
                  onClick={() => {
                    sound.playTick();
                    setActiveTab('3d-model');
                  }}
                  className={`py-2 px-3 text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === '3d-model'
                      ? 'bg-[#111113] text-[#F8F7F4]'
                      : 'text-[#111113] hover:bg-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>3D Polyhedra</span>
                </button>

                <button
                  onClick={() => {
                    sound.playTick();
                    setActiveTab('faculty');
                  }}
                  className={`py-2 px-3 text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'faculty'
                      ? 'bg-[#111113] text-[#F8F7F4]'
                      : 'text-[#111113] hover:bg-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Satyam Sir</span>
                </button>
              </div>

              {/* Tab 1: Interactive 3D WebGL Polyhedra */}
              {activeTab === '3d-model' ? (
                <div className="space-y-3">
                  <div className="relative border-2 border-[#111113] bg-[#111113] overflow-hidden p-1 shadow-[4px_4px_0px_#E63946]">
                    <Hero3DCanvas />

                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 border border-[#111113] text-[10px] font-mono font-bold text-[#111113] flex items-center gap-1.5 shadow-[2px_2px_0px_#111113]">
                      <span className="w-2 h-2 bg-[#E63946] animate-pulse" />
                      <span>Interactive 3D Solid (Orbit Cursor)</span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 px-2.5 py-1 border border-[#111113] text-[10px] font-mono font-bold text-[#111113] shadow-[2px_2px_0px_#111113]">
                      V - E + F = 2
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F7F4] border-2 border-[#111113] text-xs font-mono flex items-center justify-between">
                    <span className="text-[#111113] font-bold">Classroom 3D Spatial Geometry</span>
                    <button
                      onClick={() => {
                        sound.playTick();
                        onExplore3DLab();
                      }}
                      className="text-[#E63946] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open 3D Lab</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Tab 2: Faculty Profile & Trust Card */
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] flex flex-col items-center justify-center text-center p-1 shrink-0">
                      <GraduationCap className="w-6 h-6 text-[#E63946] mb-0.5" />
                      <span className="font-heading font-black text-white text-xs leading-none">
                        SATYAM
                      </span>
                      <span className="text-[10px] font-mono text-[#E63946] font-bold">SIR</span>
                    </div>

                    <div className="space-y-1">
                      <div className="label text-[10px]">
                        Senior Mathematics Faculty
                      </div>
                      <h3 className="font-heading font-black text-2xl text-[#111113]">Satyam Sir</h3>
                      <p className="text-xs text-[#52525B]">
                        10+ Years Experience • Concept Mastery &amp; Rigorous Step Derivation
                      </p>
                      <div className="flex items-center gap-1 text-[#E63946] text-xs pt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#E63946] text-[#E63946]" />
                        ))}
                        <span className="text-xs text-[#111113] font-mono font-bold ml-1">4.9 / 5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8F7F4] border-2 border-[#111113] space-y-1">
                    <span className="label text-[10px] block">
                      Our 100% Concept Clarity Guarantee
                    </span>
                    <p className="text-xs text-[#111113] leading-relaxed italic">
                      "Every formula has a logical story. When students see where a formula originates, fear disappears and full marks follow naturally."
                    </p>
                  </div>

                  {/* 4 Trust Stats Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-center">
                      <span className="font-mono font-black text-2xl text-[#111113] block">
                        1000+
                      </span>
                      <span className="text-[10px] font-mono text-[#52525B] uppercase">Students Mentored</span>
                    </div>

                    <div className="p-3 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-center">
                      <span className="font-mono font-black text-2xl text-[#E63946] block">
                        98.4%
                      </span>
                      <span className="text-[10px] font-mono text-[#52525B] uppercase">Highest Board Score</span>
                    </div>

                    <div className="p-3 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-center">
                      <span className="font-mono font-black text-2xl text-[#111113] block">
                        100%
                      </span>
                      <span className="text-[10px] font-mono text-[#52525B] uppercase">Concept Clarity</span>
                    </div>

                    <div className="p-3 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] text-center">
                      <span className="font-mono font-black text-2xl text-[#E63946] block">
                        1-Week
                      </span>
                      <span className="text-[10px] font-mono text-[#52525B] uppercase">Free Demo Class</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Action Footer */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playTick();
                    onOpenDemoBooking();
                  }}
                  className="flex-1 py-3 bg-[#111113] hover:bg-[#E63946] text-[#F8F7F4] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#111113] shadow-[3px_3px_0px_#111113] transition-all"
                >
                  Enroll / Book Free Demo
                </button>
                <a
                  href="https://wa.me/917004995470"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-[#111113] shadow-[3px_3px_0px_#111113] transition-colors"
                  title="WhatsApp Satyam Sir"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
