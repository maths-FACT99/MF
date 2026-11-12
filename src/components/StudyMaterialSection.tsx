import React, { useState } from 'react';
import { StudyMaterialItem, UserSession, ClassGrade, Subject } from '../types';
import { storageService } from '../services/storageService';
import { sound } from '../utils/audio';
import {
  BookOpen,
  Eye,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface StudyMaterialSectionProps {
  session?: UserSession;
  onOpenPdf: (doc: StudyMaterialItem) => void;
}

export const StudyMaterialSection: React.FC<StudyMaterialSectionProps> = ({
  session,
  onOpenPdf,
}) => {
  const [materials, setMaterials] = useState<StudyMaterialItem[]>(() =>
    storageService.getStudyMaterials()
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isMentor = session?.role === 'mentor';

  // Edit / Add modal state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyMaterialItem | null>(null);
  const [form, setForm] = useState<Partial<StudyMaterialItem>>({});
  const [sampleQuestionsText, setSampleQuestionsText] = useState('');

  const handleOpenAdd = () => {
    sound.playTick();
    setForm({
      title: '',
      chapter: '',
      classGrade: 'Class X',
      subject: 'Mathematics',
      pagesCount: 5,
      pdfFileName: 'Chapter_Formula_Summary.pdf',
    });
    setSampleQuestionsText('Core Formula 1: Derivation & Proof\nExam Tip: Key pitfalls to avoid in 5-mark board question\nSolved Model: Step-by-step scoring breakdown');
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: StudyMaterialItem) => {
    sound.playTick();
    setForm({ ...item });
    setSampleQuestionsText((item.samplePreviewQuestions || []).join('\n'));
    setEditingItem(item);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete these study notes?')) {
      sound.playWrong();
      storageService.deleteStudyMaterial(id);
      setMaterials(storageService.getStudyMaterials());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.chapter?.trim()) return;

    sound.playVictory();
    const questionsArr = sampleQuestionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const fullItem: StudyMaterialItem = {
      id: form.id || `mat-${Date.now()}`,
      title: form.title.trim(),
      chapter: form.chapter.trim(),
      classGrade: (form.classGrade as ClassGrade) || 'Class X',
      subject: (form.subject as Subject) || 'Mathematics',
      type: (form.type as any) || 'Concept Notes',
      samplePreviewQuestions: questionsArr.length ? questionsArr : ['Core formulas and board step breakdown.'],
      pagesCount: Number(form.pagesCount) || 4,
      pdfFileName: form.pdfFileName || `${form.title.replace(/\s+/g, '_')}.pdf`,
      uploadedAt: form.uploadedAt || new Date().toISOString(),
      pages: form.pages || [
        {
          pageNumber: 1,
          title: 'Conceptual Foundation & Formulas',
          content: questionsArr.length ? questionsArr : ['Core formulas and step derivations.'],
        },
      ],
    };

    storageService.updateStudyMaterial(fullItem);
    setMaterials(storageService.getStudyMaterials());
    setIsAddingNew(false);
    setEditingItem(null);
  };

  const filtered = materials.filter((m) => {
    const matchesSubject = selectedSubject === 'All' || m.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'All' || m.classGrade === selectedGrade;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesGrade && matchesSearch;
  });

  return (
    <section id="study-material" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div className="space-y-3">
            <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <BookOpen className="w-3.5 h-3.5 text-[#E63946]" />
              <span>[ COMPREHENSIVE ACADEMIC VAULT ]</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
              Study Material &amp;{' '}
              <span className="text-[#E63946]">Concept Notes</span>
            </h2>
            <p className="text-base sm:text-lg text-[#52525B] max-w-xl">
              Chapter-wise formula derivations, conceptual summaries, and exam checklists created by Satyam Sir.
            </p>
          </div>

          {/* Access status badge & Mentor Action */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-3 bg-white border-2 border-[#111113] shadow-[4px_4px_0px_#111113] text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold uppercase">
                100% Free Public Vault: All Notes Unlocked
              </span>
            </div>

            {isMentor && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs border-2 border-[#111113] shadow-[4px_4px_0px_#111113] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Study Notes (Mentor)</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full font-mono text-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, chapter, or formula..."
              className="w-full pl-9 pr-3 py-2 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] placeholder-gray-500 focus:outline-none focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto font-mono text-xs">
            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-[#F8F7F4] border-2 border-[#111113] px-3 py-2 text-[#111113] font-bold focus:outline-none focus:bg-white"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Social Science">Social Science</option>
            </select>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#F8F7F4] border-2 border-[#111113] px-3 py-2 text-[#111113] font-bold focus:outline-none focus:bg-white"
            >
              <option value="All">All Classes (III–XII)</option>
              <option value="Class X">Class X</option>
              <option value="Class XII">Class XII</option>
              <option value="Class IX">Class IX</option>
              <option value="Class VIII">Class VIII</option>
            </select>
          </div>
        </div>

        {/* Material Cards Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 sm:p-16 text-center bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] space-y-4">
            <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#E63946]" />
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113]">
              No Study Notes Uploaded Yet
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#52525B] max-w-lg mx-auto leading-relaxed">
              Satyam Sir has not published any concept notes or formula sheets yet. When uploaded, they will be readable right here.
            </p>
            {isMentor && (
              <div className="pt-2">
                <button
                  onClick={handleOpenAdd}
                  className="btn-ink text-xs px-5 py-2.5 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Upload Concept Notes (Mentor)</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] hover:shadow-[8px_8px_0px_#E63946] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="px-2 py-0.5 bg-[#111113] text-white uppercase">
                      {item.subject}
                    </span>
                    <span className="text-[#71717A]">
                      {item.classGrade} • {item.pagesCount} Pages
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-black text-xl text-[#111113] group-hover:text-[#E63946] transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs font-mono text-[#71717A] mt-1 line-clamp-1">{item.chapter}</p>
                  </div>

                  {/* Sample Preview Questions List (Page 1) */}
                  <div className="p-3 bg-[#F8F7F4] border border-[#111113] space-y-1.5 font-mono">
                    <span className="label text-[9px] block">
                      Formula Highlights &amp; Insights:
                    </span>
                    <ul className="text-xs text-[#3F3F46] space-y-1">
                      {(item.samplePreviewQuestions || []).map((q, i) => (
                        <li key={i} className="line-clamp-2">
                          • {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t-2 border-[#111113] flex flex-wrap items-center justify-between gap-2 font-mono">
                  <span className="text-[11px] text-[#71717A] truncate max-w-[140px]">
                    {item.pdfFileName}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isMentor && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Study Material"
                          className="p-1.5 bg-amber-200 hover:bg-amber-300 border border-[#111113] text-black text-xs font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete Study Material"
                          className="p-1.5 bg-red-200 hover:bg-red-300 border border-[#111113] text-red-900 text-xs font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        sound.playTick();
                        onOpenPdf(item);
                      }}
                      className="btn-ink text-xs flex items-center gap-1.5 py-1.5 px-3"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mentor Add / Edit Modal */}
        {(isAddingNew || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#F8F7F4] border-4 border-[#111113] shadow-[12px_12px_0px_#111113] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 font-mono">
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#111113] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#E63946]" />
                  <h3 className="font-heading font-black text-lg text-[#111113]">
                    {isAddingNew ? 'ADD STUDY NOTES' : 'EDIT STUDY NOTES'} (MENTOR)
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingItem(null);
                  }}
                  className="p-1.5 border-2 border-[#111113] bg-white hover:bg-red-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#111113] mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Class 10 Quadratic Equations Master Formula Guide"
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Subject</label>
                    <select
                      value={form.subject || 'Mathematics'}
                      onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113] font-bold"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Social Science">Social Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Class Grade</label>
                    <select
                      value={form.classGrade || 'Class X'}
                      onChange={(e) => setForm({ ...form, classGrade: e.target.value as ClassGrade })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113] font-bold"
                    >
                      <option value="Class III">Class III</option>
                      <option value="Class IV">Class IV</option>
                      <option value="Class V">Class V</option>
                      <option value="Class VI">Class VI</option>
                      <option value="Class VII">Class VII</option>
                      <option value="Class VIII">Class VIII</option>
                      <option value="Class IX">Class IX</option>
                      <option value="Class X">Class X</option>
                      <option value="Class XI">Class XI</option>
                      <option value="Class XII">Class XII</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Chapter / Topic</label>
                    <input
                      type="text"
                      required
                      value={form.chapter || ''}
                      onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                      placeholder="e.g. Chapter 4: Quadratic Equations"
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Total Pages</label>
                    <input
                      type="number"
                      value={form.pagesCount || 5}
                      onChange={(e) => setForm({ ...form, pagesCount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">
                    Key Highlights &amp; Formulas (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={sampleQuestionsText}
                    onChange={(e) => setSampleQuestionsText(e.target.value)}
                    placeholder="Highlight 1...&#10;Highlight 2...&#10;Highlight 3..."
                    className="w-full p-2.5 bg-white border-2 border-[#111113] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">PDF File Name</label>
                  <input
                    type="text"
                    value={form.pdfFileName || ''}
                    onChange={(e) => setForm({ ...form, pdfFileName: e.target.value })}
                    placeholder="e.g. Class10_QuadraticEquations_Formulas.pdf"
                    className="w-full p-2.5 bg-white border-2 border-[#111113]"
                  />
                </div>

                <div className="pt-3 border-t-2 border-[#111113] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 border-2 border-[#111113] bg-white hover:bg-gray-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 border-2 border-[#111113] bg-[#E63946] text-white hover:bg-[#c92a37] font-bold shadow-[4px_4px_0px_#111113] flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Notes (Mentor)</span>
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
