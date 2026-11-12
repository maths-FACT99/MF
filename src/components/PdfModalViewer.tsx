import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Printer,
  Download,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { StudyMaterialItem, QuestionPdfItem, UserSession } from '../types';
import { sound } from '../utils/audio';

interface PdfModalViewerProps {
  document: StudyMaterialItem | QuestionPdfItem | null;
  type: 'study' | 'question';
  session?: UserSession;
  onClose: () => void;
}

export const PdfModalViewer: React.FC<PdfModalViewerProps> = ({
  document,
  type,
  session,
  onClose,
}) => {
  if (!document) return null;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const totalPages = document.pagesCount;

  const handleDownload = () => {
    sound.playStreak();

    // Trigger instant file download simulation
    const blob = new Blob(
      [
        `MATHS FACT OFFICIAL ACADEMIC VAULT\nTitle: ${document.title}\nChapter: ${document.chapter}\nClass: ${document.classGrade}\nMentored by Satyam Sir (WhatsApp: 82941 12559 / Call: 7004995470)\nLocation: Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand 826007\n\n=== DOCUMENT DETAILS ===\n` +
          JSON.stringify(document, null, 2),
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.pdfFileName || `${document.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    sound.playTick();
    window.print();
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      sound.playTick();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      sound.playTick();
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Render Page Content based on whether it is Study Material or Question PDF
  const renderDocumentPage = () => {
    if (type === 'study') {
      const studyDoc = document as StudyMaterialItem;
      const pageData = studyDoc.pages?.find((p) => p.pageNumber === currentPage);

      if (!pageData) {
        return (
          <div className="space-y-4 font-mono text-sm">
            <div className="border-b-2 border-[#111113] pb-2">
              <span className="text-[10px] font-bold text-[#E63946] uppercase">
                Page {currentPage} of {totalPages} • {studyDoc.subject}
              </span>
              <h3 className="font-heading font-black text-xl text-[#111113] mt-1">
                {studyDoc.chapter} (Extended Derivations)
              </h3>
            </div>
            <p className="text-gray-800 leading-relaxed">
              Step-by-step rigorous logical breakdown for {studyDoc.title}.
            </p>
            <div className="p-3 bg-[#F8F7F4] border-2 border-[#111113] space-y-1">
              <span className="label text-[9px] block">Key Board Takeaway:</span>
              <ul className="text-xs space-y-1">
                {(studyDoc.samplePreviewQuestions || []).map((q, idx) => (
                  <li key={idx}>• {q}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="border-b-2 border-[#111113] pb-3">
            <span className="text-[10px] font-mono font-bold text-[#E63946] uppercase">
              Page {currentPage} of {totalPages} • {studyDoc.subject}
            </span>
            <h3 className="font-heading font-black text-xl text-[#111113] mt-0.5">
              {pageData.title}
            </h3>
          </div>

          {/* Body paragraphs */}
          <div className="space-y-3 text-sm text-[#111113] leading-relaxed font-sans">
            {pageData.content.map((c, i) => (
              <p key={i}>{c}</p>
            ))}
          </div>

          {/* Formulas Highlight Box if present */}
          {pageData.formulas && pageData.formulas.length > 0 && (
            <div className="p-4 bg-amber-50 border-2 border-[#111113] shadow-[4px_4px_0px_#111113] space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900 block">
                Fundamental Formulas &amp; Identities:
              </span>
              <div className="space-y-1 font-mono text-xs font-bold text-gray-900">
                {pageData.formulas.map((f, i) => (
                  <div key={i} className="p-1.5 bg-white border border-[#111113]">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {pageData.diagramNote && (
            <div className="p-3 bg-gray-100 border-2 border-[#111113] text-xs text-gray-700 font-mono">
              📌 Diagram Reference: {pageData.diagramNote}
            </div>
          )}
        </div>
      );
    } else {
      // Question PDF
      const qDoc = document as QuestionPdfItem;
      const pageData = qDoc.pages?.find((p) => p.pageNumber === currentPage);

      if (!pageData) {
        return (
          <div className="space-y-4 font-mono text-sm">
            <div className="border-b-2 border-[#111113] pb-2">
              <span className="text-[10px] font-bold text-[#E63946] uppercase">
                Page {currentPage} of {totalPages}
              </span>
              <h3 className="font-heading font-black text-lg text-[#111113] mt-1">
                Section B: Analytical &amp; Step-Marking Problems
              </h3>
            </div>
            <div className="space-y-2">
              {(qDoc.sampleQuestions || []).map((q, idx) => (
                <div key={idx} className="p-3 bg-[#F8F7F4] border border-[#111113]">
                  <span className="font-bold text-xs">Q{idx + 1}. {q}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="border-b-2 border-[#111113] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E63946] uppercase">
                Page {currentPage} of {totalPages}
              </span>
              <h3 className="font-heading font-black text-lg text-[#111113] mt-0.5">
                {pageData.sectionTitle}
              </h3>
            </div>
            {qDoc.totalMarks && (
              <span className="text-xs font-bold px-2.5 py-1 bg-[#111113] text-white font-mono">
                Total: {qDoc.totalMarks} Marks
              </span>
            )}
          </div>

          {/* Question List on this page */}
          <div className="space-y-4">
            {pageData.questions.map((q) => (
              <div key={q.qNum} className="p-4 bg-gray-50 border-2 border-[#111113] space-y-2">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="font-bold text-[#111113] font-mono">
                    Q{q.qNum}. {q.text}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-600 shrink-0">
                    [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </div>

                {q.solutionSummary && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-400 text-xs text-emerald-900 font-mono">
                    <strong>Solution Hint:</strong> {q.solutionSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#F8F7F4] border-4 border-[#111113] shadow-[12px_12px_0px_#111113] max-w-4xl w-full h-[92vh] flex flex-col overflow-hidden relative font-mono">
        {/* Top Viewer Control Bar */}
        <div className="p-4 bg-white border-b-2 border-[#111113] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#111113] text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-[#111113] text-sm sm:text-base line-clamp-1">
                {document.title}
              </h3>
              <p className="text-[11px] text-gray-600">
                {document.classGrade} • {document.subject} • {document.pdfFileName}
              </p>
            </div>
          </div>

          {/* Viewer Tools */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#F8F7F4] px-2 py-1 border-2 border-[#111113] text-xs text-[#111113]">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
                className="p-1 hover:text-[#E63946]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-9 text-center font-bold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                className="p-1 hover:text-[#E63946]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Print */}
            <button
              onClick={handlePrint}
              title="Print document"
              className="p-2 bg-[#F8F7F4] hover:bg-gray-200 text-[#111113] border-2 border-[#111113] text-xs flex items-center gap-1"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="btn-ink text-xs flex items-center gap-1.5 py-2 px-3.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 border-2 border-[#111113] bg-white hover:bg-red-100 text-[#111113] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Paper Canvas Document Area */}
        <div className="flex-1 bg-stone-200 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            className="w-full max-w-2xl bg-white border-2 border-[#111113] shadow-[8px_8px_0px_#111113] p-6 sm:p-10 text-black relative transition-all duration-200 min-h-[500px]"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Paper Header / Watermark */}
            <div className="flex items-center justify-between border-b-2 border-[#E63946] pb-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-[#E63946] text-sm tracking-tight">
                  MATHS FACT
                </span>
                <span className="text-[10px] text-gray-600 font-bold">• Satyam Sir Mentorship</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                Class III - XII CBSE &amp; ICSE
              </span>
            </div>

            {renderDocumentPage()}
          </div>
        </div>

        {/* Bottom Page Navigation Bar */}
        <div className="p-3 bg-white border-t-2 border-[#111113] flex items-center justify-between px-6 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="p-1.5 border-2 border-[#111113] bg-[#F8F7F4] text-[#111113] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[#111113] font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 border-2 border-[#111113] bg-[#F8F7F4] text-[#111113] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Free Public Vault: All Pages Unlocked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
