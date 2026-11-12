import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenDemoBooking: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenDemoBooking,
  onOpenAdminLogin,
}) => {
  return (
    <footer className="bg-[#111113] border-t-2 border-[#111113] text-[#A1A1AA] text-xs pt-16 pb-12">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white text-[#111113] border-2 border-white shadow-[2px_2px_0px_#E63946]">
                <span className="font-heading font-black text-[#111113] text-base">MF</span>
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                  MATHS<span className="text-[#E63946]">FACT</span>
                </span>
                <div className="label text-[10px] text-[#E63946] font-bold uppercase font-mono">
                  Concept Coaching • By Satyam Sir
                </div>
              </div>
            </div>

            <p className="text-xs text-[#D4D4D8] leading-relaxed font-normal">
              Premier concept-based coaching in Dhanbad, Jharkhand for Mathematics, Science, and Social Science for CBSE &amp; ICSE students from Class III to XII. Dedicated to zero rote memorization and 100% concept mastery.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenDemoBooking}
                className="px-5 py-2.5 bg-[#E63946] hover:bg-[#c92a37] text-white font-mono font-bold text-xs uppercase tracking-wider border border-white transition-all shadow-[2px_2px_0px_#FFFFFF]"
              >
                1-Week Free Demo Class
              </button>
            </div>
          </div>

          {/* Quick Academic Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider text-[#E63946]">
              Academic Pages
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  [01] Home &amp; Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  [02] Teaching Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors"
                >
                  [03] Courses &amp; Batches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('3d-math-lab')}
                  className="hover:text-[#E63946] transition-colors text-white font-bold"
                >
                  ★ [04] 3D Math Solid Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('formula-rail')}
                  className="hover:text-[#E63946] transition-colors text-white font-bold"
                >
                  ★ [05] Formula Rail &amp; Speed Game
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('study-material')}
                  className="hover:text-white transition-colors"
                >
                  [06] Chapter Notes (100% Free)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('question-pdfs')}
                  className="hover:text-white transition-colors"
                >
                  [07] Question Bank &amp; PYQs (Free)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-white transition-colors"
                >
                  [08] Board Exam Results (98.4%)
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Access (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider text-[#E63946]">
              Mentor Access
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="text-amber-400 hover:text-white font-bold transition-colors flex items-center gap-1"
                >
                  &gt; Mentor Login (Satyam Sir)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDemoBooking}
                  className="text-[#A1A1AA] hover:text-white transition-colors"
                >
                  &gt; Free Demo Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#A1A1AA] hover:text-white transition-colors"
                >
                  &gt; Center Location Map
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider text-[#E63946]">
              Center Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Aanand+nagar+Lohar+Kulli+Dhanbad+Jharkhand+826007"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors text-[#D4D4D8]"
                  title="View on Google Maps"
                >
                  Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand - 826007
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href="tel:7004995470" className="hover:text-white font-mono text-[#D4D4D8]">
                  +91 7004995470 / 82941 12559
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/918294112559?text=Hello%20Satyam%20Sir,%20I%20am%20interested%20in%20Maths%20Fact%20coaching%20demo%20classes."
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-mono"
                >
                  WhatsApp: +91 82941 12559
                </a>
              </div>
              <div className="pt-1 text-[11px] font-mono text-[#71717A]">
                Center Hours: 02:00 PM - 08:00 PM (Mon - Sat)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#71717A]">
          <div>
            © {new Date().getFullYear()} MATHS FACT Concept Coaching • Satyam Sir • All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-[#A1A1AA]">
            <span>CBSE &amp; ICSE</span>
            <span>•</span>
            <span>Class III to XII</span>
            <span>•</span>
            <span className="text-white font-bold">Aanand nagar, Dhanbad 826007</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
