import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Edit3,
  X,
  Save,
  Shield,
  Key,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { storageService } from '../services/storageService';
import { googleDocsService } from '../services/googleDocsService';
import { ContactInfo, UserSession, ClassGrade } from '../types';

interface ContactSectionProps {
  onOpenDemoBooking: () => void;
  session?: UserSession;
  onOpenAdminLogin?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenDemoBooking,
  session,
  onOpenAdminLogin,
}) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() =>
    storageService.getContactInfo()
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ContactInfo>(contactInfo);

  // Inquiry Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('Class X');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const isMentor = session?.role === 'mentor';

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playVictory();
    storageService.saveContactInfo(editForm);
    setContactInfo(editForm);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    sound.playVictory();
    const newInq = storageService.saveDemoInquiry({
      studentName: name.trim(),
      parentMobile: phone.trim(),
      classGrade: grade as ClassGrade,
      schoolName: 'Contact Form Inquiry',
      preferredTiming: 'Flexible',
      notes: message.trim(),
    });

    // Auto-sync inquiry directly to connected Google Docs record
    googleDocsService.appendDemoInquiry(newInq).catch(() => {});

    setSent(true);
  };

  return (
    <section id="contact" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mentor Edit Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div className="text-left max-w-3xl space-y-3">
            <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
              <span>[ CENTER LOCATION &amp; INQUIRIES ]</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
              Connect with{' '}
              <span className="text-[#E63946]">Satyam Sir</span>
            </h2>
            <p className="text-base sm:text-lg text-[#52525B] font-normal">
              Visit our Dhanbad coaching classroom center, call directly for batch timings, or send an inquiry for immediate admissions guidance.
            </p>
          </div>

          {isMentor && (
            <button
              onClick={() => {
                setEditForm(contactInfo);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs border-2 border-[#111113] shadow-[3px_3px_0px_#111113] flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Contact Info (Mentor)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Center Address */}
            <div className="p-6 bg-white border-2 border-[#111113] shadow-[4px_4px_0px_#111113] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111113] text-white flex items-center justify-center shrink-0 border border-[#111113]">
                  <MapPin className="w-5 h-5 text-[#E63946]" />
                </div>
                <div>
                  <span className="label text-[10px] block">
                    Physical Classroom Center
                  </span>
                  <h4 className="font-heading font-black text-[#111113] text-base">{contactInfo.centerName}</h4>
                </div>
              </div>
              <p className="text-xs font-mono text-[#3F3F46] leading-relaxed pl-13">
                {contactInfo.streetAddress}<br />
                {contactInfo.cityStateZip}
              </p>
              <div className="pt-1 pl-13">
                <a
                  href={contactInfo.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111113] hover:bg-[#E63946] text-white border-2 border-[#111113] text-xs font-mono font-bold transition-all shadow-[2px_2px_0px_#111113]"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open Center in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Direct Phone Helpline */}
            <div className="p-6 bg-white border-2 border-[#111113] shadow-[4px_4px_0px_#111113] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111113] text-white flex items-center justify-center shrink-0 border border-[#111113]">
                  <Phone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="label text-[10px] block">
                    Direct Faculty Helplines
                  </span>
                  <h4 className="font-heading font-black text-[#111113] text-base">Call Satyam Sir</h4>
                </div>
              </div>
              <div className="pl-13 space-y-1.5 text-xs font-mono">
                <a
                  href={`tel:${contactInfo.primaryPhone.replace(/\s+/g, '')}`}
                  className="block text-[#111113] font-bold hover:text-[#E63946]"
                >
                  Primary: +91 {contactInfo.primaryPhone}
                </a>
                <a
                  href={`tel:${contactInfo.secondaryPhone.replace(/\s+/g, '')}`}
                  className="block text-[#52525B] font-bold hover:text-[#E63946]"
                >
                  Secondary: +91 {contactInfo.secondaryPhone}
                </a>
              </div>
            </div>

            {/* WhatsApp & Hours */}
            <div className="p-6 bg-white border-2 border-[#111113] shadow-[4px_4px_0px_#111113] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center shrink-0 border border-[#111113]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="label text-[10px] block">
                    Classroom Timings
                  </span>
                  <h4 className="font-heading font-black text-[#111113] text-base">
                    Monday to Saturday
                  </h4>
                </div>
              </div>
              <p className="text-xs font-mono text-[#3F3F46] leading-relaxed pl-13">
                {contactInfo.timingsWeekdays}<br />
                {contactInfo.timingsSunday}
              </p>
              <div className="pt-2 pl-13">
                <a
                  href={`https://wa.me/91${contactInfo.whatsappNumber.replace(/\D/g, '')}?text=Hello%20Satyam%20Sir,%20I%20am%20inquiring%20about%20Maths%20Fact%20classes%20in%20Dhanbad.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-[#111113] font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#111113]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp: +91 {contactInfo.whatsappNumber}
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message / Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-9 bg-white border-2 border-[#111113] shadow-[8px_8px_0px_#111113] relative">
            {sent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#111113] text-white border-2 border-[#111113] shadow-[4px_4px_0px_#E63946] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-[#E63946]" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#111113]">Message Sent!</h3>
                <p className="text-xs font-mono text-[#52525B] max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Satyam Sir will review your inquiry and respond via phone or WhatsApp shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSent(false)}
                    className="btn-outline-ink text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="label text-[10px] block">
                    Direct Inquiry Form
                  </span>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113] mt-1">
                    Send a Message to Satyam Sir
                  </h3>
                  <p className="text-xs text-[#52525B] font-mono">
                    Inquire regarding batches, admissions, fee structure, or 1-week free demo classes.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase font-bold text-[#111113] block mb-1">
                      Your Name / Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-3 text-xs text-[#111113] placeholder-gray-500 focus:outline-none focus:bg-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono uppercase font-bold text-[#111113] block mb-1">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-3 text-xs text-[#111113] placeholder-gray-500 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase font-bold text-[#111113] block mb-1">
                        Class / Grade
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-3 text-xs text-[#111113] focus:outline-none focus:bg-white font-mono font-bold"
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
                    <label className="text-[11px] font-mono uppercase font-bold text-[#111113] block mb-1">
                      Message / Questions *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Inquiring about Class 10 CBSE batch timings and demo class availability at Dhanbad center..."
                      className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-3 text-xs text-[#111113] placeholder-gray-500 focus:outline-none focus:bg-white resize-none font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    className="btn-ink flex items-center justify-center gap-2 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Satyam Sir</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenDemoBooking}
                    className="btn-outline-ink flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Book Free Demo Class</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Dedicated Bottom Mentor Login Card (Requested by Satyam Sir) */}
        <div className="mt-14 pt-8 border-t-2 border-[#111113]">
          <div className="p-6 sm:p-8 bg-white border-2 border-[#111113] shadow-[6px_6px_0px_#111113] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="label text-[10px] font-mono font-bold text-[#E63946] inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F8F7F4] border border-[#111113]">
                <Shield className="w-3.5 h-3.5 text-[#E63946]" />
                <span>[ FACULTY &amp; FOUNDER ACCESS ]</span>
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#111113]">
                Satyam Sir Mentor Login &amp; Management Console
              </h3>
              <p className="text-xs font-mono text-[#52525B] leading-relaxed">
                Authorized access for Satyam Sir: review 1-week free demo leads, sync with Google Docs, live edit faculty profile, board results, batch timings, and change mentor master passcode.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isMentor ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-2 bg-emerald-100 text-emerald-800 border-2 border-emerald-600 text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Mentor Mode Active</span>
                  </span>
                  {onOpenAdminLogin && (
                    <button
                      type="button"
                      onClick={onOpenAdminLogin}
                      className="btn-ink text-xs px-4 py-2 flex items-center gap-2"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Change Passcode</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="btn-ink text-xs px-6 py-3.5 flex items-center gap-2.5 shadow-[4px_4px_0px_#E63946] hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
                >
                  <Shield className="w-4 h-4 text-[#E63946] group-hover:rotate-12 transition-transform" />
                  <span className="font-bold uppercase tracking-wider">Mentor Login (Satyam Sir)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Edit Contact Information Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-[#111113] max-w-xl w-full p-6 sm:p-8 shadow-[8px_8px_0px_#111113] relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-2 bg-[#F8F7F4] hover:bg-[#111113] hover:text-white text-[#111113] border-2 border-[#111113] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="label text-[10px] block font-mono font-bold text-[#E63946]">
                [ MENTOR CONTENT EDITOR ]
              </span>
              <h3 className="font-heading font-black text-2xl text-[#111113]">
                Edit Center Contact &amp; Location
              </h3>
              <p className="text-xs font-mono text-[#52525B]">
                Changes made here immediately update the website and parent contact buttons.
              </p>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 font-mono text-xs">
              <div>
                <label className="font-bold text-[#111113] block mb-1">Center Name</label>
                <input
                  type="text"
                  required
                  value={editForm.centerName}
                  onChange={(e) => setEditForm({ ...editForm, centerName: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={editForm.streetAddress}
                  onChange={(e) => setEditForm({ ...editForm, streetAddress: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">City, State &amp; PIN</label>
                <input
                  type="text"
                  required
                  value={editForm.cityStateZip}
                  onChange={(e) => setEditForm({ ...editForm, cityStateZip: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Google Maps Link</label>
                <input
                  type="url"
                  required
                  value={editForm.googleMapsUrl}
                  onChange={(e) => setEditForm({ ...editForm, googleMapsUrl: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Primary Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.primaryPhone}
                    onChange={(e) => setEditForm({ ...editForm, primaryPhone: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Secondary Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.secondaryPhone}
                    onChange={(e) => setEditForm({ ...editForm, secondaryPhone: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={editForm.whatsappNumber}
                  onChange={(e) => setEditForm({ ...editForm, whatsappNumber: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Weekday Timings</label>
                <input
                  type="text"
                  required
                  value={editForm.timingsWeekdays}
                  onChange={(e) => setEditForm({ ...editForm, timingsWeekdays: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Sunday Timings</label>
                <input
                  type="text"
                  required
                  value={editForm.timingsSunday}
                  onChange={(e) => setEditForm({ ...editForm, timingsSunday: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white text-[#111113] border-2 border-[#111113]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-ink flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
