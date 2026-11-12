import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Student, ClassGrade, Subject } from '../types';
import { storageService } from './storageService';

// Ensure Firebase is initialized only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Auth Provider with requested Google Workspace scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/documents');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

const DOC_CONN_STORAGE_KEY = 'mathsfact_google_doc_conn';

export interface ConnectedDocInfo {
  id: string;
  title: string;
  type: 'doc' | 'sheet';
  url: string;
  lastSyncedAt?: string;
  studentCount?: number;
}

export const googleDocsService = {
  // Listen for Auth state changes
  initAuth(
    onAuthSuccess?: (user: User, token: string) => void,
    onAuthFailure?: () => void
  ) {
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user && cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      }
    });
  },

  // Host Sign In with Google
  async signInWithGoogle(): Promise<{ user: User; accessToken: string }> {
    try {
      isSigningIn = true;
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Failed to obtain Google Workspace access token.');
      }
      cachedAccessToken = credential.accessToken;
      return { user: result.user, accessToken: cachedAccessToken };
    } finally {
      isSigningIn = false;
    }
  },

  // Get cached access token
  async getAccessToken(): Promise<string | null> {
    return cachedAccessToken;
  },

  // Check if host is signed in with active token
  isAuthenticated(): boolean {
    return !!(auth.currentUser && cachedAccessToken);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Sign out
  async logout(): Promise<void> {
    await signOut(auth);
    cachedAccessToken = null;
  },

  // Stored connected document metadata
  getConnectedDoc(): ConnectedDocInfo | null {
    try {
      const data = localStorage.getItem(DOC_CONN_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setConnectedDoc(info: ConnectedDocInfo | null) {
    if (info) {
      localStorage.setItem(DOC_CONN_STORAGE_KEY, JSON.stringify(info));
    } else {
      localStorage.removeItem(DOC_CONN_STORAGE_KEY);
    }
  },

  // Parse Google Doc URL or ID
  parseDocUrlOrId(input: string): { type: 'doc' | 'sheet'; id: string } {
    const trimmed = input.trim();
    if (trimmed.includes('spreadsheets/d/')) {
      const match = trimmed.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return { type: 'sheet', id: match[1] };
      }
    }
    if (trimmed.includes('document/d/')) {
      const match = trimmed.match(/document\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return { type: 'doc', id: match[1] };
      }
    }
    // Default to doc ID if bare key
    return { type: 'doc', id: trimmed };
  },

  // 1. Create a formatted Google Doc for Student Roster & Passwords
  async createStudentRosterDoc(): Promise<ConnectedDocInfo> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Please sign in with Google first.');

    // 1. Create blank document
    const createRes = await fetch('https://docs.google.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'MATHS FACT - Student Roster & Login Passwords (by Satyam Sir)',
      }),
    });

    if (!createRes.ok) {
      const errJson = await createRes.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to create Google Doc.');
    }

    const doc = await createRes.json();
    const docId = doc.documentId;

    // 2. Insert initial formatted text with all students
    const existingStudents = storageService.getStudents();
    let rosterText = `MATHS FACT • OFFICIAL ENROLLED STUDENT DIRECTORY\n`;
    rosterText += `Institute: MATHS FACT Concept Coaching (Mentored by Satyam Sir)\n`;
    rosterText += `Location: Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand - 826007\n`;
    rosterText += `WhatsApp: 82941 12559 | Helpline: 7004995470\n`;
    rosterText += `Last Updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n`;
    rosterText += `====================================================================\n`;
    rosterText += `ACTIVE ENROLLED STUDENT ROSTER\n`;
    rosterText += `====================================================================\n\n`;

    existingStudents.forEach((s, idx) => {
      rosterText += `STUDENT #${idx + 1}:\n`;
      rosterText += `• Roll Number: ${s.rollNo}\n`;
      rosterText += `• Full Name: ${s.name}\n`;
      rosterText += `• Class / Grade: ${s.classGrade}\n`;
      rosterText += `• Parent Mobile: ${s.parentMobile}\n`;
      rosterText += `• Current School: ${s.schoolName}\n`;
      rosterText += `• Batch Timing: ${s.batchTiming}\n\n`;
    });

    rosterText += `====================================================================\n`;
    rosterText += `All question papers and study notes on MATHS FACT are 100% free and publicly accessible without student login.\n`;

    // Write text into document
    await fetch(`https://docs.google.com/v1/documents/${docId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: rosterText,
            },
          },
        ],
      }),
    });

    const info: ConnectedDocInfo = {
      id: docId,
      title: 'MATHS FACT - Student Roster & Login Passwords (by Satyam Sir)',
      type: 'doc',
      url: `https://docs.google.com/document/d/${docId}/edit`,
      lastSyncedAt: new Date().toISOString(),
      studentCount: existingStudents.length,
    };

    this.setConnectedDoc(info);
    return info;
  },

  // 2. Create a Google Sheet for Student Roster & Passwords
  async createStudentRosterSheet(): Promise<ConnectedDocInfo> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Please sign in with Google first.');

    const existingStudents = storageService.getStudents();
    const headers = [
      'Roll Number',
      'Student Name',
      'Class / Grade',
      'Parent Mobile Number',
      'School Name',
      'Batch Timing',
    ];

    const rows = existingStudents.map((s) => [
      s.rollNo,
      s.name,
      s.classGrade,
      s.parentMobile,
      s.schoolName,
      s.batchTiming,
    ]);

    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: 'MATHS FACT - Student Roster & Login Passwords',
        },
        sheets: [
          {
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: headers.map((h) => ({
                      userEnteredValue: { stringValue: h },
                    })),
                  },
                  ...rows.map((row) => ({
                    values: row.map((cell) => ({
                      userEnteredValue: { stringValue: String(cell) },
                    })),
                  })),
                ],
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to create Google Sheet.');
    }

    const sheetData = await res.json();
    const sheetId = sheetData.spreadsheetId;

    const info: ConnectedDocInfo = {
      id: sheetId,
      title: 'MATHS FACT - Student Roster & Login Passwords',
      type: 'sheet',
      url: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      lastSyncedAt: new Date().toISOString(),
      studentCount: existingStudents.length,
    };

    this.setConnectedDoc(info);
    return info;
  },

  // 3. Sync and Read Students from Google Doc or Google Sheet
  async syncStudentRoster(docOrSheetId: string, type: 'doc' | 'sheet'): Promise<Student[]> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Please sign in with Google to sync students.');

    let parsedStudents: Student[] = [];

    if (type === 'sheet') {
      parsedStudents = await this.fetchFromSheet(docOrSheetId, token);
    } else {
      parsedStudents = await this.fetchFromDoc(docOrSheetId, token);
    }

    if (parsedStudents.length === 0) {
      throw new Error(
        'No student records could be parsed. Ensure the document follows the MATHS FACT format with "PAYMENT SECTION: YES" and "STUDENT LOGIN PASSWORD".'
      );
    }

    // Merge/save with local storage so website student auth immediately uses it
    const localStudents = storageService.getStudents();
    const updatedList: Student[] = [...parsedStudents];

    // Preserve any existing students that weren't in the doc if desired, or sync completely
    parsedStudents.forEach((synced) => {
      storageService.saveStudent(synced);
    });

    // Update stored connection info
    const conn = this.getConnectedDoc();
    if (conn) {
      conn.lastSyncedAt = new Date().toISOString();
      conn.studentCount = updatedList.length;
      this.setConnectedDoc(conn);
    }

    return storageService.getStudents();
  },

  // Read Google Doc text and parse students
  async fetchFromDoc(docId: string, token: string): Promise<Student[]> {
    const res = await fetch(`https://docs.google.com/v1/documents/${docId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to read Google Doc.');
    }

    const doc = await res.json();
    const title = doc.title || 'MATHS FACT Google Doc';

    // Extract all text content
    let fullText = '';
    const bodyContent = doc.body?.content || [];
    bodyContent.forEach((elem: any) => {
      if (elem.paragraph) {
        elem.paragraph.elements?.forEach((el: any) => {
          if (el.textRun?.content) {
            fullText += el.textRun.content;
          }
        });
      }
    });

    // Parse student blocks
    const studentBlocks = fullText.split(/STUDENT\s*#?\d*:/i);
    const parsed: Student[] = [];

    studentBlocks.forEach((block, index) => {
      if (index === 0 && !block.toLowerCase().includes('roll number')) return;

      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      let rollNo = '';
      let name = '';
      let classGrade: ClassGrade = 'Class X';
      let mobile = '';
      let school = 'Nawada School';
      let rawPaymentStatus = 'NO';
      let password = '';
      let batchTiming = '05:00 PM - 06:30 PM (Mon-Sat)';
      let enrolledSubjects: Subject[] = ['Mathematics'];

      lines.forEach((line) => {
        const lower = line.toLowerCase();
        if (lower.includes('roll number:') || lower.includes('roll no:')) {
          rollNo = line.split(':')[1]?.trim() || '';
        } else if (lower.includes('full name:') || lower.includes('name:')) {
          name = line.split(':')[1]?.trim() || '';
        } else if (lower.includes('class / grade:') || lower.includes('class:') || lower.includes('grade:')) {
          const rawClass = line.split(':')[1]?.trim() || '';
          if (rawClass.includes('III')) classGrade = 'Class III';
          else if (rawClass.includes('IV')) classGrade = 'Class IV';
          else if (rawClass.includes('V') && !rawClass.includes('VI')) classGrade = 'Class V';
          else if (rawClass.includes('VI') && !rawClass.includes('VII') && !rawClass.includes('VIII')) classGrade = 'Class VI';
          else if (rawClass.includes('VII') && !rawClass.includes('VIII')) classGrade = 'Class VII';
          else if (rawClass.includes('VIII')) classGrade = 'Class VIII';
          else if (rawClass.includes('IX')) classGrade = 'Class IX';
          else if (rawClass.includes('XI') && !rawClass.includes('XII')) classGrade = 'Class XI';
          else if (rawClass.includes('XII')) classGrade = 'Class XII';
          else if (rawClass.includes('X')) classGrade = 'Class X';
        } else if (lower.includes('mobile number:') || lower.includes('mobile:') || lower.includes('phone:')) {
          mobile = line.split(':')[1]?.trim().replace(/\D/g, '') || '';
        } else if (lower.includes('current school:') || lower.includes('school:')) {
          school = line.split(':')[1]?.trim() || '';
        } else if (lower.includes('payment section:') || lower.includes('payment status:') || lower.includes('payment:')) {
          const val = line.split(':')[1]?.trim().toUpperCase() || '';
          rawPaymentStatus = val.includes('YES') || val.includes('PAID') ? 'YES' : 'NO';
        } else if (lower.includes('student login password:') || lower.includes('password:')) {
          password = line.split(':')[1]?.trim() || '';
          if (password.toLowerCase().includes('locked') || password.toLowerCase().includes('pending')) {
            password = '';
          }
        } else if (lower.includes('batch timing:') || lower.includes('batch:')) {
          batchTiming = line.split(':')[1]?.trim() || batchTiming;
        }
      });

      if (name && (mobile || rollNo)) {
        const id = rollNo ? `std-${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}` : `std-${Date.now()}-${index}`;
        const paymentStatus: 'YES' | 'NO' = rawPaymentStatus === 'YES' ? 'YES' : 'NO';
        const isPaid = paymentStatus === 'YES';

        // Auto-generate password if host wrote YES but didn't type a custom password
        let finalPassword = password;
        if (isPaid && !finalPassword) {
          const cleanName = name.split(' ')[0].replace(/[^a-zA-Z]/g, '');
          finalPassword = `MF@${cleanName}2024`;
        }

        parsed.push({
          id,
          rollNo: rollNo || `MF-${1000 + index}`,
          name,
          parentMobile: mobile || '9876543210',
          classGrade,
          schoolName: school || 'Dhanbad Public School',
          batchTiming,
          paymentStatus: 'YES',
          joinedDate: new Date().toISOString().split('T')[0],
        });
      }
    });

    return parsed;
  },

  // Read Google Sheet rows and parse students
  async fetchFromSheet(sheetId: string, token: string): Promise<Student[]> {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:I`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to read Google Sheet.');
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length <= 1) return [];

    const parsed: Student[] = [];
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rollNo = row[0]?.trim() || `MF-${1000 + i}`;
      const name = row[1]?.trim() || '';
      const classGrade = (row[2]?.trim() || 'Class X') as ClassGrade;
      const mobile = row[3]?.trim().replace(/\D/g, '') || '';
      const school = row[4]?.trim() || 'Nawada School';
      const rawPayment = (row[5]?.trim() || '').toUpperCase();
      const paymentStatus: 'YES' | 'NO' = rawPayment === 'YES' || rawPayment === 'PAID' ? 'YES' : 'NO';
      let password = row[6]?.trim() || '';
      const batchTiming = row[8]?.trim() || '05:00 PM - 06:30 PM (Mon-Sat)';

      if (name) {
        const isPaid = paymentStatus === 'YES';
        if (isPaid && (!password || password.toLowerCase().includes('locked'))) {
          const cleanName = name.split(' ')[0].replace(/[^a-zA-Z]/g, '');
          password = `MF@${cleanName}2024`;
        }

        parsed.push({
          id: `std-${rollNo.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          rollNo,
          name,
          classGrade,
          parentMobile: mobile || '9876543210',
          schoolName: school || 'Dhanbad Public School',
          batchTiming,
          paymentStatus: 'YES',
          joinedDate: new Date().toISOString().split('T')[0],
        });
      }
    }

    return parsed;
  },

  // 4. Update Student Payment Status & Password in Google Doc / Sheet with Confirmation
  async updateStudentInDocument(
    docOrSheetId: string,
    type: 'doc' | 'sheet',
    student: Student,
    newPaymentStatus: 'YES' | 'NO',
    newPassword?: string
  ): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Please sign in with Google first.');

    // Google Workspace mutation requirement:
    // Update the record in the connected doc / sheet
    if (type === 'sheet') {
      // Find row in sheet
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${docOrSheetId}/values/A:I`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const rows: string[][] = data.values || [];
        let targetRowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
          if (
            rows[i][0]?.toLowerCase() === student.rollNo.toLowerCase() ||
            rows[i][1]?.toLowerCase() === student.name.toLowerCase()
          ) {
            targetRowIndex = i + 1; // 1-indexed for sheets
            break;
          }
        }

        if (targetRowIndex > 0) {
          // Update column F (Payment)
          await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${docOrSheetId}/values/F${targetRowIndex}?valueInputOption=USER_ENTERED`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                values: [[newPaymentStatus]],
              }),
            }
          );
        }
      }
    } else {
      // For Google Doc: append an audit log note
      const updateNote = `\n[MENTOR UPDATE - ${new Date().toLocaleString('en-IN')}]: Student ${student.name} (${student.rollNo}) Payment marked as ${newPaymentStatus}.\n`;
      await fetch(`https://docs.google.com/v1/documents/${docOrSheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                endOfSegmentLocation: {},
                text: updateNote,
              },
            },
          ],
        }),
      });
    }
  },

  // --------------------------------------------------------------------------
  // GOOGLE DOCS INTEGRATION FOR 1-WEEK FREE DEMO REQUESTS
  // --------------------------------------------------------------------------
  getConnectedDemoDoc(): ConnectedDocInfo | null {
    try {
      const data = localStorage.getItem('mathsfact_google_demo_doc_conn');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setConnectedDemoDoc(info: ConnectedDocInfo | null) {
    if (info) {
      localStorage.setItem('mathsfact_google_demo_doc_conn', JSON.stringify(info));
    } else {
      localStorage.removeItem('mathsfact_google_demo_doc_conn');
    }
  },

  // Create official Google Document for Demo Inquiries
  async createDemoInquiriesDoc(customInquiries?: any[]): Promise<ConnectedDocInfo> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Please sign in with Google Workspace first.');

    const createRes = await fetch('https://docs.google.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'MATHS FACT - 1-Week Free Demo Class Requests & Leads (Satyam Sir)',
      }),
    });

    if (!createRes.ok) {
      const errJson = await createRes.json().catch(() => ({}));
      throw new Error(errJson.error?.message || 'Failed to create Demo Inquiries Google Doc.');
    }

    const doc = await createRes.json();
    const docId = doc.documentId;

    const inquiries = customInquiries || storageService.getDemoInquiries();
    let text = `====================================================================\n`;
    text += `MATHS FACT • 1-WEEK FREE DEMO CLASS LEADS & ADMISSION REQUESTS\n`;
    text += `Center: Aanand nagar, Lohar Kulli, Dhanbad, Jharkhand - 826007\n`;
    text += `Faculty & Mentor: Satyam Sir (Helpline: 7004995470 / 8294112559)\n`;
    text += `Document Generated: ${new Date().toLocaleString('en-IN')}\n`;
    text += `Total Demo Requests Registered: ${inquiries.length}\n`;
    text += `====================================================================\n\n`;

    inquiries.forEach((inq, idx) => {
      text += `DEMO REGISTRATION #${idx + 1}:\n`;
      text += `• Student Name: ${inq.studentName}\n`;
      text += `• Parent Mobile: ${inq.parentMobile}\n`;
      text += `• Grade / Class: ${inq.classGrade}\n`;
      text += `• School Name: ${inq.schoolName || 'Not Specified'}\n`;
      text += `• Preferred Timing: ${inq.preferredTiming || 'Flexible / Afternoon'}\n`;
      text += `• Lead Status: ${inq.status || 'Pending'}\n`;
      text += `• Submitted At: ${new Date(inq.submittedAt).toLocaleString('en-IN')}\n`;
      if (inq.notes) {
        text += `• Notes / Questions: ${inq.notes}\n`;
      }
      text += `--------------------------------------------------------------------\n\n`;
    });

    text += `[AUTOMATIC SYSTEM SYNC]: Any new demo registered on the MATHS FACT website will be appended below.\n`;

    // Insert formatted text
    await fetch(`https://docs.google.com/v1/documents/${docId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text,
            },
          },
        ],
      }),
    });

    const info: ConnectedDocInfo = {
      id: docId,
      title: 'MATHS FACT - 1-Week Free Demo Class Requests & Leads (Satyam Sir)',
      type: 'doc',
      url: `https://docs.google.com/document/d/${docId}/edit`,
      lastSyncedAt: new Date().toISOString(),
      studentCount: inquiries.length,
    };

    this.setConnectedDemoDoc(info);
    return info;
  },

  // Append a newly submitted demo inquiry directly to the Google Doc
  async appendDemoInquiry(inquiry: any, targetDocId?: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const connected = this.getConnectedDemoDoc() || this.getConnectedDoc();
      const docId = targetDocId || connected?.id;

      if (!token || !docId) {
        return false;
      }

      let appendText = `\n--------------------------------------------------------------------\n`;
      appendText += `NEW DEMO REGISTRATION [${new Date().toLocaleString('en-IN')}]:\n`;
      appendText += `• Student Name: ${inquiry.studentName}\n`;
      appendText += `• Parent Mobile: ${inquiry.parentMobile}\n`;
      appendText += `• Class: ${inquiry.classGrade}\n`;
      appendText += `• School: ${inquiry.schoolName || 'Not Specified'}\n`;
      appendText += `• Preferred Timing: ${inquiry.preferredTiming || 'Any'}\n`;
      if (inquiry.notes) {
        appendText += `• Message: ${inquiry.notes}\n`;
      }
      appendText += `• Status: PENDING CONTACT\n`;

      const res = await fetch(`https://docs.google.com/v1/documents/${docId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                endOfSegmentLocation: {},
                text: appendText,
              },
            },
          ],
        }),
      });

      return res.ok;
    } catch {
      return false;
    }
  },
};
