import React, { useState } from 'react';
import { Award, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { sound } from '../utils/audio';
import { storageService } from '../services/storageService';
import { ResultScorecard, UserSession } from '../types';

interface ResultsSectionProps {
  session?: UserSession;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ session }) => {
  const [scorecards, setScorecards] = useState<ResultScorecard[]>(() =>
    storageService.getResultsScorecards()
  );
  const [editingCard, setEditingCard] = useState<ResultScorecard | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [form, setForm] = useState<ResultScorecard>({
    id: '',
    name: '',
    class: 'Class X (CBSE)',
    school: '',
    overallScore: '98%',
    mathScore: '99 / 100',
    scienceScore: '97 / 100',
    quote: '',
    year: '2024 Board',
  });

  const isMentor = session?.role === 'mentor';

  const handleOpenAdd = () => {
    setForm({
      id: `res-${Date.now()}`,
      name: '',
      class: 'Class X (CBSE)',
      school: '',
      overallScore: '98%',
      mathScore: '99 / 100',
      scienceScore: '97 / 100',
      quote: '',
      year: '2024 Board',
    });
    setIsAddingNew(true);
    setEditingCard(null);
  };

  const handleOpenEdit = (card: ResultScorecard) => {
    setForm({ ...card });
    setEditingCard(card);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this topper scorecard?')) {
      sound.playWrong();
      storageService.deleteResultsScorecard(id);
      setScorecards(storageService.getResultsScorecards());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.overallScore.trim()) return;

    sound.playVictory();
    storageService.saveResultsScorecard(form);
    setScorecards(storageService.getResultsScorecards());
    setEditingCard(null);
    setIsAddingNew(false);
  };

  return (
    <section id="results" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mentor Edit Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div className="text-left max-w-3xl space-y-3">
            <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <Award className="w-3.5 h-3.5 text-[#E63946]" />
              <span>[ BOARD EXAMINATION HALL OF FAME ]</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
              Proven Results Speak{' '}
              <span className="text-[#E63946]">Louder Than Words</span>
            </h2>
            <p className="text-base sm:text-lg text-[#52525B]">
              Over the last decade, MATHS FACT students have consistently achieved 95%+ scores and perfect 100/100s in CBSE and ICSE board exams.
            </p>
          </div>

          {isMentor && (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs border-2 border-[#111113] shadow-[3px_3px_0px_#111113] flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Board Topper (Mentor)</span>
            </button>
          )}
        </div>

        {/* Scorecards Grid */}
        {scorecards.length === 0 ? (
          <div className="p-12 sm:p-16 text-center bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] space-y-4">
            <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] mx-auto flex items-center justify-center">
              <Award className="w-8 h-8 text-[#E63946]" />
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113]">
              Board Topper Results Pending Publication
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#52525B] max-w-lg mx-auto leading-relaxed">
              Verified board exam scorecards and student testimonials will be published here directly by Satyam Sir.
            </p>
            {isMentor && (
              <div className="pt-2">
                <button
                  onClick={handleOpenAdd}
                  className="btn-ink text-xs px-5 py-2.5 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add First Board Topper (Mentor)</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-[#111113] border-2 border-[#111113] shadow-[8px_8px_0px_#111113]">
            {scorecards.map((card) => (
              <div
                key={card.id}
                className="p-7 sm:p-8 bg-[#F8F7F4] hover:bg-white transition-colors space-y-5 flex flex-col justify-between relative group"
              >
                {/* Mentor In-place Card Actions */}
                {isMentor && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white border border-[#111113] p-1 shadow-[2px_2px_0px_#111113] z-10">
                    <button
                      onClick={() => handleOpenEdit(card)}
                      className="p-1.5 bg-amber-100 hover:bg-amber-200 text-black text-xs font-mono font-bold flex items-center gap-1"
                      title="Edit Topper"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700"
                      title="Delete Topper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Top Row: Student info & Overall Score */}
                  <div className="flex items-start justify-between gap-4 border-b border-[#111113]/10 pb-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-[#E63946]">
                        {card.year}
                      </span>
                      <h3 className="font-heading font-black text-2xl text-[#111113]">
                        {card.name}
                      </h3>
                      <p className="text-xs font-mono text-[#71717A]">
                        {card.class} • {card.school}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="label text-[9px] block">
                        Overall Score
                      </span>
                      <div className="font-mono font-black text-3xl sm:text-4xl text-[#111113]">
                        {card.overallScore}
                      </div>
                    </div>
                  </div>

                  {/* Subject Scores Pill Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-white border border-[#111113]">
                      <span className="label text-[9px] block">Mathematics</span>
                      <span className="font-black text-[#E63946] text-sm">{card.mathScore}</span>
                    </div>
                    <div className="p-2.5 bg-white border border-[#111113]">
                      <span className="label text-[9px] block">Science</span>
                      <span className="font-black text-[#111113] text-sm">{card.scienceScore}</span>
                    </div>
                  </div>

                  {/* Student Quote */}
                  <p className="text-xs text-[#3F3F46] leading-relaxed italic bg-white p-3 border border-[#111113]">
                    "{card.quote}"
                  </p>
                </div>

                <div className="pt-2 text-[10px] font-mono text-[#71717A] uppercase">
                  Verified Board Result Archive
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentor Add/Edit Topper Scorecard Modal */}
      {(isAddingNew || editingCard) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-[#111113] max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#111113] relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingCard(null);
              }}
              className="absolute top-5 right-5 p-2 bg-[#F8F7F4] hover:bg-[#111113] hover:text-white text-[#111113] border-2 border-[#111113] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="label text-[10px] block font-mono font-bold text-[#E63946]">
                [ MENTOR CONTENT EDITOR ]
              </span>
              <h3 className="font-heading font-black text-2xl text-[#111113]">
                {isAddingNew ? 'Add New Board Topper' : 'Edit Topper Scorecard'}
              </h3>
              <p className="text-xs font-mono text-[#52525B]">
                Enter student score details and testimonial quote to feature in the Board Hall of Fame.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ankit Kumar"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Board Year *</label>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2024 Board"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Class &amp; Board *</label>
                  <input
                    type="text"
                    required
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    placeholder="e.g. Class X (CBSE)"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">School Name *</label>
                  <input
                    type="text"
                    required
                    value={form.school}
                    onChange={(e) => setForm({ ...form, school: e.target.value })}
                    placeholder="e.g. DAV Public School"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Overall % *</label>
                  <input
                    type="text"
                    required
                    value={form.overallScore}
                    onChange={(e) => setForm({ ...form, overallScore: e.target.value })}
                    placeholder="e.g. 98.4%"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Math Score</label>
                  <input
                    type="text"
                    required
                    value={form.mathScore}
                    onChange={(e) => setForm({ ...form, mathScore: e.target.value })}
                    placeholder="100 / 100"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Science Score</label>
                  <input
                    type="text"
                    required
                    value={form.scienceScore}
                    onChange={(e) => setForm({ ...form, scienceScore: e.target.value })}
                    placeholder="98 / 100"
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Student Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="How Satyam Sir helped them achieve their score..."
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113] resize-none leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingCard(null);
                  }}
                  className="px-4 py-2 bg-white text-[#111113] border-2 border-[#111113]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-ink flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Topper Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
