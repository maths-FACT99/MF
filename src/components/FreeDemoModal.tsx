import React, { useState } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Phone,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { googleDocsService } from '../services/googleDocsService';
import { ClassGrade } from '../types';
import { sound } from '../utils/audio';

interface FreeDemoModalProps {
  isOpen: boolean;
  prefilledGrade?: string;
  onClose: () => void;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({
  isOpen,
  prefilledGrade,
  onClose,
}) => {
  const [studentName, setStudentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [classGrade, setClassGrade] = useState<ClassGrade>(
    (prefilledGrade as ClassGrade) || 'Class X'
  );
  const [schoolName, setSchoolName] = useState('');
  const [preferredTiming, setPreferredTiming] = useState('Evening (05:00 PM - 06:30 PM)');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
    const newInq = storageService.saveDemoInquiry({
      studentName: studentName.trim(),
      parentMobile: parentMobile.trim(),
      classGrade,
      schoolName: schoolName.trim(),
      preferredTiming,
      notes: 'Submitted via 1-Week Free Demo online booking modal.',
    });

    // Auto-sync directly to connected Google Docs lead document
    googleDocsService.appendDemoInquiry(newInq).catch(() => {});

    setSubmitted(true);
  };

  const handleReset = () => {
    setStudentName('');
    setParentMobile('');
    setSchoolName('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-[#111113] max-w-lg w-full p-6 sm:p-8 shadow-[8px_8px_0px_#111113] relative space-y-6">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 bg-[#F8F7F4] hover:bg-[#111113] hover:text-white text-[#111113] border-2 border-[#111113] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-[#E63946]" />
            </div>

            <div>
              <h3 className="font-heading font-black text-2xl text-[#111113]">
                Demo Booking Confirmed!
              </h3>
              <p className="text-xs font-mono text-[#52525B] mt-2 leading-relaxed">
                Thank you, <strong>{studentName}</strong>! Your request for a{' '}
                <strong className="text-[#E63946]">1-Week Free Demo Class</strong> for{' '}
                <strong>{classGrade}</strong> at our Dhanbad center has been received by Satyam Sir.
              </p>
            </div>

            <div className="p-3 bg-[#F8F7F4] border-2 border-[#111113] text-left text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-[#71717A]">Target Grade:</span>
                <span className="font-bold text-[#111113]">{classGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Preferred Slot:</span>
                <span className="font-bold text-[#111113]">{preferredTiming}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Contact:</span>
                <span className="font-bold text-[#111113]">{parentMobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717A]">Classroom Center:</span>
                <span className="font-bold text-[#111113]">Dhanbad, Jharkhand</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <a
                href="tel:7004995470"
                className="btn-ink text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Satyam Sir
              </a>
              <button
                onClick={handleReset}
                className="btn-outline-ink text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="label text-[10px] block mb-1">
                Admissions 2026 • 1-Week Free Trial
              </div>
              <h3 className="font-heading font-black text-2xl text-[#111113]">
                Book 1-Week Free Demo Class
              </h3>
              <p className="text-xs font-mono text-[#71717A]">
                Attend live classes for Class III to XII with Satyam Sir. No admission fee, zero obligations.
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-mono font-bold">
                {error}
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="uppercase font-bold text-[#111113] block mb-1">
                  Student Name <span className="text-[#E63946]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="uppercase font-bold text-[#111113] block mb-1">
                    Parent Mobile <span className="text-[#E63946]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={parentMobile}
                    onChange={(e) => setParentMobile(e.target.value)}
                    className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="uppercase font-bold text-[#111113] block mb-1">
                    Grade <span className="text-[#E63946]">*</span>
                  </label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value as ClassGrade)}
                    className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] font-bold focus:outline-none focus:bg-white"
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
                    ].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="uppercase font-bold text-[#111113] block mb-1">
                  School Name <span className="text-[#E63946]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DPS Dhanbad / Carmel School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="uppercase font-bold text-[#111113] block mb-1">Preferred Timing Slot</label>
                <select
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
                >
                  <option value="Morning (06:30 AM - 08:00 AM)">Morning (06:30 AM - 08:00 AM)</option>
                  <option value="Afternoon (02:00 PM - 03:30 PM)">Afternoon (02:00 PM - 03:30 PM)</option>
                  <option value="Evening (05:00 PM - 06:30 PM)">Evening (05:00 PM - 06:30 PM)</option>
                  <option value="Night (06:45 PM - 08:15 PM)">Night (06:45 PM - 08:15 PM)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="btn-ink w-full flex items-center justify-center gap-2 text-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Confirm 1-Week Free Demo Registration</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#71717A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E63946]" />
                <span>100% Free • No Payment Required • Center in Dhanbad</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
