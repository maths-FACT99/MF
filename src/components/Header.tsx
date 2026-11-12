import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Sparkles,
  Shield,
  LogOut,
  Menu,
  X,
  Calendar,
  Edit3,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Box,
} from 'lucide-react';
import { UserSession } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  session: UserSession;
  onOpenAdminLogin: () => void;
  onOpenDemoBooking: () => void;
  onLogout: () => void;
  onGoToDashboard: () => void;
}

interface NavItem {
  id: string;
  label: string;
  mobileLabel: string;
  is3D?: boolean;
  isHighlight?: boolean;
  editable?: boolean;
  tier: 1 | 2;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  session,
  onOpenAdminLogin,
  onOpenDemoBooking,
  onLogout,
  onGoToDashboard,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 11 Core Navigation Items categorized with mobile-friendly labels and edit markers
  const navItems: NavItem[] = [
    // Tier 1: Core Overview, Academics & Admissions
    { id: 'home', label: 'Home', mobileLabel: 'Home', tier: 1 },
    { id: 'about', label: 'About', mobileLabel: 'About', tier: 1 },
    { id: 'courses', label: 'Courses', mobileLabel: 'Courses', editable: true, tier: 1 },
    { id: 'faculty', label: 'Faculty', mobileLabel: 'Faculty', editable: true, tier: 1 },
    { id: 'results', label: 'Results', mobileLabel: 'Results', editable: true, tier: 1 },
    { id: 'demo-section', label: 'Free Demo', mobileLabel: '★ Demo', isHighlight: true, tier: 1 },

    // Tier 2: 3D Interactive Labs, Public Vaults & Center Contact
    { id: '3d-math-lab', label: '3D Math Lab', mobileLabel: '3D Lab', is3D: true, tier: 2 },
    { id: 'formula-rail', label: 'Formula Rail', mobileLabel: 'Rail 3D', is3D: true, tier: 2 },
    { id: 'study-material', label: 'Study Notes', mobileLabel: 'Notes', editable: true, tier: 2 },
    { id: 'question-pdfs', label: 'Question PDFs', mobileLabel: 'PYQs', editable: true, tier: 2 },
    { id: 'contact', label: 'Contact', mobileLabel: 'Contact', editable: true, tier: 2 },
  ];

  const handleNavClick = (id: string) => {
    sound.playTick();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const isMentor = session.role === 'mentor';

  return (
    <>
      <header
        style={{ paddingBottom: '24px' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-2 border-[#111113] bg-[#F8F7F4]/98 backdrop-blur-md overflow-x-hidden ${
          isScrolled ? 'pt-2 shadow-sm' : 'pt-2.5 sm:pt-3'
        }`}
      >
        <div className="max-w-[1720px] w-full mx-auto px-2 sm:px-6 lg:px-8 space-y-2">
          {/* Top Tier: Brand Logo, Quick Helplines, and Actions */}
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            {/* Brand Logo Container */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
            >
              <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-[#111113] text-[#F8F7F4] border-2 border-[#111113] shadow-[2px_2px_0px_#E63946] group-hover:bg-[#E63946] transition-colors">
                <span className="font-heading font-black text-xs sm:text-base tracking-tight">
                  MF
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-heading font-extrabold text-lg sm:text-2xl tracking-tighter text-[#111113]">
                    MATHS<span className="text-[#E63946]">FACT</span>
                  </span>
                  <span className="hidden sm:inline-block font-mono text-[9px] uppercase px-1.5 py-0.5 bg-black text-white font-bold border border-black tracking-wider">
                    CBSE • ICSE
                  </span>
                </div>
                <div className="label text-[9px] sm:text-[11px] font-mono tracking-widest text-[#E63946] truncate max-w-[200px] sm:max-w-none">
                  Aanand nagar, Dhanbad • Est. 2026
                </div>
              </div>
            </div>

            {/* Right Action Utilities & Access Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Direct Quick Helpline Link */}
              <a
                href="tel:7004995470"
                title="Call Satyam Sir: 7004995470"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-[#111113] text-xs font-mono font-bold border-2 border-[#111113] shadow-[2px_2px_0px_#111113] hover:bg-[#F8F7F4] transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                <span>7004995470</span>
              </a>

              {/* WhatsApp direct chat link with updated 82941 12559 */}
              <a
                href="https://wa.me/918294112559?text=Hello%20Satyam%20Sir,%20I%20am%20interested%20in%20Maths%20Fact%20concept%20coaching%20demo%20classes%20in%20Dhanbad."
                target="_blank"
                rel="noreferrer"
                title="Chat with Satyam Sir on WhatsApp: 82941 12559"
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-mono text-[11px] font-bold">82941 12559</span>
              </a>

              {/* 99mathsfact pro link */}
              <a
                href="https://ai.studio/apps/4c4c142b-2046-4537-a3be-4cafbe1ebb98"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playStreak()}
                className="group px-2.5 sm:px-3 py-1.5 bg-[#111113] hover:bg-[#E63946] text-[#F8F7F4] font-mono font-bold text-xs border-2 border-[#111113] shadow-[2px_2px_0px_#E63946] transition-all flex items-center gap-1.5 shrink-0"
                title="Open 99mathsfact pro"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E63946] group-hover:text-white transition-colors" />
                <span className="tracking-wider uppercase hidden sm:inline">99mathsfact pro</span>
                <span className="text-[9px] px-1 bg-[#E63946] group-hover:bg-[#111113] text-white font-mono uppercase">
                  3D
                </span>
              </a>

              {/* Free Demo CTA */}
              <button
                onClick={() => {
                  sound.playStreak();
                  onOpenDemoBooking();
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#E63946] hover:bg-[#c92a37] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-all whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Free Demo</span>
              </button>

              {/* Mentor Login / Status Controls */}
              {!isMentor ? (
                <button
                  onClick={() => {
                    sound.playTick();
                    onOpenAdminLogin();
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-amber-100 text-[#111113] font-mono font-bold text-xs uppercase border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Mentor <span className="hidden sm:inline">Login</span></span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      sound.playTick();
                      onGoToDashboard();
                    }}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-300 text-black font-mono text-xs font-bold border-2 border-[#111113] shadow-[2px_2px_0px_#111113] hover:bg-amber-400"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#111113]" />
                    <span className="truncate max-w-[80px] sm:max-w-none">Satyam Sir</span>
                    <span className="text-[9px] px-1 bg-[#111113] text-white uppercase hidden sm:inline">
                      EDIT MODE
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playTick();
                      onLogout();
                    }}
                    title="Sign Out Mentor"
                    className="p-1.5 sm:p-2 bg-white hover:bg-[#E63946] hover:text-white text-[#111113] border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 bg-white text-[#111113] border-2 border-[#111113] shadow-[2px_2px_0px_#111113]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ========================================================
              UPGRADED MENTOR EDIT MODE ACTIVE CONTROL DECK
              ======================================================== */}
          {isMentor && (
            <div className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-100 border-2 border-[#111113] shadow-[3px_3px_0px_#111113] p-2 sm:px-3 sm:py-2 text-[#111113] font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 transition-all">
              {/* Left Indicator & Tenet */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111113] text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-[#111113]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>MENTOR EDIT MODE ACTIVE</span>
                </span>

                <span className="text-[11px] font-bold text-[#111113] hidden sm:inline">
                  Satyam Sir: Live in-place editing unlocked on sections below
                </span>

                {/* Quick Section Jump Pills for Mentor */}
                <div className="flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="text-[#111113]/70 font-bold hidden xl:inline">Jump to edit:</span>
                  {[
                    { id: 'faculty', label: 'Faculty' },
                    { id: 'results', label: 'Results' },
                    { id: 'contact', label: 'Contact' },
                    { id: 'courses', label: 'Batches' },
                    { id: 'question-pdfs', label: 'PYQs' },
                    { id: 'study-material', label: 'Notes' },
                  ].map((target) => (
                    <button
                      key={target.id}
                      onClick={() => handleNavClick(target.id)}
                      className="px-1.5 py-0.5 bg-white hover:bg-[#111113] hover:text-white border border-[#111113] text-[#111113] font-bold text-[10px] transition-colors shadow-[1px_1px_0px_#111113]"
                    >
                      ✏️ {target.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right CTA Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => onGoToDashboard()}
                  className="px-3 py-1 bg-[#111113] hover:bg-[#E63946] text-white font-mono font-bold text-[11px] uppercase border border-[#111113] shadow-[2px_2px_0px_#111113] flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3 h-3 text-amber-300" />
                  <span>Mentor Console &amp; Google Docs</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Exit Edit Mode"
                  className="px-2 py-1 bg-white hover:bg-red-50 text-red-900 border border-[#111113] font-bold text-[10px] uppercase shadow-[1px_1px_0px_#111113] transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              UPGRADED MENUBAR INTERFACE (ZERO HORIZONTAL SCROLL)
              ======================================================== */}
          {/* 1. Desktop & Large Screens: Sleek Unified 11-Item Strip (lg and above) */}
          <nav className="hidden lg:block w-full bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] p-1">
            <div className="grid grid-cols-11 gap-1 w-full">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-1.5 px-1 text-center text-[11px] xl:text-xs font-mono uppercase font-bold transition-all flex items-center justify-center gap-1 border ${
                      isActive
                        ? 'bg-[#111113] text-[#F8F7F4] border-[#111113] shadow-[2px_2px_0px_#E63946]'
                        : item.isHighlight
                        ? 'text-[#E63946] border-[#E63946]/40 hover:bg-[#F8F7F4]'
                        : 'text-[#111113] border-transparent hover:bg-[#F8F7F4] hover:border-[#111113]'
                    }`}
                  >
                    {item.is3D && (
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E63946]"></span>
                      </span>
                    )}

                    <span className="truncate">{item.label}</span>

                    {item.is3D && (
                      <span className="text-[8px] font-mono px-0.5 bg-[#E63946] text-white shrink-0">
                        3D
                      </span>
                    )}

                    {isMentor && item.editable && (
                      <span
                        title="In-Place Editable"
                        className="text-[9px] text-amber-600 font-bold shrink-0"
                      >
                        ✏️
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 2. Mobile & Tablet Screens: Clean 2-Deck Compact Menubar with ZERO SCROLL (< lg) */}
          <nav className="block lg:hidden w-full bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113] p-1 space-y-1">
            {/* Deck Row 1: Core Navigation & Admissions (6 buttons evenly distributed) */}
            <div className="grid grid-cols-6 gap-1 w-full">
              {navItems
                .filter((item) => item.tier === 1)
                .map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`py-1.5 px-0.5 text-center text-[10px] sm:text-[11px] font-mono uppercase font-bold transition-all border flex items-center justify-center gap-0.5 ${
                        isActive
                          ? 'bg-[#111113] text-[#F8F7F4] border-[#111113] shadow-[1px_1px_0px_#E63946]'
                          : item.isHighlight
                          ? 'text-[#E63946] bg-red-50 border-[#E63946]/40 hover:bg-red-100'
                          : 'text-[#111113] border-gray-200 hover:border-[#111113] bg-[#F8F7F4]'
                      }`}
                    >
                      <span className="truncate">{item.mobileLabel}</span>
                      {isMentor && item.editable && (
                        <span className="text-[8px] text-amber-700">✏️</span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Deck Row 2: 3D Simulations, Public Vaults & Contact (5 buttons evenly distributed) */}
            <div className="grid grid-cols-5 gap-1 w-full">
              {navItems
                .filter((item) => item.tier === 2)
                .map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`py-1.5 px-0.5 text-center text-[10px] sm:text-[11px] font-mono uppercase font-bold transition-all border flex items-center justify-center gap-0.5 ${
                        isActive
                          ? 'bg-[#111113] text-[#F8F7F4] border-[#111113] shadow-[1px_1px_0px_#E63946]'
                          : item.is3D
                          ? 'text-[#111113] bg-amber-50/50 border-amber-300/60 hover:bg-amber-100'
                          : 'text-[#111113] border-gray-200 hover:border-[#111113] bg-[#F8F7F4]'
                      }`}
                    >
                      {item.is3D && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E63946] shrink-0" />
                      )}
                      <span className="truncate">{item.mobileLabel}</span>
                      {isMentor && item.editable && (
                        <span className="text-[8px] text-amber-700">✏️</span>
                      )}
                    </button>
                  );
                })}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer - Alternative Zero-Scroll List */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#111113]/70 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <div className="fixed top-24 right-0 bottom-0 w-84 max-w-full bg-[#F8F7F4] border-l-2 border-[#111113] p-5 overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              {/* Profile Card if Logged in as Mentor */}
              {isMentor ? (
                <div className="p-3 bg-amber-200 border-2 border-[#111113] shadow-[2px_2px_0px_#111113] space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="label text-[10px] text-[#111113] font-bold">
                      MENTOR MODE ACTIVE
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#111113] text-white uppercase">
                      Satyam Sir
                    </span>
                  </div>
                  <div className="text-xs text-black font-bold">
                    Direct in-place editing active on all site sections
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onGoToDashboard();
                      }}
                      className="flex-1 py-1.5 bg-[#111113] hover:bg-[#E63946] text-white font-mono font-bold text-xs uppercase"
                    >
                      Mentor Console
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="p-1.5 bg-white text-[#111113] border-2 border-[#111113]"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminLogin();
                    }}
                    className="w-full py-2.5 px-3 bg-[#111113] text-white border-2 border-[#111113] font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#E63946]"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#E63946]" />
                    Mentor Login (Satyam Sir)
                  </button>
                </div>
              )}

              {/* Navigation Links - 2 Column Grid for Zero Scroll */}
              <div className="space-y-1.5">
                <div className="label text-[10px] mb-1 font-mono font-bold text-[#E63946]">
                  [ DIRECT PAGE LINKS ]
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between px-2.5 py-2 text-[11px] font-mono uppercase font-bold transition-all border ${
                        activeSection === item.id
                          ? 'bg-[#111113] text-[#F8F7F4] border-[#111113]'
                          : 'text-[#111113] bg-white border-[#111113] hover:bg-[#F8F7F4]'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.is3D && (
                        <span className="text-[8px] font-mono px-1 bg-[#E63946] text-white shrink-0">
                          3D
                        </span>
                      )}
                      {isMentor && item.editable && (
                        <span className="text-[9px] text-amber-700">✏️</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Contact Help & Demo CTA */}
            <div className="pt-4 border-t-2 border-[#111113] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemoBooking();
                }}
                className="w-full py-2.5 bg-[#E63946] hover:bg-[#c92a37] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#111113] shadow-[2px_2px_0px_#111113] flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book 1-Week Free Demo
              </button>

              <div className="flex items-center gap-2">
                <a
                  href="tel:7004995470"
                  className="flex-1 py-2 bg-white text-[#111113] font-mono font-bold text-xs border-2 border-[#111113] flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                  7004995470
                </a>
                <a
                  href="https://wa.me/918294112559?text=Hello%20Satyam%20Sir,%20I%20am%20interested%20in%20Maths%20Fact%20concept%20coaching%20demo%20classes%20in%20Dhanbad."
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp Satyam Sir: 82941 12559"
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-[#111113]"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
