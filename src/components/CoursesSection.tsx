import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
  Edit3,
  X,
  Save,
} from 'lucide-react';
import { CourseBatchItem, UserSession } from '../types';
import { storageService } from '../services/storageService';
import { sound } from '../utils/audio';

interface CoursesSectionProps {
  session?: UserSession;
  onSelectCourseForDemo: (grade: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  session,
  onSelectCourseForDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'foundation' | 'middle' | 'secondary' | 'senior'>(
    'secondary'
  );
  const [batches, setBatches] = useState<CourseBatchItem[]>(() =>
    storageService.getCourseBatches()
  );

  const isMentor = session?.role === 'mentor';

  // Mentor Edit Modal State
  const [editingBatch, setEditingBatch] = useState<CourseBatchItem | null>(null);
  const [form, setForm] = useState<Partial<CourseBatchItem>>({});
  const [highlightsText, setHighlightsText] = useState('');
  const [booksText, setBooksText] = useState('');
  const [subjectsText, setSubjectsText] = useState('');

  const tabs = [
    { id: 'foundation', label: 'Foundation (Classes III–V)', sub: 'Primary Intuition' },
    { id: 'middle', label: 'Middle School (Classes VI–VIII)', sub: 'Concept Building' },
    { id: 'secondary', label: 'Board Prep (Classes IX–X)', sub: 'CBSE & ICSE Excellence' },
    { id: 'senior', label: 'Senior Secondary (Classes XI–XII)', sub: 'Boards & Competitive' },
  ];

  const handleOpenEdit = (batch: CourseBatchItem) => {
    sound.playTick();
    setEditingBatch(batch);
    setForm({ ...batch });
    setHighlightsText((batch.highlights || []).join('\n'));
    setBooksText((batch.books || []).join(', '));
    setSubjectsText((batch.subjects || []).join(', '));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    sound.playVictory();
    const updatedHighlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const updatedBooks = booksText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const updatedSubjects = subjectsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = batches.map((b) =>
      b.id === editingBatch.id
        ? {
            ...b,
            ...form,
            highlights: updatedHighlights.length ? updatedHighlights : b.highlights,
            books: updatedBooks.length ? updatedBooks : b.books,
            subjects: updatedSubjects.length ? updatedSubjects : b.subjects,
          }
        : b
    );

    storageService.saveCourseBatches(updated);
    setBatches(updated);
    setEditingBatch(null);
  };

  const handleDemoClick = (gradeTitle: string) => {
    sound.playStreak();
    onSelectCourseForDemo(gradeTitle);
  };

  const currentTabBatches = batches.filter((b) => b.category === activeTab);

  return (
    <section id="courses" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12 space-y-3">
          <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
            <BookOpen className="w-3.5 h-3.5 text-[#E63946]" />
            <span>[ CURRICULUM &amp; BATCH TIMINGS ]</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
            Specialized Batches from{' '}
            <span className="text-[#E63946]">Class III to XII</span>
          </h2>
          <p className="text-base sm:text-lg text-[#52525B]">
            Tailored learning cohorts designed for the specific cognitive stage and board requirements of CBSE and ICSE students in Dhanbad.
          </p>
        </div>

        {/* Grade Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-10">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  sound.playTick();
                  setActiveTab(t.id as any);
                }}
                className={`p-4 text-left transition-all whitespace-nowrap border-2 border-[#111113] shrink-0 ${
                  isActive
                    ? 'bg-[#111113] text-[#F8F7F4] shadow-[4px_4px_0px_#E63946]'
                    : 'bg-white text-[#111113] hover:bg-[#F8F7F4] shadow-[2px_2px_0px_#111113]'
                }`}
              >
                <div className="font-mono font-bold text-xs sm:text-sm uppercase tracking-wider">{t.label}</div>
                <div className={`text-[10px] font-mono ${isActive ? 'text-[#E63946]' : 'text-[#71717A]'}`}>
                  {t.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Course Cards */}
        <div className="grid grid-cols-1 gap-8 max-w-5xl">
          {currentTabBatches.map((course) => (
            <div
              key={course.id}
              className="p-7 sm:p-9 bg-white border-2 border-[#111113] shadow-[8px_8px_0px_#111113] relative space-y-6"
            >
              {/* Featured Badge & Mentor Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#111113] pb-4">
                <span className="label text-[11px] font-bold">
                  [ {course.badge.toUpperCase()} ]
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#111113] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E63946]" /> 1-Week Free Demo Included
                  </span>
                  {isMentor && (
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="px-3 py-1 bg-amber-300 hover:bg-amber-400 text-black border-2 border-[#111113] text-xs font-mono font-bold flex items-center gap-1 shadow-[2px_2px_0px_#111113]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Batch (Mentor)</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Course Details (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  <div>
                    <h3 className="font-heading font-black text-2xl sm:text-4xl text-[#111113] leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-[#E63946] mt-1 uppercase">
                      Target: {course.classes}
                    </p>
                  </div>

                  <p className="text-sm text-[#3F3F46] leading-relaxed">
                    {course.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="label text-[10px] block">
                      Key Pedagogical Features:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#111113]">
                      {course.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-[#F8F7F4] border border-[#111113]">
                          <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Books & Sources */}
                  <div className="pt-2">
                    <span className="label text-[10px] block mb-1">
                      Standard References Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(course.books || []).map((b, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-white border border-[#111113] text-[11px] text-[#111113] font-mono font-bold"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Batch Logistics & Enroll CTA (4 cols) */}
                <div className="lg:col-span-4 p-5 bg-[#F8F7F4] border-2 border-[#111113] shadow-[4px_4px_0px_#111113] space-y-4">
                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <span className="label text-[10px] block mb-1">
                        Batch Timing
                      </span>
                      <span className="font-bold text-[#111113] text-xs sm:text-sm">
                        {course.timings || course.timing || '05:00 PM - 06:30 PM'}
                      </span>
                    </div>

                    <div>
                      <span className="label text-[10px] block mb-1">
                        Weekly Schedule
                      </span>
                      <span className="font-bold text-[#111113]">
                        {course.frequency || '6 Days a Week'}
                      </span>
                    </div>

                    <div>
                      <span className="label text-[10px] block mb-1">
                        Subjects
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(course.subjects || ['Mathematics']).map((sub, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white text-[#111113] text-[10px] font-bold border border-[#111113]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => handleDemoClick(course.classes || course.grades || course.title)}
                      className="btn-ink w-full flex items-center justify-center gap-2 text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Free Demo</span>
                    </button>
                    <a
                      href="tel:7004995470"
                      className="btn-outline-ink w-full block text-center text-xs"
                    >
                      Inquire: 7004995470
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mentor Edit Modal */}
        {editingBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#F8F7F4] border-4 border-[#111113] shadow-[12px_12px_0px_#111113] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 font-mono">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#111113] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#E63946]" />
                  <h3 className="font-heading font-black text-lg text-[#111113]">
                    EDIT BATCH DETAILS (MENTOR)
                  </h3>
                </div>
                <button
                  onClick={() => setEditingBatch(null)}
                  className="p-1.5 border-2 border-[#111113] bg-white hover:bg-red-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#111113] mb-1">Batch Title</label>
                  <input
                    type="text"
                    required
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Target Classes</label>
                    <input
                      type="text"
                      required
                      value={form.classes || ''}
                      onChange={(e) => setForm({ ...form, classes: e.target.value })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={form.badge || ''}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Batch Timings</label>
                    <input
                      type="text"
                      value={form.timings || ''}
                      onChange={(e) => setForm({ ...form, timings: e.target.value })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Frequency</label>
                    <input
                      type="text"
                      value={form.frequency || ''}
                      onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">
                    Subjects (comma separated)
                  </label>
                  <input
                    type="text"
                    value={subjectsText}
                    onChange={(e) => setSubjectsText(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">
                    Books / Reference Material (comma separated)
                  </label>
                  <input
                    type="text"
                    value={booksText}
                    onChange={(e) => setBooksText(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">
                    Key Features / Highlights (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div className="pt-3 border-t-2 border-[#111113] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBatch(null)}
                    className="px-4 py-2 border-2 border-[#111113] bg-white hover:bg-gray-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 border-2 border-[#111113] bg-[#E63946] text-white hover:bg-[#c92a37] font-bold shadow-[4px_4px_0px_#111113] flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Batch (Mentor)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
