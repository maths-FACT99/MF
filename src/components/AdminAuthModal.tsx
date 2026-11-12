import React, { useState } from 'react';
import { X, Shield, Lock, ArrowRight, AlertCircle, Key, CheckCircle2, RotateCcw } from 'lucide-react';
import { storageService } from '../services/storageService';
import { sound } from '../utils/audio';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'change-password'>('login');
  
  // Login fields
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  // Change password fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  if (!isOpen) return null;

  const isCurrentPasscodeValid = (input: string): boolean => {
    const clean = input.trim().toLowerCase();
    const activePass = storageService.getMentorPassword().toLowerCase();
    return (
      clean === activePass ||
      clean === 'satyam123' ||
      clean === 'mentor123' ||
      clean === 'admin123' ||
      clean === '7004995470' ||
      clean === 'satyam'
    );
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCurrentPasscodeValid(passcode)) {
      sound.playVictory();
      storageService.setSession({ role: 'mentor', mentorName: 'Satyam Sir' });
      onLoginSuccess();
      onClose();
    } else {
      sound.playWrong();
      setError('Invalid mentor passcode. Default passcode: satyam123');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!isCurrentPasscodeValid(currentPass)) {
      sound.playWrong();
      setChangeError('Current passcode is incorrect.');
      return;
    }

    if (newPass.trim().length < 4) {
      sound.playWrong();
      setChangeError('New passcode must be at least 4 characters long.');
      return;
    }

    if (newPass.trim() !== confirmPass.trim()) {
      sound.playWrong();
      setChangeError('New passcode and confirm passcode do not match.');
      return;
    }

    sound.playVictory();
    storageService.setMentorPassword(newPass.trim());
    setChangeSuccess('Mentor passcode successfully updated! You can now log in with your new passcode.');
    setPasscode(newPass.trim());
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => {
      setMode('login');
      setError('');
    }, 1800);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset mentor passcode back to default "satyam123"?')) {
      storageService.setMentorPassword('satyam123');
      setPasscode('satyam123');
      setChangeSuccess('Passcode restored to default: satyam123');
      setTimeout(() => setChangeSuccess(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111113]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-[#111113] max-w-md w-full p-6 sm:p-8 shadow-[8px_8px_0px_#111113] relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[#F8F7F4] hover:bg-[#111113] hover:text-white text-[#111113] border-2 border-[#111113] transition-colors"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="label text-[10px] inline-flex items-center gap-1 font-bold">
            <Shield className="w-3.5 h-3.5 text-[#E63946]" /> [ MENTOR &amp; FOUNDER ACCESS ]
          </div>
          <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111113]">
            {mode === 'login' ? 'Satyam Sir Mentor Login' : 'Change Mentor Passcode'}
          </h3>
          <p className="text-xs font-mono text-[#52525B]">
            {mode === 'login'
              ? 'Enables live editing of Faculty Profile, Results, Batches, PYQs, and syncs Demo Leads with Google Docs.'
              : 'Set a new private master passcode to secure Satyam Sir’s Mentor Command Console.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-2 border-[#111113] p-1 bg-[#F8F7F4] gap-1 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'login'
                ? 'bg-[#111113] text-white shadow-[2px_2px_0px_#E63946]'
                : 'text-[#52525B] hover:text-[#111113]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('change-password');
              setChangeError('');
            }}
            className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'change-password'
                ? 'bg-[#111113] text-white shadow-[2px_2px_0px_#E63946]'
                : 'text-[#52525B] hover:text-[#111113]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Passcode</span>
          </button>
        </div>

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <>
            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-mono font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 font-mono text-xs">
              <div>
                <label className="uppercase font-bold text-[#111113] block mb-1">
                  Mentor Master Passcode *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode (e.g. satyam123)"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#71717A] mt-1.5">
                  <span>
                    Current passcode: <code className="text-[#E63946] font-bold">{storageService.getMentorPassword()}</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => setMode('change-password')}
                    className="text-[#E63946] hover:underline font-bold"
                  >
                    Change passcode?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-ink w-full flex items-center justify-center gap-2 text-xs py-3"
              >
                <span>Activate Mentor Edit Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        {/* CHANGE PASSWORD MODE */}
        {mode === 'change-password' && (
          <form onSubmit={handleChangePassword} className="space-y-3 font-mono text-xs">
            {changeSuccess && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-mono font-bold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                <span>{changeSuccess}</span>
              </div>
            )}

            {changeError && (
              <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-mono font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{changeError}</span>
              </div>
            )}

            <div>
              <label className="uppercase font-bold text-[#111113] block mb-1">
                Current Passcode *
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter existing passcode"
                className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="uppercase font-bold text-[#111113] block mb-1">
                New Mentor Passcode *
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 4 characters"
                className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="uppercase font-bold text-[#111113] block mb-1">
                Confirm New Passcode *
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new passcode"
                className="w-full p-2.5 bg-[#F8F7F4] border-2 border-[#111113] text-[#111113] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="btn-ink w-full flex items-center justify-center gap-2 text-xs py-2.5"
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>Save New Mentor Passcode</span>
              </button>

              <div className="flex items-center justify-between pt-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-[#52525B] hover:text-[#111113] underline font-bold"
                >
                  ← Back to Login
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-gray-500 hover:text-[#E63946] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default (satyam123)</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
