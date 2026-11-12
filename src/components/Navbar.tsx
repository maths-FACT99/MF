import React from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  Award,
  BookOpen,
  HelpCircle,
  Users,
  Volume2,
  VolumeX,
  Bot,
  Compass,
} from 'lucide-react';
import { sound } from '../utils/audio';

export type TabType =
  | 'facts'
  | 'speed'
  | 'vedic'
  | 'curriculum'
  | 'puzzles'
  | 'multiplayer'
  | 'ai';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  xp: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  xp,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenStats,
}) => {
  const tabs = [
    { id: 'facts' as TabType, label: 'Wonder Facts', icon: Sparkles },
    { id: 'speed' as TabType, label: '99 Speed Arena', icon: Zap },
    { id: 'vedic' as TabType, label: 'Vedic Tricks', icon: Compass },
    { id: 'curriculum' as TabType, label: 'Curriculum Hub', icon: BookOpen },
    { id: 'puzzles' as TabType, label: 'Brain Puzzles', icon: HelpCircle },
    { id: 'multiplayer' as TabType, label: 'Live Arena', icon: Users },
    { id: 'ai' as TabType, label: 'AI Math Tutor', icon: Bot },
  ];

  const handleTabClick = (t: TabType) => {
    sound.playTick();
    onTabChange(t);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-slate-100 transition-colors shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            onClick={() => handleTabClick('facts')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-base tracking-tighter">99</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  MathsFact
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Mental Math &amp; Speed Mastery
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User Status, Sound & Stats Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Streak Counter */}
            <div
              title={`${streak} Day Streak!`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{streak}</span>
            </div>

            {/* XP Badge */}
            <button
              onClick={onOpenStats}
              title="Click to view full achievements & stats"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all hover:scale-105"
            >
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>{xp} XP</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute sound FX' : 'Enable sound FX'}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Scroller */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 bg-slate-800/80 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
