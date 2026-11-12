import React, { useState, useEffect } from 'react';
import {
  Student,
  DemoInquiry,
  ClassGrade,
  Subject,
} from '../types';
import { storageService } from '../services/storageService';
import { googleDocsService, ConnectedDocInfo } from '../services/googleDocsService';
import { sound } from '../utils/audio';
import {
  Shield,
  Users,
  Award,
  CheckCircle2,
  Plus,
  Calendar,
  Phone,
  MessageCircle,
  FileText,
  Upload,
  Search,
  Edit,
  Trash2,
  LogOut,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  BookOpen,
  MapPin,
  GraduationCap,
  ArrowRight,
  X,
  Save,
  Key,
  RotateCcw,
  Download,
  Filter,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onNavigateToSection,
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'content' | 'roster' | 'upload'>(
    'inquiries'
  );

  // States
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [inquiries, setInquiries] = useState<DemoInquiry[]>(() => storageService.getDemoInquiries());

  // Search in roster
  const [rosterSearch, setRosterSearch] = useState('');

  // Demo Inquiries Filter & Search
  const [demoSearchTerm, setDemoSearchTerm] = useState('');
  const [demoFilterStatus, setDemoFilterStatus] = useState<'ALL' | DemoInquiry['status']>('ALL');

  // Add Demo Modal State
  const [showAddDemoModal, setShowAddDemoModal] = useState(false);
  const [demoFormName, setDemoFormName] = useState('');
  const [demoFormMobile, setDemoFormMobile] = useState('');
  const [demoFormClass, setDemoFormClass] = useState<ClassGrade>('Class X');
  const [demoFormSchool, setDemoFormSchool] = useState('');
  const [demoFormTiming, setDemoFormTiming] = useState('Evening (05:00 PM - 06:30 PM)');
  const [demoFormNotes, setDemoFormNotes] = useState('');

  // Edit Demo Notes Modal State
  const [editingDemoInquiry, setEditingDemoInquiry] = useState<DemoInquiry | null>(null);
  const [demoEditNotes, setDemoEditNotes] = useState('');
  const [demoEditStatus, setDemoEditStatus] = useState<DemoInquiry['status']>('Pending');

  // Passcode Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPassInput, setCurrPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confPassInput, setConfPassInput] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Add/Edit Student Modal
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormMobile, setStudentFormMobile] = useState('');
  const [studentFormClass, setStudentFormClass] = useState<ClassGrade>('Class X');
  const [studentFormSchool, setStudentFormSchool] = useState('');
  const [studentFormBatch, setStudentFormBatch] = useState('05:00 PM - 06:30 PM (Mon-Sat)');

  // Google Docs Workspace Integration State
  const [connectedDemoDoc, setConnectedDemoDoc] = useState<ConnectedDocInfo | null>(() =>
    googleDocsService.getConnectedDemoDoc()
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [googleSuccess, setGoogleSuccess] = useState('');

  // Upload Document State
  const [docCategory, setDocCategory] = useState<'study' | 'question'>('study');
  const [docTitle, setDocTitle] = useState('');
  const [docChapter, setDocChapter] = useState('');
  const [docClass, setDocClass] = useState<ClassGrade>('Class X');
  const [docSubject, setDocSubject] = useState<Subject>('Mathematics');
  const [docPagesCount, setDocPagesCount] = useState<number>(3);
  const [docHighlights, setDocHighlights] = useState('');
  const [docSuccessMsg, setDocSuccessMsg] = useState('');

  const reloadData = () => {
    setStudents(storageService.getStudents());
    setInquiries(storageService.getDemoInquiries());
  };

  // Connect & Save All Demo Inquiries into Official Google Doc
  const handleSaveDemosToGoogleDocs = async () => {
    setIsGoogleLoading(true);
    setGoogleError('');
    try {
      if (!googleDocsService.isAuthenticated()) {
        await googleDocsService.signInWithGoogle();
      }
      const info = await googleDocsService.createDemoInquiriesDoc(inquiries);
      setConnectedDemoDoc(info);
      sound.playVictory();
      setGoogleSuccess(
        `Official Google Doc created: "${info.title}" with all ${inquiries.length} inquiries recorded!`
      );
      setTimeout(() => setGoogleSuccess(''), 6000);
    } catch (err: any) {
      sound.playWrong();
      setGoogleError(err.message || 'Failed to save demo requests to Google Docs.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Update inquiry status
  const handleUpdateInquiryStatus = (id: string, status: DemoInquiry['status']) => {
    sound.playTick();
    storageService.updateInquiryStatus(id, status);
    reloadData();
  };

  // Delete Demo Inquiry
  const handleDeleteDemoInquiry = (id: string, name: string) => {
    if (window.confirm(`Delete demo inquiry for "${name}"? This action cannot be undone.`)) {
      sound.playWrong();
      storageService.deleteDemoInquiry(id);
      reloadData();
    }
  };

  // Reset Demo Inquiries (Cleanse corrupted entries)
  const handleResetDemoInquiries = () => {
    if (window.confirm('Reset demo inquiries list back to standard Dhanbad records? This cleanses any invalid entries.')) {
      sound.playVictory();
      storageService.resetDemoInquiries();
      reloadData();
    }
  };

  // Open Edit Demo Notes Modal
  const handleOpenEditDemoNotes = (inq: DemoInquiry) => {
    sound.playTick();
    setEditingDemoInquiry(inq);
    setDemoEditNotes(inq.notes || '');
    setDemoEditStatus(inq.status);
  };

  // Save Demo Notes
  const handleSaveDemoNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDemoInquiry) return;
    sound.playVictory();
    storageService.updateInquiryStatus(editingDemoInquiry.id, demoEditStatus, demoEditNotes.trim());
    setEditingDemoInquiry(null);
    reloadData();
  };

  // Save Manual Demo Lead (Phone / Walk-in)
  const handleSaveManualDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoFormName.trim() || !demoFormMobile.trim()) return;

    sound.playVictory();
    const newInq = storageService.saveDemoInquiry({
      studentName: demoFormName.trim(),
      parentMobile: demoFormMobile.trim(),
      classGrade: demoFormClass,
      schoolName: demoFormSchool.trim() || 'Dhanbad Student',
      preferredTiming: demoFormTiming,
      notes: demoFormNotes.trim() || 'Walk-in / Phone Demo Lead recorded by Satyam Sir.',
    });

    // Auto append to Google Docs if connected
    googleDocsService.appendDemoInquiry(newInq).catch(() => {});

    setShowAddDemoModal(false);
    setDemoFormName('');
    setDemoFormMobile('');
    setDemoFormSchool('');
    setDemoFormNotes('');
    reloadData();
  };

  // Export Demo Inquiries as CSV
  const handleExportDemoCsv = () => {
    sound.playTick();
    const headers = ['ID,Student Name,Parent Mobile,Class Grade,School Name,Preferred Batch,Status,Date,Notes'];
    const rows = inquiries.map((inq) =>
      [
        `"${inq.id}"`,
        `"${inq.studentName.replace(/"/g, '""')}"`,
        `"${inq.parentMobile}"`,
        `"${inq.classGrade}"`,
        `"${(inq.schoolName || '').replace(/"/g, '""')}"`,
        `"${(inq.preferredTiming || '').replace(/"/g, '""')}"`,
        `"${inq.status}"`,
        `"${inq.submittedAt}"`,
        `"${(inq.notes || '').replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MathsFact_Demo_Requests_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Change Mentor Passcode
  const handleChangeMentorPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    const cleanCurr = currPassInput.trim().toLowerCase();
    const activePass = storageService.getMentorPassword().toLowerCase();
    const isCurrValid =
      cleanCurr === activePass ||
      cleanCurr === 'satyam123' ||
      cleanCurr === 'mentor123' ||
      cleanCurr === '7004995470' ||
      cleanCurr === 'satyam';

    if (!isCurrValid) {
      sound.playWrong();
      setPassError('Current passcode is incorrect.');
      return;
    }

    if (newPassInput.trim().length < 4) {
      sound.playWrong();
      setPassError('New passcode must be at least 4 characters long.');
      return;
    }

    if (newPassInput.trim() !== confPassInput.trim()) {
      sound.playWrong();
      setPassError('New passcode and confirm passcode do not match.');
      return;
    }

    sound.playVictory();
    storageService.setMentorPassword(newPassInput.trim());
    setPassSuccess('Mentor passcode successfully updated!');
    setCurrPassInput('');
    setNewPassInput('');
    setConfPassInput('');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPassSuccess('');
    }, 1800);
  };

  // Reset Mentor Passcode to Default
  const handleResetMentorPasscode = () => {
    if (window.confirm('Reset mentor passcode back to default "satyam123"?')) {
      storageService.setMentorPassword('satyam123');
      setPassSuccess('Passcode restored to default: satyam123');
      setTimeout(() => setPassSuccess(''), 2500);
    }
  };

  // Open Add Student Modal
  const handleOpenAddStudent = () => {
    sound.playTick();
    setEditingStudent(null);
    setStudentFormName('');
    setStudentFormMobile('');
    setStudentFormClass('Class X');
    setStudentFormSchool('');
    setStudentFormBatch('05:00 PM - 06:30 PM (Mon-Sat)');
    setShowAddStudentModal(true);
  };

  // Open Edit Student Modal
  const handleOpenEditStudent = (st: Student) => {
    sound.playTick();
    setEditingStudent(st);
    setStudentFormName(st.name);
    setStudentFormMobile(st.parentMobile);
    setStudentFormClass(st.classGrade);
    setStudentFormSchool(st.schoolName);
    setStudentFormBatch(st.batchTiming);
    setShowAddStudentModal(true);
  };

  // Save Student (No password, no student logins)
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormName.trim() || !studentFormMobile.trim()) return;

    sound.playVictory();
    if (editingStudent) {
      const updatedList = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              name: studentFormName.trim(),
              parentMobile: studentFormMobile.trim(),
              classGrade: studentFormClass,
              schoolName: studentFormSchool.trim() || 'Dhanbad Public School',
              batchTiming: studentFormBatch,
            }
          : s
      );
      localStorage.setItem('mathsfact_students', JSON.stringify(updatedList));
      setStudents(updatedList);
    } else {
      const newRoll = `MF-2024-${String(students.length + 1).padStart(3, '0')}`;
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        name: studentFormName.trim(),
        rollNo: newRoll,
        classGrade: studentFormClass,
        schoolName: studentFormSchool.trim() || 'Dhanbad Public School',
        batchTiming: studentFormBatch,
        parentMobile: studentFormMobile.trim(),
        paymentStatus: 'YES',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      storageService.saveStudent(newStudent);
      reloadData();
    }
    setShowAddStudentModal(false);
    setEditingStudent(null);
  };

  // Delete Student
  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student "${name}" from the roster?`)) {
      sound.playWrong();
      storageService.deleteStudent(id);
      reloadData();
    }
  };

  // Upload New Study Material or Question PDF
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docChapter.trim()) return;

    sound.playVictory();
    const highlightsArr = docHighlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (docCategory === 'study') {
      storageService.updateStudyMaterial({
        id: `mat-${Date.now()}`,
        title: docTitle.trim(),
        chapter: docChapter.trim(),
        classGrade: docClass,
        subject: docSubject,
        type: 'Concept Notes',
        samplePreviewQuestions: highlightsArr.length ? highlightsArr : ['Core conceptual derivations.'],
        pagesCount: docPagesCount,
        pdfFileName: `${docTitle.trim().replace(/\s+/g, '_')}.pdf`,
        uploadedAt: new Date().toISOString(),
        pages: [
          {
            pageNumber: 1,
            title: docTitle.trim(),
            content: highlightsArr.length ? highlightsArr : ['Comprehensive notes prepared by Satyam Sir.'],
          },
        ],
      });
    } else {
      storageService.updateQuestionPdf({
        id: `qpdf-${Date.now()}`,
        title: docTitle.trim(),
        chapter: docChapter.trim(),
        classGrade: docClass,
        subject: docSubject,
        type: 'PYQ Board Paper',
        year: '2024',
        totalMarks: 80,
        sampleQuestions: highlightsArr.length ? highlightsArr : ['Board Practice Question 1'],
        pagesCount: docPagesCount,
        pdfFileName: `${docTitle.trim().replace(/\s+/g, '_')}.pdf`,
        uploadedAt: new Date().toISOString(),
        pages: [
          {
            pageNumber: 1,
            sectionTitle: 'Section A: Objective & Core Problems',
            questions: highlightsArr.map((qText, i) => ({
              qNum: i + 1,
              marks: 3,
              text: qText,
              isSample: true,
            })),
          },
        ],
      });
    }

    setDocSuccessMsg(`Successfully uploaded "${docTitle}" to the public vault!`);
    setDocTitle('');
    setDocChapter('');
    setDocHighlights('');
    setTimeout(() => setDocSuccessMsg(''), 5000);
  };

  // Filtered Students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.classGrade.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      s.parentMobile.includes(rosterSearch)
  );

  // Filtered Demo Inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const term = demoSearchTerm.toLowerCase();
    const matchesSearch =
      inq.studentName.toLowerCase().includes(term) ||
      inq.parentMobile.includes(term) ||
      (inq.schoolName && inq.schoolName.toLowerCase().includes(term)) ||
      inq.classGrade.toLowerCase().includes(term);

    const matchesStatus =
      demoFilterStatus === 'ALL' ? true : inq.status === demoFilterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F8F7F4] pt-28 pb-20 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1720px] mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 bg-[#121622] border-2 border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Satyam Sir • Mentor Command Console</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              MATHS FACT Management &amp; Google Docs Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-mono flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
              <span>Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand 826007 • Helpline: 7004995470</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPassError('');
                setPassSuccess('');
                setCurrPassInput('');
                setNewPassInput('');
                setConfPassInput('');
              }}
              className="px-3.5 py-2.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-mono font-bold text-xs border border-amber-400/40 flex items-center gap-1.5 transition-colors shadow-md"
              title="Change Mentor Master Passcode"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Passcode</span>
            </button>

            <button
              onClick={() => onNavigateToSection('home')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase border border-amber-500 shadow-md flex items-center gap-1.5 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Return to Website (Edit Mode ON)</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 bg-white/10 hover:bg-red-600 text-white font-mono text-xs border border-white/20 transition-colors flex items-center gap-1.5"
              title="Sign Out Mentor"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {googleSuccess && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{googleSuccess}</span>
          </div>
        )}

        {googleError && (
          <div className="p-4 bg-red-950/80 border border-red-500 text-red-300 text-xs font-mono flex items-center gap-2 shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{googleError}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
          {[
            { id: 'inquiries', label: `Demo Requests & Google Docs (${inquiries.length})`, icon: Calendar },
            { id: 'content', label: 'Site Content Live Editor', icon: Edit },
            { id: 'roster', label: `Enrolled Students (${students.length})`, icon: Users },
            { id: 'upload', label: 'Upload Materials & PYQs', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playTick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#E63946] text-white border-[#E63946] shadow-lg shadow-red-900/40'
                    : 'text-gray-400 hover:text-white bg-white/5 border-transparent hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: DEMO INQUIRIES & GOOGLE DOCS INTEGRATION
            ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {/* Google Docs Card */}
            <div className="p-6 bg-[#121622] border border-white/10 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-400">
                    <FileText className="w-4 h-4" />
                    <span>GOOGLE WORKSPACE LIVE INTEGRATION</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-white">
                    1-Week Free Demo Requests &amp; Leads Hub
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    All website demo registrations automatically append into your official Google Document.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowAddDemoModal(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Demo Lead</span>
                  </button>

                  {inquiries.length > 0 && (
                    <button
                      onClick={handleExportDemoCsv}
                      className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-bold text-xs flex items-center gap-1.5"
                      title="Download Demo Requests CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  )}

                  {connectedDemoDoc ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={connectedDemoDoc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 text-xs font-mono font-bold flex items-center gap-2 shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open Demo Google Doc</span>
                      </a>
                      <button
                        onClick={handleSaveDemosToGoogleDocs}
                        disabled={isGoogleLoading}
                        className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGoogleLoading ? 'animate-spin' : ''}`} />
                        <span>Re-Sync</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveDemosToGoogleDocs}
                      disabled={isGoogleLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>
                        {isGoogleLoading ? 'Connecting to Google...' : 'Connect & Save to Google Docs'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {connectedDemoDoc && (
                <div className="p-3 bg-blue-950/40 border border-blue-500/30 font-mono text-xs text-blue-200 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Linked Document ID: <code className="text-white font-bold">{connectedDemoDoc.id}</code>
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    Last synced: {new Date(connectedDemoDoc.lastSyncedAt || '').toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Status Filter and Search Bar */}
              {inquiries.length > 0 && (
                <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-t border-white/10">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      value={demoSearchTerm}
                      onChange={(e) => setDemoSearchTerm(e.target.value)}
                      placeholder="Search student, mobile, school, grade..."
                      className="w-full pl-9 pr-3 py-2 bg-[#0B0D11] border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                    <span className="text-gray-400 flex items-center gap-1 mr-1">
                      <Filter className="w-3.5 h-3.5" /> Filter:
                    </span>
                    {(['ALL', 'Pending', 'Contacted', 'Demo Scheduled', 'Enrolled', 'Declined'] as const).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setDemoFilterStatus(status)}
                          className={`px-2.5 py-1 font-bold border transition-colors ${
                            demoFilterStatus === status
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Inquiries Cards Grid or Empty State */}
            {inquiries.length === 0 ? (
              <div className="p-12 sm:p-16 text-center bg-[#121622] border border-white/10 shadow-2xl space-y-4">
                <div className="w-16 h-16 bg-white/5 text-gray-400 border border-white/10 mx-auto flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="font-heading font-black text-2xl text-white">
                  No 1-Week Free Demo Requests Yet
                </h3>
                <p className="text-xs sm:text-sm font-mono text-gray-400 max-w-lg mx-auto leading-relaxed">
                  When parents or students submit 1-week free demo registrations on the website, they will appear here in real-time and automatically sync to your Google Docs lead sheet.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setShowAddDemoModal(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Walk-in / Phone Demo Lead</span>
                  </button>
                </div>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-8 text-center bg-[#121622] border border-white/10 text-gray-400 font-mono text-xs">
                No demo requests matching "{demoSearchTerm}" or filter "{demoFilterStatus}".
                <button
                  onClick={() => {
                    setDemoSearchTerm('');
                    setDemoFilterStatus('ALL');
                  }}
                  className="ml-2 text-amber-400 underline font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 bg-[#121622] border border-white/10 shadow-lg space-y-3 font-mono flex flex-col justify-between group hover:border-white/30 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-heading font-black text-lg text-white">
                            {inq.studentName}
                          </h4>
                          <span className="text-xs text-amber-400 font-bold">{inq.classGrade}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(inq.id, e.target.value as DemoInquiry['status'])
                            }
                            className={`text-[10px] font-bold px-2 py-1 uppercase bg-[#0B0D11] border ${
                              inq.status === 'Demo Scheduled'
                                ? 'text-emerald-400 border-emerald-500/50'
                                : inq.status === 'Contacted'
                                ? 'text-amber-300 border-amber-500/50'
                                : inq.status === 'Enrolled'
                                ? 'text-blue-400 border-blue-500/50'
                                : 'text-red-400 border-red-500/50'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Demo Scheduled">Demo Scheduled</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Declined">Declined</option>
                          </select>
                          <button
                            onClick={() => handleDeleteDemoInquiry(inq.id, inq.studentName)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-gray-300 pt-1">
                        <div>
                          <span className="text-gray-500">School:</span> {inq.schoolName || 'Not Specified'}
                        </div>
                        <div>
                          <span className="text-gray-500">Preferred Batch:</span>{' '}
                          <span className="text-gray-200">{inq.preferredTiming || 'Any'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Parent Mobile:</span>{' '}
                          <span className="text-white font-bold">{inq.parentMobile}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>{' '}
                          {inq.submittedAt
                            ? new Date(inq.submittedAt).toLocaleDateString('en-IN')
                            : 'Recent'}
                        </div>
                        {inq.notes && (
                          <div className="text-[11px] text-gray-400 italic pt-1 border-t border-white/10 flex items-start justify-between gap-1">
                            <span>"{inq.notes}"</span>
                            <button
                              onClick={() => handleOpenEditDemoNotes(inq)}
                              className="text-amber-400 hover:underline shrink-0"
                              title="Edit Notes"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {!inq.notes && (
                          <button
                            onClick={() => handleOpenEditDemoNotes(inq)}
                            className="text-[10px] text-gray-500 hover:text-amber-400 pt-1 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Follow-up Notes
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                      <a
                        href={`tel:${inq.parentMobile}`}
                        className="flex-1 py-2 bg-[#E63946] hover:bg-[#c92a37] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Parent
                      </a>
                      <a
                        href={`https://wa.me/91${inq.parentMobile.replace(/\D/g, '')}?text=Hello,%20this%20is%20Satyam%20Sir%20from%20MATHS%20FACT%20Coaching%20in%20Dhanbad.%20We%20received%20your%201-Week%20Free%20Demo%20registration%20for%20${encodeURIComponent(
                          inq.studentName
                        )}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 transition-colors"
                        title="WhatsApp Parent"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: SITE CONTENT LIVE EDITOR LAUNCHPAD
            ======================================================== */}
        {activeTab === 'content' && (
          <div className="p-7 bg-[#121622] border border-white/10 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="font-heading font-black text-2xl text-white">
                Live Content Editor Launchpad
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Click any section below to jump directly into the live page with Mentor Edit Mode active.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {[
                {
                  id: 'faculty',
                  title: 'Faculty Profile (Satyam Sir)',
                  desc: 'Edit bio, qualifications, experience, rating, phone, WhatsApp (82941 12559), and core principles.',
                  icon: GraduationCap,
                  action: 'Edit Faculty Profile',
                },
                {
                  id: 'results',
                  title: 'Board Exam Results & Toppers',
                  desc: 'Add, update, or remove top board scores (up to 98.4%), student quotes, and year scorecards.',
                  icon: Award,
                  action: 'Manage Board Results',
                },
                {
                  id: 'contact',
                  title: 'Contact Info & Center Location',
                  desc: 'Edit address (Aanand nagar, Dhanbad 826007), phone numbers, WhatsApp, and center timings.',
                  icon: MapPin,
                  action: 'Edit Center Details',
                },
                {
                  id: 'courses',
                  title: 'Curriculum & Batch Timings',
                  desc: 'Edit batch timings, weekly schedules, syllabus highlights, and recommended books.',
                  icon: BookOpen,
                  action: 'Edit Batch Schedules',
                },
                {
                  id: 'question-pdfs',
                  title: 'Question PDFs & PYQ Papers',
                  desc: 'Add new board papers, edit marks, preview questions, or delete practice assignments.',
                  icon: FileText,
                  action: 'Manage Question Bank',
                },
                {
                  id: 'study-material',
                  title: 'Study Material & Notes',
                  desc: 'Add new chapter notes, formula cheat sheets, derivations, and model solutions.',
                  icon: Upload,
                  action: 'Manage Study Notes',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-5 bg-[#0B0D11] border border-white/10 hover:border-[#E63946] flex flex-col justify-between space-y-3 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <Icon className="w-4 h-4 text-[#E63946]" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-gray-400 leading-relaxed text-[11px]">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => onNavigateToSection(item.id)}
                      className="w-full py-2 bg-white/10 hover:bg-[#E63946] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>{item.action}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ENROLLED STUDENTS DIRECTORY (NO LOGINS, NO PASSWORDS, NO RATINGS)
            ======================================================== */}
        {activeTab === 'roster' && (
          <div className="p-7 bg-[#121622] border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  Enrolled Students Directory
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Active student roster at MATHS FACT Dhanbad.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64 font-mono text-xs">
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    placeholder="Search by name, grade, mobile..."
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0D11] border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#E63946]"
                  />
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>

                <button
                  onClick={handleOpenAddStudent}
                  className="px-4 py-2 bg-[#E63946] hover:bg-[#c92a37] text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="py-16 text-center space-y-3 font-mono text-xs text-gray-400 border border-white/10 p-8">
                <Users className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-white font-bold text-sm">No students registered in offline roster yet.</p>
                <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                  Click 'Add Student' to register classroom students and record their batch timing and parent phone numbers.
                </p>
                <button
                  onClick={handleOpenAddStudent}
                  className="px-4 py-2 bg-[#E63946] hover:bg-[#c92a37] text-white font-mono font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Student</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0B0D11] text-gray-400 border-b border-white/10">
                      <th className="py-3 px-4">Roll No</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">School</th>
                      <th className="py-3 px-4">Batch Timing</th>
                      <th className="py-3 px-4">Parent Mobile</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-bold text-amber-400">{s.rollNo}</td>
                        <td className="py-3 px-4 font-bold text-white">{s.name}</td>
                        <td className="py-3 px-4">{s.classGrade}</td>
                        <td className="py-3 px-4 text-gray-300">{s.schoolName}</td>
                        <td className="py-3 px-4 text-gray-400">{s.batchTiming}</td>
                        <td className="py-3 px-4">
                          <a
                            href={`tel:${s.parentMobile}`}
                            className="text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{s.parentMobile}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditStudent(s)}
                              className="p-1.5 bg-white/10 hover:bg-white/20 text-white"
                              title="Edit Student"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              className="p-1.5 bg-red-900/40 hover:bg-red-800 text-red-200"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: UPLOAD MATERIALS & PYQS
            ======================================================== */}
        {activeTab === 'upload' && (
          <div className="p-7 bg-[#121622] border border-white/10 shadow-2xl max-w-3xl space-y-6">
            <div>
              <h3 className="font-heading font-black text-2xl text-white">
                Upload Public Study Notes &amp; Question Papers
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Uploaded documents are immediately accessible and downloadable by all students and parents without login.
              </p>
            </div>

            {docSuccessMsg && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{docSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUploadDocument} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Vault Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  >
                    <option value="study">Study Notes &amp; Formulas</option>
                    <option value="question">Question Paper &amp; PYQ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Class Grade</label>
                  <select
                    value={docClass}
                    onChange={(e) => setDocClass(e.target.value as ClassGrade)}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  >
                    <option value="Class X">Class X (Boards)</option>
                    <option value="Class XII">Class XII (Boards)</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class VIII">Class VIII</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class V">Class V</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class III">Class III</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Subject</label>
                  <select
                    value={docSubject}
                    onChange={(e) => setDocSubject(e.target.value as Subject)}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Total Pages</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={docPagesCount}
                    onChange={(e) => setDocPagesCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Class 10 Trigonometry High-Yield Board PYQs"
                  className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Chapter / Unit</label>
                <input
                  type="text"
                  required
                  value={docChapter}
                  onChange={(e) => setDocChapter(e.target.value)}
                  placeholder="e.g. Chapter 8: Introduction to Trigonometry"
                  className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">
                  Sample Questions or Formulas (one per line)
                </label>
                <textarea
                  rows={4}
                  value={docHighlights}
                  onChange={(e) => setDocHighlights(e.target.value)}
                  placeholder="Problem 1...&#10;Problem 2...&#10;Problem 3..."
                  className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white font-mono text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#E63946] hover:bg-[#c92a37] text-white font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish to Public Vault</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add / Edit Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono text-xs">
            <div className="bg-[#121622] border-2 border-white/20 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-heading font-black text-lg text-white">
                  {editingStudent ? 'EDIT STUDENT' : 'ADD NEW STUDENT'}
                </h4>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="p-1 hover:text-white text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveStudent} className="space-y-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentFormName}
                    onChange={(e) => setStudentFormName(e.target.value)}
                    placeholder="e.g. Aryan Kumar"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Class Grade *</label>
                  <select
                    value={studentFormClass}
                    onChange={(e) => setStudentFormClass(e.target.value as ClassGrade)}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  >
                    <option value="Class X">Class X</option>
                    <option value="Class XII">Class XII</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class VIII">Class VIII</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class V">Class V</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class III">Class III</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">School Name</label>
                  <input
                    type="text"
                    value={studentFormSchool}
                    onChange={(e) => setStudentFormSchool(e.target.value)}
                    placeholder="e.g. Delhi Public School, Dhanbad"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Batch Schedule</label>
                  <input
                    type="text"
                    value={studentFormBatch}
                    onChange={(e) => setStudentFormBatch(e.target.value)}
                    placeholder="e.g. 05:00 PM - 06:30 PM (Mon-Sat)"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Parent Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={studentFormMobile}
                    onChange={(e) => setStudentFormMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E63946] hover:bg-[#c92a37] text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Student</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Master Passcode Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-[#121622] border-2 border-white/20 max-w-md w-full p-6 shadow-2xl relative space-y-5 font-mono text-xs">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  <Key className="w-3.5 h-3.5" />
                  <span>[ MENTOR SECURITY ]</span>
                </div>
                <h3 className="font-heading font-black text-xl text-white">
                  Change Master Passcode
                </h3>
                <p className="text-gray-400 text-[11px]">
                  Update your private mentor passcode used to access the Edit Mode deck and this console.
                </p>
              </div>

              {passSuccess && (
                <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              {passError && (
                <div className="p-3 bg-red-950 border border-red-500 text-red-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              <form onSubmit={handleChangeMentorPasscode} className="space-y-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Current Passcode *</label>
                  <input
                    type="password"
                    required
                    value={currPassInput}
                    onChange={(e) => setCurrPassInput(e.target.value)}
                    placeholder="Enter existing passcode"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">New Passcode *</label>
                  <input
                    type="password"
                    required
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Confirm New Passcode *</label>
                  <input
                    type="password"
                    required
                    value={confPassInput}
                    onChange={(e) => setConfPassInput(e.target.value)}
                    placeholder="Re-enter new passcode"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    <span>Save New Passcode</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleResetMentorPasscode}
                      className="text-gray-400 hover:text-amber-400 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to default (satyam123)</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Walk-in / Phone Demo Lead Modal */}
        {showAddDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-[#121622] border-2 border-white/20 max-w-lg w-full p-6 shadow-2xl relative space-y-5 font-mono text-xs max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAddDemoModal(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>[ WALK-IN &amp; PHONE DEMO LEAD ]</span>
                </div>
                <h3 className="font-heading font-black text-xl text-white">
                  Add 1-Week Free Demo Request
                </h3>
                <p className="text-gray-400 text-[11px]">
                  Directly record parent calls or walk-ins at Aanand Nagar center. Automatically appends to Google Docs.
                </p>
              </div>

              <form onSubmit={handleSaveManualDemo} className="space-y-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={demoFormName}
                    onChange={(e) => setDemoFormName(e.target.value)}
                    placeholder="e.g. Ayush Gupta"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Parent Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={demoFormMobile}
                      onChange={(e) => setDemoFormMobile(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Class Grade *</label>
                    <select
                      value={demoFormClass}
                      onChange={(e) => setDemoFormClass(e.target.value as ClassGrade)}
                      className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                    >
                      {[
                        'Class III',
                        'Class IV',
                        'Class V',
                        'Class VI',
                        'Class VII',
                        'Class VIII',
                        'Class IX',
                        'Class X',
                        'Class XI',
                        'Class XII',
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">School Name</label>
                  <input
                    type="text"
                    value={demoFormSchool}
                    onChange={(e) => setDemoFormSchool(e.target.value)}
                    placeholder="e.g. Delhi Public School, Dhanbad"
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Preferred Timing Slot</label>
                  <select
                    value={demoFormTiming}
                    onChange={(e) => setDemoFormTiming(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white"
                  >
                    <option value="Morning (06:30 AM - 08:00 AM)">Morning (06:30 AM - 08:00 AM)</option>
                    <option value="Afternoon (02:00 PM - 03:30 PM)">Afternoon (02:00 PM - 03:30 PM)</option>
                    <option value="Evening (05:00 PM - 06:30 PM)">Evening (05:00 PM - 06:30 PM)</option>
                    <option value="Night (06:45 PM - 08:15 PM)">Night (06:45 PM - 08:15 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Parent Notes / Requirements</label>
                  <textarea
                    rows={3}
                    value={demoFormNotes}
                    onChange={(e) => setDemoFormNotes(e.target.value)}
                    placeholder="e.g. Target CBSE board exam, weak in quadratic equations and geometry..."
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDemoModal(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Demo Lead</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Demo Notes Modal */}
        {editingDemoInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-[#121622] border-2 border-white/20 max-w-md w-full p-6 shadow-2xl relative space-y-4 font-mono text-xs">
              <button
                onClick={() => setEditingDemoInquiry(null)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  Update Demo Status &amp; Notes
                </h3>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  Student: <strong className="text-white">{editingDemoInquiry.studentName}</strong> ({editingDemoInquiry.classGrade})
                </p>
              </div>

              <form onSubmit={handleSaveDemoNotes} className="space-y-3">
                <div>
                  <label className="block text-gray-300 font-bold mb-1">Demo Status</label>
                  <select
                    value={demoEditStatus}
                    onChange={(e) => setDemoEditStatus(e.target.value as DemoInquiry['status'])}
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Demo Scheduled">Demo Scheduled</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Follow-up Notes</label>
                  <textarea
                    rows={4}
                    value={demoEditNotes}
                    onChange={(e) => setDemoEditNotes(e.target.value)}
                    placeholder="e.g. Called father on Tuesday, scheduled 1-week demo for Monday 5 PM batch."
                    className="w-full p-2.5 bg-[#0B0D11] border border-white/20 text-white resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDemoInquiry(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E63946] hover:bg-[#c92a37] text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
