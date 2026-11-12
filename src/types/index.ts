export type ClassGrade =
  | 'Class III'
  | 'Class IV'
  | 'Class V'
  | 'Class VI'
  | 'Class VII'
  | 'Class VIII'
  | 'Class IX'
  | 'Class X'
  | 'Class XI'
  | 'Class XII';

export type Subject = 'Mathematics' | 'Science' | 'Social Science' | 'Combined (All 3)';

export type PaymentStatus = 'YES' | 'NO';

export type PerformanceBadge =
  | 'Concept Master'
  | 'Consistent Performer'
  | 'Rapid Improver'
  | 'Board Exam Topper'
  | 'Rising Star';

export interface TutorRating {
  studentId: string;
  stars: number; // 1 to 5
  reviewNotes: string;
  badge: PerformanceBadge;
  updatedAt: string; // ISO date
  updatedBy: string; // "Satyam Sir"
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  classGrade: ClassGrade;
  schoolName: string;
  batchTiming: string;
  parentMobile: string;
  paymentStatus?: PaymentStatus;
  joinedDate?: string;
}

export interface StudyMaterialItem {
  id: string;
  title: string;
  chapter: string;
  classGrade: ClassGrade;
  subject: Subject;
  type: 'Concept Notes' | 'Formula Cheat Sheet' | 'Derivation Guide' | 'NCERT Solutions';
  samplePreviewQuestions: string[];
  pagesCount: number;
  pdfFileName: string;
  uploadedAt: string;
  pages: {
    pageNumber: number;
    title: string;
    content: string[];
    formulas?: string[];
    diagramNote?: string;
  }[];
}

export interface QuestionPdfItem {
  id: string;
  title: string;
  chapter: string;
  classGrade: ClassGrade;
  subject: Subject;
  type: 'Chapter Practice Sheet' | 'PYQ Board Paper' | 'Exemplar Problems' | 'Weekly Test Paper';
  year?: string;
  totalMarks?: number;
  sampleQuestions: string[];
  pagesCount: number;
  pdfFileName: string;
  uploadedAt: string;
  pages: {
    pageNumber: number;
    sectionTitle: string;
    questions: {
      qNum: number;
      text: string;
      marks: number;
      isSample: boolean; // Page 1 sample questions visible to guests
      solutionSummary?: string;
    }[];
  }[];
}

export interface StudentActivityLog {
  id: string;
  studentId: string;
  studentName: string;
  documentId: string;
  documentTitle: string;
  documentType: 'Study Material' | 'Question PDF';
  action: 'VIEWED' | 'DOWNLOADED' | 'PRINTED';
  timestamp: string; // ISO string
}

export interface DemoInquiry {
  id: string;
  studentName: string;
  parentMobile: string;
  classGrade: ClassGrade;
  schoolName: string;
  preferredTiming: string;
  status: 'Pending' | 'Contacted' | 'Demo Scheduled' | 'Admitted' | 'Enrolled' | 'Declined';
  submittedAt: string;
  notes?: string;
}

export interface FormulaBook {
  id: string;
  title: string;
  domain: string;
  classLevel: string;
  coverGradient: string;
  chainLength: number; // px for 3D physics rail
  accentColor: string;
  summary: string;
  formulas: {
    name: string;
    formula: string;
    explanation: string;
    example: string;
  }[];
  keyDerivations: string[];
}

export interface FacultyProfile {
  name: string;
  badge: string;
  title: string;
  experience: string;
  ratingScore: string;
  ratingReviewers: string;
  bio: string;
  phone: string;
  whatsapp: string;
  principles: string[];
}

export interface ResultScorecard {
  id: string;
  name: string;
  class: string;
  school: string;
  overallScore: string;
  mathScore: string;
  scienceScore: string;
  quote: string;
  year: string;
}

export interface ContactInfo {
  centerName: string;
  streetAddress: string;
  cityStateZip: string;
  googleMapsUrl: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  timingsWeekdays: string;
  timingsSunday: string;
}

export interface CourseBatchItem {
  id: string;
  category: 'foundation' | 'middle' | 'secondary' | 'senior' | 'primary';
  title: string;
  classes?: string;
  grades?: string;
  timing?: string;
  timings?: string;
  frequency?: string;
  badge: string;
  description: string;
  highlights: string[];
  subjects?: string[];
  books?: string[];
  isFeatured?: boolean;
}

export interface UserSession {
  role: 'guest' | 'mentor';
  mentorName?: string;
  adminName?: string;
  student?: Student;
}
