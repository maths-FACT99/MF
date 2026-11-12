import React, { useState } from 'react';
import { BRAIN_TEASERS } from '../data/puzzles';
import { BrainTeaser } from '../types/math';
import { sound } from '../utils/audio';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';

interface BrainTeasersProps {
  onEarnXp: (amount: number) => void;
}

export const BrainTeasers: React.FC<BrainTeasersProps> = ({ onEarnXp }) => {
  const [selectedPuzzle, setSelectedPuzzle] = useState<BrainTeaser>(BRAIN_TEASERS[0]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  const handleSelectPuzzle = (p: BrainTeaser) => {
    sound.playTick();
    setSelectedPuzzle(p);
    setShowHint(false);
    setShowSolution(false);
  };

  const markSolved = () => {
    if (!solvedIds.includes(selectedPuzzle.id)) {
      sound.playVictory();
      setSolvedIds([...solvedIds, selectedPuzzle.id]);
      onEarnXp(30);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 p-6 rounded-3xl border border-pink-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-pink-400" /> Math Riddles &amp; Brain Teasers
            </span>
            <span className="text-xs text-slate-400">Lateral Thinking &amp; Matchsticks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Matchstick &amp; Logic Puzzles
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Challenge your creative thinking. Move matchsticks, spot hidden arithmetic patterns, and crack riddles!
          </p>
        </div>
      </div>

      {/* Puzzle Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BRAIN_TEASERS.map((p) => {
          const isSelected = selectedPuzzle.id === p.id;
          const isSolved = solvedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPuzzle(p)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-pink-950/30 border-pink-500 shadow-lg ring-1 ring-pink-500/30 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.difficulty === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : p.difficulty === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {p.difficulty}
                </span>
                {isSolved && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{p.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{p.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Puzzle Showcase */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
              {selectedPuzzle.type.toUpperCase()} CHALLENGE
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              {selectedPuzzle.title}
            </h3>
          </div>
          <button
            onClick={markSolved}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {solvedIds.includes(selectedPuzzle.id) ? 'Completed (30 XP)' : 'Mark as Solved (+30 XP)'}
          </button>
        </div>

        {/* Puzzle Visual Card */}
        {selectedPuzzle.type === 'matchstick' ? (
          <div className="bg-slate-950/80 p-8 rounded-3xl border border-amber-500/30 text-center space-y-4">
            <span className="text-xs font-bold text-amber-400/80 uppercase tracking-widest">
              Matchstick Board
            </span>
            <div className="text-5xl sm:text-7xl font-mono font-black text-amber-300 tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] select-none">
              {selectedPuzzle.initialEquation}
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Can you move exactly ONE matchstick to fix the equation? Think about modifying the digits or the operator sign.
            </p>
          </div>
        ) : (
          <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/60 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-mono">
            {selectedPuzzle.description}
          </div>
        )}

        {/* Hints and Solutions Toggle Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playTick();
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            {showHint ? 'Hide Hint' : 'Need a Hint?'}
          </button>

          <button
            onClick={() => {
              sound.playTick();
              setShowSolution(!showSolution);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all"
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSolution ? 'Hide Solution' : 'Reveal Solution'}
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1">
            <strong className="block text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              Hint Clue:
            </strong>
            <p>{selectedPuzzle.hint}</p>
          </div>
        )}

        {/* Solution Box */}
        {showSolution && (
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-200 space-y-2 whitespace-pre-line leading-relaxed">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-xs">
              <Sparkles className="w-4 h-4" /> Official Solution &amp; Working:
            </div>
            <p className="font-mono text-slate-300">{selectedPuzzle.solution}</p>
          </div>
        )}
      </div>
    </div>
  );
};
