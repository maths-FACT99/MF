import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CoursesSection } from './components/CoursesSection';
import { ThreeMathLab } from './components/ThreeMathLab';
import { FormulaRailSection } from './components/FormulaRailSection';
import { FacultySection } from './components/FacultySection';
import { ResultsSection } from './components/ResultsSection';
import { StudyMaterialSection } from './components/StudyMaterialSection';
import { QuestionPdfsSection } from './components/QuestionPdfsSection';
import { ContactSection } from './components/ContactSection';
import { FreeDemoPage } from './components/FreeDemoPage';
import { Footer } from './components/Footer';
import { PdfModalViewer } from './components/PdfModalViewer';
import { FreeDemoModal } from './components/FreeDemoModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { storageService } from './services/storageService';
import { UserSession, StudyMaterialItem, QuestionPdfItem } from './types';
import { sound } from './utils/audio';
import {
  BookOpen,
  Box,
  Compass,
  GraduationCap,
  Award,
  FileText,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Home,
} from 'lucide-react';

interface PageInfo {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  is3D?: boolean;
}

const PAGE_CONFIG: Record<string, PageInfo> = {
  about: {
    id: 'about',
    title: 'Teaching Methodology',
    subtitle: 'First-principles derivations, real-world visualization, and zero rote memorization.',
    category: 'Pedagogy',
    icon: Compass,
    badge: 'Concept First',
  },
  courses: {
    id: 'courses',
    title: 'Courses & Batch Timings',
    subtitle: 'Comprehensive concept curriculum from Class III to XII for CBSE & ICSE boards.',
    category: 'Academics',
    icon: BookOpen,
    badge: 'Class III–XII',
  },
  '3d-math-lab': {
    id: '3d-math-lab',
    title: '3D Mathematical Solid Lab',
    subtitle: 'Interactive 3D Platonic solids, real-time vertex analysis, and Euler’s characteristic.',
    category: '3D Simulation',
    icon: Box,
    badge: 'Interactive 3D',
    is3D: true,
  },
  'formula-rail': {
    id: 'formula-rail',
    title: 'Formula Rail & Speed Game',
    subtitle: '3D hanging books physics rail with embedded rapid-fire mental arithmetic speed challenge.',
    category: 'Interactive',
    icon: Sparkles,
    badge: 'Speed Game',
    is3D: true,
  },
  'demo-section': {
    id: 'demo-section',
    title: '1-Week Free Demo Class',
    subtitle: 'Experience 7 full days of concept-based coaching with zero fee and zero obligations.',
    category: 'Admissions',
    icon: Calendar,
    badge: 'Free 7 Days',
  },
  'study-material': {
    id: 'study-material',
    title: 'Study Material & Notes',
    subtitle: '100% free chapter-wise concept notes, formula derivations, and verified reference materials.',
    category: 'Library',
    icon: FileText,
    badge: '100% Free Notes',
  },
  'question-pdfs': {
    id: 'question-pdfs',
    title: 'Question PDFs & PYQs',
    subtitle: '100% free CBSE & ICSE board papers, exemplar problem sheets, and mock tests.',
    category: 'Library',
    icon: FileText,
    badge: '100% Free PYQs',
  },
  faculty: {
    id: 'faculty',
    title: 'Faculty Profile: Satyam Sir',
    subtitle: '10+ years experienced Senior Mathematics Faculty, board specialist, and founder.',
    category: 'Leadership',
    icon: GraduationCap,
    badge: '10+ Years Exp',
  },
  results: {
    id: 'results',
    title: 'Results & Board Toppers',
    subtitle: 'Consistent 95%+ and 98.4% top scores across CBSE & ICSE board examinations.',
    category: 'Track Record',
    icon: Award,
    badge: '98.4% Top Score',
  },
  contact: {
    id: 'contact',
    title: 'Contact & Center Location',
    subtitle: 'Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand 826007. Helpline 7004995470 / WhatsApp 82941 12559.',
    category: 'Center',
    icon: MapPin,
    badge: 'Dhanbad, Jharkhand',
  },
};

const PAGE_ORDER = [
  'home',
  'about',
  'courses',
  '3d-math-lab',
  'formula-rail',
  'demo-section',
  'study-material',
  'question-pdfs',
  'faculty',
  'results',
  'contact',
];

export default function App() {
  const [session, setSession] = useState<UserSession>(() => storageService.getSession());
  const [activeSection, setActiveSection] = useState<string>('home');
  const [viewMode, setViewMode] = useState<'public' | 'admin-dashboard'>('public');

  // Modals
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [prefilledGrade, setPrefilledGrade] = useState('');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<StudyMaterialItem | QuestionPdfItem | null>(null);
  const [viewerType, setViewerType] = useState<'study' | 'question'>('study');

  // Sync session changes
  useEffect(() => {
    storageService.setSession(session);
  }, [session]);

  // Initial Hash routing check & popstate sync
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && (PAGE_CONFIG[hash] || hash === 'home')) {
      setActiveSection(hash);
    }

    const handlePopState = () => {
      const currentHash = window.location.hash.replace('#', '') || 'home';
      setActiveSection(currentHash);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Page switching navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (viewMode !== 'public') {
      setViewMode('public');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', sectionId === 'home' ? ' ' : `#${sectionId}`);
    }
  };

  const handleOpenDemoWithGrade = (grade: string) => {
    setPrefilledGrade(grade);
    setDemoModalOpen(true);
  };

  const handleMentorLoginSuccess = () => {
    setSession({ role: 'mentor', mentorName: 'Satyam Sir' });
    setViewMode('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogout = () => {
    storageService.clearSession();
    setSession({ role: 'guest' });
    setViewMode('public');
    sound.playTick();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoToDashboard = () => {
    setViewMode('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenPdf = (doc: StudyMaterialItem | QuestionPdfItem, type: 'study' | 'question') => {
    setViewerDoc(doc);
    setViewerType(type);
  };

  // Compute previous and next pages for sub-page bottom navigation
  const currentIndex = PAGE_ORDER.indexOf(activeSection);
  const prevPageId = currentIndex > 1 ? PAGE_ORDER[currentIndex - 1] : 'home';
  const nextPageId =
    currentIndex >= 0 && currentIndex < PAGE_ORDER.length - 1
      ? PAGE_ORDER[currentIndex + 1]
      : 'home';

  const currentPageInfo = PAGE_CONFIG[activeSection];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111113] flex flex-col font-sans selection:bg-[#E63946] selection:text-white">
      {/* Sticky Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        session={session}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
        onOpenDemoBooking={() => {
          setPrefilledGrade('');
          setDemoModalOpen(true);
        }}
        onLogout={handleLogout}
        onGoToDashboard={handleGoToDashboard}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'admin-dashboard' && session.role === 'mentor' ? (
          <AdminDashboard
            onLogout={handleLogout}
            onNavigateToSection={handleNavigate}
          />
        ) : activeSection === 'home' ? (
          /* ========================================================
             HOME PAGE VIEW
             ======================================================== */
          <div className="space-y-16">
            {/* Hero Section with Interactive 3D Canvas */}
            <HeroSection
              onOpenDemoBooking={() => {
                setPrefilledGrade('');
                setDemoModalOpen(true);
              }}
              onExploreRail={() => handleNavigate('formula-rail')}
              onExplore3DLab={() => handleNavigate('3d-math-lab')}
              onExploreMaterials={() => handleNavigate('study-material')}
            />

            {/* Variation 1 Grid Cards: Academic & Interactive Pages Hub */}
            <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#111113] pb-6">
                  <div>
                    <div className="label text-[11px] mb-2">
                      [ INDEX OF SECTIONS ]
                    </div>
                    <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#111113] tracking-tight">
                      Explore MATHS FACT
                    </h2>
                    <p className="text-xs sm:text-sm font-mono text-[#52525B] mt-1 max-w-xl">
                      Select any module below to open that dedicated view instantly without long scrolling.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      sound.playStreak();
                      setPrefilledGrade('');
                      setDemoModalOpen(true);
                    }}
                    className="btn-ink self-start md:self-auto text-xs"
                  >
                    <Calendar className="w-4 h-4 inline-block mr-1.5" />
                    <span>Book 1-Week Free Demo</span>
                  </button>
                </div>

                {/* Hairline Grid Cards Pattern from Variation 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-[#111113] border-2 border-[#111113] shadow-[8px_8px_0px_#111113]">
                  {Object.values(PAGE_CONFIG).map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className="group bg-[#F8F7F4] hover:bg-white p-6 sm:p-7 transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#E63946]">
                              [{String(idx + 1).padStart(2, '0')}] {item.category.toUpperCase()}
                            </span>
                            <div className="w-8 h-8 bg-[#111113] text-white flex items-center justify-center group-hover:bg-[#E63946] transition-colors border border-[#111113]">
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-heading font-black text-xl text-[#111113] group-hover:text-[#E63946] transition-colors leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#52525B] mt-2 line-clamp-2 leading-relaxed">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-[#111113]/15 flex items-center justify-between text-xs font-mono uppercase font-bold text-[#111113] group-hover:text-[#E63946]">
                          <span>Enter Module</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Quick Highlights: 3D Lab & Physics Rail Teaser Banners */}
            <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3D Lab Card */}
                <div className="p-6 sm:p-8 bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="label text-[10px] inline-flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5" />
                      [ 3D INTERACTIVE LABORATORY ]
                    </span>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113]">
                      3D Mathematical Solid Lab
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                      Rotate, orbit, and analyze Platonic solids (Tetrahedron, Cube, Octahedron, Dodecahedron,
                      Icosahedron) in real-time WebGL with Euler's characteristic verification.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => handleNavigate('3d-math-lab')}
                      className="btn-ink flex items-center gap-2 text-xs"
                    >
                      <span>Open 3D Solid Lab</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3D Formula Rail & Game Card */}
                <div className="p-6 sm:p-8 bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="label text-[10px] inline-flex items-center gap-1.5 text-[#E63946]">
                      <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                      [ HANGING BOOKS PHYSICS &amp; GAME ]
                    </span>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113]">
                      Formula Rail &amp; Speed Challenge
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                      Interactive hanging physics books from Classes III to XII, plus a 10-problem rapid arithmetic speed quiz with instant accuracy rating.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => handleNavigate('formula-rail')}
                      className="btn-ink flex items-center gap-2 text-xs"
                    >
                      <span>Play Formula Rail</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ========================================================
             DEDICATED SUB-PAGE VIEW
             ======================================================== */
          <div className="pt-36 sm:pt-40 lg:pt-36 pb-12">
            {/* Top Back-To-Home Breadcrumb Bar */}
            <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <div className="p-4 bg-white border-2 border-[#111113] shadow-[4px_4px_0px_#111113] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="hover:text-[#E63946] flex items-center gap-1.5 font-bold uppercase transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>MATHS FACT</span>
                  </button>
                  <span className="text-[#A1A1AA]">/</span>
                  <span className="text-[#71717A] uppercase font-medium">
                    {currentPageInfo?.category || 'Module'}
                  </span>
                  <span className="text-[#A1A1AA]">/</span>
                  <span className="font-bold text-[#E63946] uppercase">
                    {currentPageInfo?.title || activeSection}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigate('home')}
                    className="btn-outline-ink text-xs flex items-center gap-1.5 py-1.5 px-3"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Overview</span>
                  </button>

                  <button
                    onClick={() => {
                      setPrefilledGrade('');
                      setDemoModalOpen(true);
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#E63946] text-white font-mono font-bold text-xs uppercase border border-[#111113] shadow-[2px_2px_0px_#111113]"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Book Free Demo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dedicated Page Active Component */}
            <div className="subpage-container">
              {activeSection === 'about' && <AboutSection />}

              {activeSection === 'courses' && (
                <CoursesSection
                  session={session}
                  onSelectCourseForDemo={handleOpenDemoWithGrade}
                />
              )}

              {activeSection === '3d-math-lab' && <ThreeMathLab />}

              {activeSection === 'formula-rail' && <FormulaRailSection />}

              {activeSection === 'demo-section' && (
                <FreeDemoPage onSelectCourse={handleOpenDemoWithGrade} />
              )}

              {activeSection === 'study-material' && (
                <StudyMaterialSection
                  session={session}
                  onOpenPdf={(doc) => handleOpenPdf(doc, 'study')}
                />
              )}

              {activeSection === 'question-pdfs' && (
                <QuestionPdfsSection
                  session={session}
                  onOpenPdf={(doc) => handleOpenPdf(doc, 'question')}
                />
              )}

              {activeSection === 'faculty' && (
                <FacultySection
                  session={session}
                  onOpenDemoBooking={() => {
                    setPrefilledGrade('');
                    setDemoModalOpen(true);
                  }}
                />
              )}

              {activeSection === 'results' && (
                <ResultsSection session={session} />
              )}

              {activeSection === 'contact' && (
                <ContactSection
                  session={session}
                  onOpenDemoBooking={() => {
                    setPrefilledGrade('');
                    setDemoModalOpen(true);
                  }}
                  onOpenAdminLogin={() => setAdminLoginOpen(true)}
                />
              )}
            </div>

            {/* Sub-Page Bottom Navigation Footer */}
            <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t-2 border-[#111113]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => handleNavigate(prevPageId)}
                  className="px-4 py-2.5 bg-white hover:bg-[#111113] hover:text-white text-[#111113] font-mono text-xs font-bold border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-all flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#E63946]" />
                  <span>
                    {prevPageId === 'home'
                      ? 'Home & Overview'
                      : PAGE_CONFIG[prevPageId]?.title || prevPageId}
                  </span>
                </button>

                <button
                  onClick={() => handleNavigate('home')}
                  className="px-4 py-2.5 bg-[#E63946] hover:bg-[#c92a37] text-white font-mono text-xs font-bold uppercase border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-all"
                >
                  Return to Home
                </button>

                <button
                  onClick={() => handleNavigate(nextPageId)}
                  className="px-4 py-2.5 bg-white hover:bg-[#111113] hover:text-white text-[#111113] font-mono text-xs font-bold border-2 border-[#111113] shadow-[2px_2px_0px_#111113] transition-all flex items-center gap-2 group"
                >
                  <span>
                    {nextPageId === 'home'
                      ? 'Home & Overview'
                      : PAGE_CONFIG[nextPageId]?.title || nextPageId}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#E63946]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDemoBooking={() => {
          setPrefilledGrade('');
          setDemoModalOpen(true);
        }}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* --- MODALS & ACCESS DIALOGS --- */}
      {/* 1. Free Demo Registration Modal */}
      <FreeDemoModal
        isOpen={demoModalOpen}
        prefilledGrade={prefilledGrade}
        onClose={() => setDemoModalOpen(false)}
      />

      {/* 2. Mentor Authentication Modal */}
      <AdminAuthModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleMentorLoginSuccess}
      />

      {/* 3. Built-in Multi-page PDF Viewer with 100% Free Public Vault */}
      <PdfModalViewer
        document={viewerDoc}
        type={viewerType}
        session={session}
        onClose={() => setViewerDoc(null)}
      />
    </div>
  );
}
