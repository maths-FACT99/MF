import React, { useState } from 'react';
import {
  GraduationCap,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Star,
  Users,
  Edit3,
  X,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { storageService } from '../services/storageService';
import { FacultyProfile, UserSession } from '../types';

interface FacultySectionProps {
  onOpenDemoBooking: () => void;
  session?: UserSession;
}

export const FacultySection: React.FC<FacultySectionProps> = ({
  onOpenDemoBooking,
  session,
}) => {
  const [faculty, setFaculty] = useState<FacultyProfile>(() =>
    storageService.getFacultyProfile()
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<FacultyProfile>(faculty);
  const [newPrinciple, setNewPrinciple] = useState('');

  const isMentor = session?.role === 'mentor';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playVictory();
    storageService.saveFacultyProfile(editForm);
    setFaculty(editForm);
    setIsEditing(false);
  };

  const handleAddPrinciple = () => {
    if (!newPrinciple.trim()) return;
    setEditForm({
      ...editForm,
      principles: [...editForm.principles, newPrinciple.trim()],
    });
    setNewPrinciple('');
  };

  const handleRemovePrinciple = (idx: number) => {
    setEditForm({
      ...editForm,
      principles: editForm.principles.filter((_, i) => i !== idx),
    });
  };

  return (
    <section id="faculty" className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Mentor Edit Trigger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div className="text-left max-w-3xl space-y-3">
            <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <Users className="w-3.5 h-3.5 text-[#E63946]" />
              <span>[ FACULTY LEADERSHIP ]</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
              Meet Your Mentor:{' '}
              <span className="text-[#E63946]">{faculty.name}</span>
            </h2>
            <p className="text-base sm:text-lg text-[#52525B]">
              10+ years of dedicated teaching excellence in Dhanbad, transforming students through personalized mentorship and conceptual purity.
            </p>
          </div>

          {isMentor && (
            <button
              onClick={() => {
                setEditForm(faculty);
                setIsEditing(true);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs border-2 border-[#111113] shadow-[3px_3px_0px_#111113] flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Faculty Profile (Mentor)</span>
            </button>
          )}
        </div>

        {/* Master Faculty Card */}
        <div className="max-w-4xl p-8 sm:p-10 bg-white border-2 border-[#111113] shadow-[8px_8px_0px_#111113] relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Avatar / Portrait */}
            <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="w-44 h-44 bg-[#111113] text-white border-2 border-[#111113] shadow-[6px_6px_0px_#E63946] flex flex-col items-center justify-center p-4">
                <GraduationCap className="w-16 h-16 text-[#E63946] mb-2" />
                <div className="font-heading font-black text-white text-lg tracking-tight uppercase">
                  {faculty.name}
                </div>
                <div className="label text-[10px] text-white font-mono tracking-widest uppercase">
                  {faculty.badge}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-[#E63946]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E63946] text-[#E63946]" />
                  ))}
                </div>
                <div className="text-xs font-mono text-[#52525B]">
                  Rated <strong className="text-[#111113]">{faculty.ratingScore}</strong> by {faculty.ratingReviewers}
                </div>
              </div>

              {/* Direct Call & WhatsApp buttons */}
              <div className="flex items-center gap-2 w-full pt-2">
                <a
                  href={`tel:${faculty.phone.replace(/\D/g, '')}`}
                  className="btn-ink flex-1 text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call {faculty.phone}
                </a>
                <a
                  href={`https://wa.me/91${faculty.whatsapp.replace(/\D/g, '')}?text=Hello%20Satyam%20Sir,%20I%20am%20interested%20in%20demo%20classes%20at%20Maths%20Fact%20Dhanbad.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]"
                  title={`WhatsApp ${faculty.name}`}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Bio & Mentorship Principles */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="label text-[10px] block mb-0.5">
                  {faculty.title}
                </span>
                <h3 className="font-heading font-black text-2xl sm:text-4xl text-[#111113]">
                  {faculty.name}
                </h3>
                <p className="text-xs font-mono text-[#71717A] mt-1">
                  {faculty.experience}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
                {faculty.bio}
              </p>

              <div className="space-y-2 pt-1 font-mono text-xs">
                {faculty.principles.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playStreak();
                    onOpenDemoBooking();
                  }}
                  className="btn-ink flex items-center gap-2 text-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book 1-Week Free Demo with {faculty.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Faculty Profile Edit Modal */}
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
                Edit Faculty Leadership Profile
              </h3>
              <p className="text-xs font-mono text-[#52525B]">
                Updates made here are permanently saved to your live MATHS FACT portal.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Faculty Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Badge Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.badge}
                    onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Professional Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Experience &amp; Specialization</label>
                <input
                  type="text"
                  required
                  value={editForm.experience}
                  onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                />
              </div>

              <div>
                <label className="font-bold text-[#111113] block mb-1">Teaching Philosophy &amp; Bio</label>
                <textarea
                  rows={4}
                  required
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113] resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Rating (e.g. 4.9/5)</label>
                  <input
                    type="text"
                    required
                    value={editForm.ratingScore}
                    onChange={(e) => setEditForm({ ...editForm, ratingScore: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#111113] block mb-1">Reviewers Count Text</label>
                  <input
                    type="text"
                    required
                    value={editForm.ratingReviewers}
                    onChange={(e) => setEditForm({ ...editForm, ratingReviewers: e.target.value })}
                    className="w-full bg-[#F8F7F4] border-2 border-[#111113] p-2.5 text-[#111113]"
                  />
                </div>
              </div>

              {/* Mentorship Principles */}
              <div className="space-y-2">
                <label className="font-bold text-[#111113] block">Key Mentorship Principles</label>
                <div className="space-y-2">
                  {editForm.principles.map((pr, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pr}
                        onChange={(e) => {
                          const updated = [...editForm.principles];
                          updated[idx] = e.target.value;
                          setEditForm({ ...editForm, principles: updated });
                        }}
                        className="flex-1 bg-[#F8F7F4] border-2 border-[#111113] p-2 text-[#111113]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePrinciple(idx)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a new principle..."
                    value={newPrinciple}
                    onChange={(e) => setNewPrinciple(e.target.value)}
                    className="flex-1 bg-white border-2 border-[#111113] p-2 text-[#111113]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrinciple}
                    className="px-3 py-2 bg-[#111113] hover:bg-[#E63946] text-white flex items-center gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
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
                  <span>Save Faculty Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
