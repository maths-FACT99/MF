import React from 'react';
import { sound } from '../utils/audio';
import {
  Award,
  Flame,
  CheckCircle2,
  X,
  Zap,
  Star,
  Trophy,
  Target,
  Sparkles,
} from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSolved: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  xp: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  totalSolved,
  totalCorrect,
  currentStreak,
  bestStreak,
  xp,
}) => {
  if (!isOpen) return null;

  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  const badges = [
    {
      id: 'first-step',
      name: 'Curious Learner',
      desc: 'Earned your first 20 XP in MathsFact 99',
      unlocked: xp >= 20,
      icon: '🌱',
    },
    {
      id: 'streak-5',
      name: 'Combo Fire',
      desc: 'Achieved a streak of 5+ correct answers',
      unlocked: bestStreak >= 5,
      icon: '🔥',
    },
    {
      id: 'century-club',
      name: 'Century 99 Sprinter',
      desc: 'Solved 25+ mental math problems',
      unlocked: totalSolved >= 25,
      icon: '⚡',
    },
    {
      id: 'accuracy-master',
      name: 'Precision Scholar',
      desc: 'Maintain 80%+ accuracy with at least 10 solved',
      unlocked: totalSolved >= 10 && accuracy >= 80,
      icon: '🎯',
    },
    {
      id: 'grandmaster',
      name: 'Grandmaster 99',
      desc: 'Reach Level 5 (500+ XP)',
      unlocked: xp >= 500,
      icon: '👑',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playTick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Your MathsFact 99 Profile</h3>
            <p className="text-xs text-slate-400">Mental math fluency &amp; achievement records</p>
          </div>
        </div>

        {/* Level Progression */}
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Level {currentLevel} Math Prodigy
            </span>
            <span className="font-mono text-indigo-300 font-bold">{xpInCurrentLevel} / 100 XP</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Next Level unlock in {100 - xpInCurrentLevel} XP
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Solved
            </span>
            <span className="text-2xl font-mono font-black text-white">{totalSolved}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Accuracy
            </span>
            <span className="text-2xl font-mono font-black text-emerald-400">{accuracy}%</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Max Streak
            </span>
            <span className="text-2xl font-mono font-black text-amber-400">{bestStreak}x</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Total XP
            </span>
            <span className="text-2xl font-mono font-black text-purple-400">{xp}</span>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            Trophy Case:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  b.unlocked
                    ? 'bg-slate-800/90 border-indigo-500/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div>
                  <h5 className="text-xs font-bold text-white flex items-center gap-1">
                    {b.name}
                    {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </h5>
                  <p className="text-[10px] text-slate-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
