import React, { useState } from 'react';
import { QuestionPdfItem, UserSession, ClassGrade, Subject } from '../types';
import { storageService } from '../services/storageService';
import { sound } from '../utils/audio';
import {
  FileText,
  Eye,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface QuestionPdfsSectionProps {
  session?: UserSession;
  onOpenPdf: (doc: QuestionPdfItem) => void;
}

export const QuestionPdfsSection: React.FC<QuestionPdfsSectionProps> = ({
  session,
  onOpenPdf,
}) => {
  const [questionPdfs, setQuestionPdfs] = useState<QuestionPdfItem[]>(() =>
    storageService.getQuestionPdfs()
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mentor Add/Edit State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<QuestionPdfItem | null>(null);
  const [form, setForm] = useState<Partial<QuestionPdfItem>>({
    title: '',
    chapter: '',
    classGrade: 'Class X',
    subject: 'Mathematics',
    type: 'PYQ Board Paper',
    year: '2024 Board',
    totalMarks: 80,
    sampleQuestions: ['Question 1: Solve for x and verify the roots.'],
    pagesCount: 4,
    pdfFileName: 'Board_Practice_Paper.pdf',
  });
  const [sampleQuestionsText, setSampleQuestionsText] = useState('');

  const isMentor = session?.role === 'mentor';

  const filtered = questionPdfs.filter((q) => {
    const matchesSubject = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'All' || q.classGrade === selectedGrade;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesGrade && matchesSearch;
  });

  const handleOpenAdd = () => {
    setForm({
      id: `qpdf-${Date.now()}`,
      title: '',
      chapter: '',
      classGrade: 'Class X',
      subject: 'Mathematics',
      type: 'PYQ Board Paper',
      year: '2024 Board',
      totalMarks: 80,
      pagesCount: 4,
      pdfFileName: 'Sample_Paper.pdf',
      uploadedAt: new Date().toISOString(),
    });
    setSampleQuestionsText('Question 1: Solve for x and verify.\nQuestion 2: State and prove theorem.');
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: QuestionPdfItem) => {
    setForm({ ...item });
    setSampleQuestionsText((item.sampleQuestions || []).join('\n'));
    setEditingItem(item);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Question PDF?')) {
      sound.playWrong();
      storageService.deleteQuestionPdf(id);
      setQuestionPdfs(storageService.getQuestionPdfs());
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

    const fullItem: QuestionPdfItem = {
      id: form.id || `qpdf-${Date.now()}`,
      title: form.title.trim(),
      chapter: form.chapter.trim(),
      classGrade: (form.classGrade as ClassGrade) || 'Class X',
      subject: (form.subject as Subject) || 'Mathematics',
      type: (form.type as any) || 'PYQ Board Paper',
      year: form.year || '2024',
      totalMarks: Number(form.totalMarks) || 80,
      sampleQuestions: questionsArr.length ? questionsArr : ['Sample Problem 1'],
      pagesCount: Number(form.pagesCount) || 4,
      pdfFileName: form.pdfFileName || `${form.title.replace(/\s+/g, '_')}.pdf`,
      uploadedAt: form.uploadedAt || new Date().toISOString(),
      pages: form.pages || [
        {
          pageNumber: 1,
          sectionTitle: 'Section A: Objective & Core Problems',
          questions: questionsArr.map((qText, i) => ({
            qNum: i + 1,
            marks: 3,
            text: qText,
            isSample: true,
          })),
        },
      ],
    };

    storageService.updateQuestionPdf(fullItem);
    setQuestionPdfs(storageService.getQuestionPdfs());
    setIsAddingNew(false);
    setEditingItem(null);
  };

  return (
    <section id="question-pdfs" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div className="space-y-3">
            <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <FileText className="w-3.5 h-3.5 text-[#E63946]" />
              <span>[ PRACTICE &amp; BOARD TESTING BANK ]</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
              Question PDFs &amp;{' '}
              <span className="text-[#E63946]">Board Papers (PYQs)</span>
            </h2>
            <p className="text-base sm:text-lg text-[#52525B] max-w-xl">
              Real board examinations, chapter practice assignments, and exemplar problems with marking schemes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="p-3 bg-white border-2 border-[#111113] shadow-[4px_4px_0px_#111113] text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold uppercase">
                100% Free Public Vault: All Papers Unlocked
              </span>
            </div>

            {isMentor && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs border-2 border-[#111113] shadow-[4px_4px_0px_#111113] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question PDF (Mentor)</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80 font-mono text-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, board year..."
              className="w-full pl-9 pr-3 py-2 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] placeholder-gray-500 focus:outline-none focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto font-mono text-xs">
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

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-[#F8F7F4] border-2 border-[#111113] px-3 py-2 text-[#111113] font-bold focus:outline-none focus:bg-white"
            >
              <option value="All">All Grades (III–XII)</option>
              <option value="Class X">Class X (Boards)</option>
              <option value="Class XII">Class XII (Boards)</option>
              <option value="Class IX">Class IX</option>
              <option value="Class VIII">Class VIII</option>
            </select>
          </div>
        </div>

        {/* Papers Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 sm:p-16 text-center bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] space-y-4">
            <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] mx-auto flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#E63946]" />
            </div>
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113]">
              No Question Papers Uploaded Yet
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#52525B] max-w-lg mx-auto leading-relaxed">
              Satyam Sir has not uploaded any question PDFs or board papers yet. PYQ papers and chapter test sets will appear here once published.
            </p>
            {isMentor && (
              <div className="pt-2">
                <button
                  onClick={handleOpenAdd}
                  className="btn-ink text-xs px-5 py-2.5 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Upload Question Paper (Mentor)</span>
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
                      {item.classGrade} • {item.pagesCount} Pages • {item.totalMarks} Marks
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-black text-xl text-[#111113] group-hover:text-[#E63946] transition-colors leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs font-mono text-[#71717A] mt-1 line-clamp-1">{item.chapter}</p>
                  </div>

                  {/* Free Sample Questions List */}
                  <div className="p-3 bg-[#F8F7F4] border border-[#111113] space-y-1.5 font-mono">
                    <span className="label text-[9px] block">
                      Free Sample Questions (Page 1):
                    </span>
                    <ul className="text-xs text-[#3F3F46] space-y-1">
                      {(item.sampleQuestions || []).map((q: string, i: number) => (
                        <li key={i} className="line-clamp-2">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t-2 border-[#111113] flex flex-wrap items-center justify-between gap-2 font-mono">
                  <span className="text-[11px] text-[#71717A] truncate max-w-[130px]">
                    {item.pdfFileName}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isMentor && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Question Paper"
                          className="p-1.5 bg-amber-200 hover:bg-amber-300 border border-[#111113] text-black text-xs font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete Question Paper"
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
                      <span>Inspect PDF</span>
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
                    {isAddingNew ? 'ADD NEW QUESTION PDF' : 'EDIT QUESTION PDF'} (MENTOR)
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
                  <label className="block font-bold text-[#111113] mb-1">Paper Title</label>
                  <input
                    type="text"
                    required
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Class 10 CBSE Standard Mathematics Board 2024"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Chapter / Unit</label>
                    <input
                      type="text"
                      required
                      value={form.chapter || ''}
                      onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                      placeholder="e.g. Full Syllabus Mock"
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Year / Cohort</label>
                    <input
                      type="text"
                      value={form.year || '2024'}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="e.g. 2024-2025"
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111113] mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={form.totalMarks || 80}
                      onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border-2 border-[#111113]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">
                    Sample Questions (one per line, shown on preview card)
                  </label>
                  <textarea
                    rows={4}
                    value={sampleQuestionsText}
                    onChange={(e) => setSampleQuestionsText(e.target.value)}
                    placeholder="Question 1...&#10;Question 2...&#10;Question 3..."
                    className="w-full p-2.5 bg-white border-2 border-[#111113] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111113] mb-1">PDF File Name</label>
                  <input
                    type="text"
                    value={form.pdfFileName || ''}
                    onChange={(e) => setForm({ ...form, pdfFileName: e.target.value })}
                    placeholder="e.g. CBSE_Class10_Maths_2024.pdf"
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
                    <span>Save Paper (Mentor)</span>
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
