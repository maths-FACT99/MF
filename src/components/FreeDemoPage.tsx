import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  GraduationCap,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { googleDocsService } from '../services/googleDocsService';
import { ClassGrade } from '../types';
import { sound } from '../utils/audio';

interface FreeDemoPageProps {
  onSelectCourse?: (grade: string) => void;
}

export const FreeDemoPage: React.FC<FreeDemoPageProps> = () => {
  const [studentName, setStudentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [classGrade, setClassGrade] = useState<ClassGrade>('Class X');
  const [schoolName, setSchoolName] = useState('');
  const [preferredTiming, setPreferredTiming] = useState('Evening (05:00 PM - 06:30 PM)');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const gradeOptions: ClassGrade[] = [
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
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentMobile.trim() || !schoolName.trim()) {
      sound.playWrong();
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(parentMobile.replace(/\D/g, ''))) {
      sound.playWrong();
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    sound.playVictory();
    const newInquiry = storageService.saveDemoInquiry({
      studentName: studentName.trim(),
      parentMobile: parentMobile.trim(),
      classGrade,
      schoolName: schoolName.trim(),
      preferredTiming,
      notes: 'Submitted via 1-Week Free Demo dedicated page in Dhanbad.',
    });

    // Automatically append to connected Google Doc
    googleDocsService.appendDemoInquiry(newInquiry).catch(() => {});

    setSubmitted(true);
    setError('');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1720px] mx-auto">
      {/* Top Banner */}
      <div className="text-left max-w-3xl mb-12 space-y-4">
        <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
          <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
          <span>[ ZERO-FEE • ZERO-RISK • 1-WEEK CONCEPT TRIAL ]</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl text-[#111113] tracking-tighter leading-tight">
          Experience Satyam Sir’s{' '}
          <span className="text-[#E63946]">Concept Coaching Free</span>
        </h1>

        <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
          Attend 7 full days of live interactive classes for Class III to XII (CBSE &amp; ICSE) at our Dhanbad center.
          Verify our formula derivations, step-by-step clarity, and personalized doubt clearance
          before making any admission decision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white border-2 border-[#111113] p-6 sm:p-9 shadow-[8px_8px_0px_#111113] relative">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-[#E63946]" />
              </div>
              <h3 className="font-heading font-black text-3xl text-[#111113]">
                1-Week Free Demo Confirmed!
              </h3>
              <p className="text-sm font-mono text-[#52525B] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{studentName}</strong>! Satyam Sir has received your registration for <strong>{classGrade}</strong>. We will contact you at <strong>{parentMobile}</strong> within 2 hours with your demo batch timing and classroom pass.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:7004995470"
                  className="btn-ink text-xs flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Satyam Sir: 7004995470</span>
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline-ink text-xs"
                >
                  Submit Another Demo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="label text-[10px] block">
                  Registration Form
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113] mt-1">
                  Book Your 7-Day Free Seat
                </h3>
                <p className="text-xs font-mono text-[#71717A]">
                  Zero registration charge. Zero deposit. 100% free experience.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-mono font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-[#111113]">
                  Student Full Name <span className="text-[#E63946]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] text-sm focus:outline-none focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111113]">
                    Parent Contact Mobile <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={parentMobile}
                    onChange={(e) => setParentMobile(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] text-sm font-mono focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-[#111113]">
                    Student Grade <span className="text-[#E63946]">*</span>
                  </label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value as ClassGrade)}
                    className="w-full px-4 py-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] text-sm font-mono font-bold focus:outline-none focus:bg-white"
                  >
                    {gradeOptions.map((g) => (
                      <option key={g} value={g}>
                        {g} (CBSE &amp; ICSE)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* School Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-[#111113]">
                  Current School Name <span className="text-[#E63946]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DPS Dhanbad / Carmel School / De Nobili School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] text-sm focus:outline-none focus:bg-white font-medium"
                />
              </div>

              {/* Preferred Timing */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-[#111113]">Preferred Batch Timing</label>
                <select
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] text-sm font-mono focus:outline-none focus:bg-white"
                >
                  <option value="Morning (06:30 AM - 08:00 AM)">Morning (06:30 AM - 08:00 AM)</option>
                  <option value="Morning (08:00 AM - 09:30 AM)">Morning (08:00 AM - 09:30 AM)</option>
                  <option value="Afternoon (02:00 PM - 03:30 PM)">Afternoon (02:00 PM - 03:30 PM)</option>
                  <option value="Evening (03:45 PM - 05:00 PM)">Evening (03:45 PM - 05:00 PM)</option>
                  <option value="Evening (05:00 PM - 06:30 PM)">Evening (05:00 PM - 06:30 PM)</option>
                  <option value="Night (06:45 PM - 08:15 PM)">Night (06:45 PM - 08:15 PM)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-ink w-full flex items-center justify-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4 text-[#E63946]" />
                <span>Confirm 1-Week Free Demo Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#52525B] pt-1">
                <ShieldCheck className="w-4 h-4 text-[#E63946]" />
                <span>100% Free • No Payment Required • No Obligations</span>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: What Happens in 7 Days */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-2 border-[#111113] p-6 sm:p-7 shadow-[8px_8px_0px_#111113] space-y-6">
            <h3 className="font-heading font-black text-2xl text-[#111113] flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#E63946]" />
              What to Expect in 7 Days
            </h3>

            <div className="space-y-4 font-mono">
              <div className="flex items-start gap-3.5 p-3 bg-[#F8F7F4] border border-[#111113]">
                <div className="w-7 h-7 bg-[#111113] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111113]">Diagnostic Concept Assessment</h4>
                  <p className="text-xs text-[#52525B] mt-0.5">
                    Identify hidden gaps in previous years' arithmetic, algebra, or geometry foundations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 bg-[#F8F7F4] border border-[#111113]">
                <div className="w-7 h-7 bg-[#111113] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111113]">Live Formula Derivations</h4>
                  <p className="text-xs text-[#52525B] mt-0.5">
                    Experience proving theorems from first principles rather than memorizing formulas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 bg-[#F8F7F4] border border-[#111113]">
                <div className="w-7 h-7 bg-[#111113] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111113]">Printed Concept Sheet &amp; PYQ Kit</h4>
                  <p className="text-xs text-[#52525B] mt-0.5">
                    Receive chapter formula summary cheat sheets and past 5-year board question sheets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 bg-[#F8F7F4] border border-[#111113]">
                <div className="w-7 h-7 bg-[#111113] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  04
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111113]">Satyam Sir’s Personal Feedback</h4>
                  <p className="text-xs text-[#52525B] mt-0.5">
                    A 1-on-1 progress report and roadmap for achieving 95%+ in upcoming board exams.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="pt-4 border-t-2 border-[#111113] space-y-3">
              <div className="label text-[10px]">Need immediate assistance?</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:7004995470"
                  className="btn-outline-ink text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Call Sir</span>
                </a>
                <a
                  href="https://wa.me/917004995470"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold border-2 border-[#111113] shadow-[2px_2px_0px_#111113] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Aanand+nagar+Lohar+Kulli+Dhanbad+Jharkhand+826007"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 bg-[#F8F7F4] hover:bg-white text-[#111113] text-xs font-mono font-bold border-2 border-[#111113] flex items-center justify-center gap-1.5 transition-colors shadow-[2px_2px_0px_#111113]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Aanand nagar, Lohar Kulli, Dhanbad - 826007</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
