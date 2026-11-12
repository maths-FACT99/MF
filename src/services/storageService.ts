import {
  Student,
  TutorRating,
  StudyMaterialItem,
  QuestionPdfItem,
  StudentActivityLog,
  DemoInquiry,
  UserSession,
  FacultyProfile,
  ResultScorecard,
  ContactInfo,
  CourseBatchItem,
} from '../types';

const STORAGE_KEYS = {
  STUDENTS: 'mathsfact_v3_students',
  RATINGS: 'mathsfact_v3_ratings',
  STUDY_MATERIALS: 'mathsfact_v3_study_materials',
  QUESTION_PDFS: 'mathsfact_v3_question_pdfs',
  ACTIVITY_LOGS: 'mathsfact_v3_activity_logs',
  DEMO_INQUIRIES: 'mathsfact_v3_demo_inquiries',
  SESSION: 'mathsfact_user_session',
  FACULTY: 'mathsfact_faculty',
  RESULTS: 'mathsfact_v3_results',
  CONTACT: 'mathsfact_contact',
  COURSES: 'mathsfact_courses',
  MENTOR_PASSCODE: 'mathsfact_mentor_passcode',
};

// Initial Data: Strictly EMPTY as requested (No dummy demo requests, no dummy PDFs, no dummy results, no dummy students)
const INITIAL_STUDENTS: Student[] = [];
const INITIAL_RATINGS: TutorRating[] = [];
const INITIAL_STUDY_MATERIALS: StudyMaterialItem[] = [];
const INITIAL_QUESTION_PDFS: QuestionPdfItem[] = [];
const INITIAL_LOGS: StudentActivityLog[] = [];
const INITIAL_DEMO_INQUIRIES: DemoInquiry[] = [];
export const INITIAL_RESULTS: ResultScorecard[] = [];

// Real Faculty Profile for Satyam Sir (Editable by Mentor)
export const INITIAL_FACULTY: FacultyProfile = {
  name: 'Satyam Kumar',
  badge: 'FOUNDER & HEAD',
  title: 'Founder & Senior Mathematics Faculty',
  experience: '10+ Years Dedicated Classroom Experience • CBSE & ICSE Specialist',
  ratingScore: '4.9/5',
  ratingReviewers: 'Dhanbad Classroom Center',
  bio: 'Satyam Sir coaches students from primary foundation levels through senior board exams in Dhanbad. His teaching philosophy centers on dismantling intimidating formulas into intuitive axioms, empowering every student to think independently with zero rote memorization.',
  phone: '7004995470',
  whatsapp: '8294112559',
  principles: [
    'Individual Doubt Attention: No student left behind in silence.',
    'Systematic Homework Reviews & Step-by-Step Board Presentation Correction.',
    'Continuous Parent Communication & Transparent Test Result Accountability.',
  ],
};

// Real Center Contact Info in Dhanbad (Editable by Mentor)
export const INITIAL_CONTACT: ContactInfo = {
  centerName: 'MATHS FACT Institute',
  streetAddress: 'Aanand nagar, Lohar Kulli',
  cityStateZip: 'Dhanbad, Jharkhand - 826007',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Aanand+nagar+Lohar+Kulli+Dhanbad+Jharkhand+826007',
  primaryPhone: '7004995470',
  secondaryPhone: '8294112559',
  whatsappNumber: '8294112559',
  timingsWeekdays: 'Classes & Doubt Sessions: 02:00 PM – 08:00 PM (Monday to Saturday)',
  timingsSunday: 'Sunday: Special Board Mock Test & Diagnostics (10:00 AM – 02:00 PM)',
};

// Real Classroom Cohorts in Dhanbad (Editable by Mentor)
export const INITIAL_COURSES: CourseBatchItem[] = [
  {
    id: 'batch-pri',
    category: 'primary',
    title: 'Primary Foundation Cohort',
    grades: 'Class III – V',
    timing: '02:00 PM – 03:15 PM (Mon, Wed, Fri)',
    badge: 'Foundation First',
    description: 'Developing early numeracy intuition, arithmetic games, spatial visualization, and removing fear of numbers.',
    highlights: ['Interactive math manipulative tools', 'Mental calculation speed drills', 'Weekly illustrated worksheet challenges'],
  },
  {
    id: 'batch-mid',
    category: 'middle',
    title: 'Middle School Concept Accelerator',
    grades: 'Class VI – VIII',
    timing: '03:30 PM – 05:00 PM (Mon to Sat)',
    badge: 'Bridge to Boards',
    description: 'Transitioning from concrete arithmetic to symbolic algebra, Euclidean geometry, rational numbers, and Mensuration.',
    highlights: ['First-principles formula derivations', 'NCERT Exemplar problem-solving sets', 'Bi-weekly diagnostic unit tests'],
  },
  {
    id: 'batch-sec',
    category: 'secondary',
    title: 'Board Target Masterclass',
    grades: 'Class IX – X',
    timing: '05:00 PM – 06:30 PM (Mon to Sat)',
    badge: 'Board Excellence',
    description: 'Intensive CBSE & ICSE board preparation with real board answer sheet presentation training and 100/100 targets.',
    highlights: ['10-year board PYQ archives solved in class', 'Zero-error algebraic & geometric proof steps', 'Full-length 3-hour Sunday simulated board mock tests'],
  },
  {
    id: 'batch-sen',
    category: 'senior',
    title: 'Senior Secondary Calculus & Vectors',
    grades: 'Class XI – XII',
    timing: '06:30 PM – 08:00 PM (Mon to Sat)',
    badge: 'Advanced Mastery',
    description: 'Rigorous conceptual treatment of Differential & Integral Calculus, Matrices, 3D Geometry, and Probability.',
    highlights: ['Deep graphical analysis of functions', 'CBSE Class XII 100/100 step-by-step scoring framework', 'Dedicated individual doubt solving slots with Satyam Sir'],
  },
];

export const storageService = {
  // Session
  getSession(): UserSession {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : { role: 'guest' };
    } catch {
      return { role: 'guest' };
    }
  },
  setSession(session: UserSession) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  },
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  // Mentor Master Passcode
  getMentorPassword(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MENTOR_PASSCODE);
      return stored && stored.trim() ? stored.trim() : 'satyam123';
    } catch {
      return 'satyam123';
    }
  },
  setMentorPassword(passcode: string): void {
    localStorage.setItem(STORAGE_KEYS.MENTOR_PASSCODE, passcode.trim());
  },

  // Students
  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveStudent(student: Student) {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.unshift(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },
  updatePaymentStatus(id: string, paymentStatus: 'YES' | 'NO') {
    const students = this.getStudents();
    const student = students.find((s) => s.id === id);
    if (student) {
      student.paymentStatus = paymentStatus;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  },
  deleteStudent(id: string) {
    const students = this.getStudents().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Ratings
  getRatings(): TutorRating[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RATINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveRating(rating: TutorRating) {
    const ratings = this.getRatings();
    const idx = ratings.findIndex((r) => r.studentId === rating.studentId);
    if (idx >= 0) {
      ratings[idx] = rating;
    } else {
      ratings.push(rating);
    }
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
  },
  getRatingForStudent(studentId: string): TutorRating | undefined {
    return this.getRatings().find((r) => r.studentId === studentId);
  },
  getUnratedOrStaleStudents(): { student: Student; reason: 'NEVER_RATED' | 'STALE_RATING'; daysAgo?: number }[] {
    const students = this.getStudents();
    const ratings = this.getRatings();
    const result: { student: Student; reason: 'NEVER_RATED' | 'STALE_RATING'; daysAgo?: number }[] = [];
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    students.forEach((s) => {
      const r = ratings.find((item) => item.studentId === s.id);
      if (!r) {
        result.push({ student: s, reason: 'NEVER_RATED' });
      } else {
        const ratingDate = new Date(r.updatedAt).getTime();
        const diff = now - ratingDate;
        if (diff > thirtyDaysMs) {
          const daysAgo = Math.floor(diff / (24 * 60 * 60 * 1000));
          result.push({ student: s, reason: 'STALE_RATING', daysAgo });
        }
      }
    });

    return result;
  },

  // Study Materials
  getStudyMaterials(): StudyMaterialItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_MATERIALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveStudyMaterial(item: StudyMaterialItem) {
    const list = this.getStudyMaterials();
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(list));
  },
  updateStudyMaterial(item: StudyMaterialItem) {
    const list = this.getStudyMaterials();
    const idx = list.findIndex((m) => m.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(list));
  },
  deleteStudyMaterial(id: string) {
    const list = this.getStudyMaterials().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(list));
  },

  // Question PDFs
  getQuestionPdfs(): QuestionPdfItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTION_PDFS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveQuestionPdf(item: QuestionPdfItem) {
    const list = this.getQuestionPdfs();
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.QUESTION_PDFS, JSON.stringify(list));
  },
  updateQuestionPdf(item: QuestionPdfItem) {
    const list = this.getQuestionPdfs();
    const idx = list.findIndex((q) => q.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.QUESTION_PDFS, JSON.stringify(list));
  },
  deleteQuestionPdf(id: string) {
    const list = this.getQuestionPdfs().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTION_PDFS, JSON.stringify(list));
  },

  // Activity Logs
  getActivityLogs(studentId?: string): StudentActivityLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      const all: StudentActivityLog[] = data ? JSON.parse(data) : [];
      if (studentId) {
        return all.filter((l) => l.studentId === studentId);
      }
      return all;
    } catch {
      return [];
    }
  },
  logActivity(log: Omit<StudentActivityLog, 'id' | 'timestamp'>) {
    const logs = this.getActivityLogs();
    const entry: StudentActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 200)));
  },

  // Demo Inquiries
  getDemoInquiries(): DemoInquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_INQUIRIES);
      if (!data) return [];
      const list = JSON.parse(data);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },
  saveDemoInquiry(
    inquiry: Omit<DemoInquiry, 'id' | 'status' | 'submittedAt'> & {
      status?: DemoInquiry['status'];
      submittedAt?: string;
    }
  ): DemoInquiry {
    const inquiries = this.getDemoInquiries();
    const newInquiry: DemoInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: inquiry.status || 'Pending',
      submittedAt: inquiry.submittedAt || new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.DEMO_INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  },
  deleteDemoInquiry(id: string) {
    const inquiries = this.getDemoInquiries().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.DEMO_INQUIRIES, JSON.stringify(inquiries));
  },
  resetDemoInquiries() {
    localStorage.setItem(STORAGE_KEYS.DEMO_INQUIRIES, JSON.stringify([]));
    return [];
  },
  updateInquiryStatus(id: string, status: DemoInquiry['status'], notes?: string) {
    const inquiries = this.getDemoInquiries();
    const item = inquiries.find((i) => i.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      localStorage.setItem(STORAGE_KEYS.DEMO_INQUIRIES, JSON.stringify(inquiries));
    }
  },

  // Faculty Profile (Editable by Mentor)
  getFacultyProfile(): FacultyProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FACULTY);
      return data ? JSON.parse(data) : INITIAL_FACULTY;
    } catch {
      return INITIAL_FACULTY;
    }
  },
  saveFacultyProfile(profile: FacultyProfile) {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(profile));
  },

  // Results & Board Toppers (Editable by Mentor)
  getResultsScorecards(): ResultScorecard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveResultsScorecard(card: ResultScorecard) {
    const list = this.getResultsScorecards();
    const existingIdx = list.findIndex((c) => c.id === card.id);
    if (existingIdx >= 0) {
      list[existingIdx] = card;
    } else {
      list.unshift(card);
    }
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(list));
  },
  deleteResultsScorecard(id: string) {
    const list = this.getResultsScorecards().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(list));
  },

  // Contact Info & Location (Editable by Mentor)
  getContactInfo(): ContactInfo {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACT);
      return data ? JSON.parse(data) : INITIAL_CONTACT;
    } catch {
      return INITIAL_CONTACT;
    }
  },
  saveContactInfo(info: ContactInfo) {
    localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(info));
  },

  // Course Batches (Editable by Mentor)
  getCourseBatches(): CourseBatchItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSES);
      return data ? JSON.parse(data) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  },
  saveCourseBatches(batches: CourseBatchItem[]) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(batches));
  },
};
