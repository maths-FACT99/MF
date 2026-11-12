import React, { useState } from 'react';
import { VEDIC_TRICKS } from '../data/vedicTricks';
import { VedicTrick } from '../types/math';
import { sound } from '../utils/audio';
import {
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface VedicTricksStudioProps {
  onEarnXp: (amount: number) => void;
}

export const VedicTricksStudio: React.FC<VedicTricksStudioProps> = ({ onEarnXp }) => {
  const [selectedTrick, setSelectedTrick] = useState<VedicTrick>(VEDIC_TRICKS[0]);
  const [num1, setNum1] = useState<number>(selectedTrick.defaultNum1);
  const [num2, setNum2] = useState<number>(selectedTrick.defaultNum2 || 50);

  // Mini quiz state for trick
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceStatus, setPracticeStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleSelectTrick = (trick: VedicTrick) => {
    sound.playTick();
    setSelectedTrick(trick);
    setNum1(trick.defaultNum1);
    setNum2(trick.defaultNum2 || 50);
    setPracticeAnswer('');
    setPracticeStatus('idle');
  };

  const calculation = selectedTrick.calculate(num1, num2);

  const checkPractice = () => {
    const val = parseInt(practiceAnswer, 10);
    if (val === calculation.result) {
      sound.playCorrect();
      setPracticeStatus('correct');
      onEarnXp(20);
    } else {
      sound.playWrong();
      setPracticeStatus('wrong');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 rounded-3xl border border-purple-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-purple-400" /> Vedic &amp; Speed Studio
            </span>
            <span className="text-xs text-slate-400">Ancient Sutras &amp; Modern Shortcuts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Mental Math Shortcuts
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Learn how to calculate faster than a calculator using ancient Indian sutras and algebraic identities.
          </p>
        </div>
      </div>

      {/* Trick Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VEDIC_TRICKS.map((trick) => {
          const isSelected = selectedTrick.id === trick.id;
          return (
            <button
              key={trick.id}
              onClick={() => handleSelectTrick(trick)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-950/60 to-indigo-950/60 border-purple-500 shadow-lg shadow-purple-600/20 ring-1 ring-purple-500/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-purple-300 font-mono">
                  {trick.rule.split('=')[0]}
                </span>
                {isSelected && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200">
                    Active
                  </span>
                )}
              </div>
              <h4 className="text-sm font-extrabold text-white mb-1">{trick.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{trick.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Studio & Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Playground */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                {selectedTrick.sanskritName || 'Speed Technique'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {selectedTrick.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">{selectedTrick.description}</p>
            </div>
          </div>

          {/* Interactive Parameters */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              Adjust Numbers to See Step-by-Step Execution:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  First Number: <span className="text-indigo-400 font-mono text-sm">{num1}</span>
                </label>
                {selectedTrick.id === 'square-ending-5' ? (
                  <select
                    value={num1}
                    onChange={(e) => setNum1(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  >
                    {[15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125].map((n) => (
                      <option key={n} value={n}>
                        {n} (ending in 5)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="range"
                    min={selectedTrick.id === 'base-100-multiplication' ? 88 : 11}
                    max={selectedTrick.id === 'base-100-multiplication' ? 99 : 99}
                    value={num1}
                    onChange={(e) => setNum1(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                )}
              </div>

              {selectedTrick.defaultNum2 !== undefined && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Second Number: <span className="text-purple-400 font-mono text-sm">{num2}</span>
                  </label>
                  <input
                    type="range"
                    min={selectedTrick.id === 'base-100-multiplication' ? 88 : 10}
                    max={selectedTrick.id === 'base-100-multiplication' ? 99 : 100}
                    value={num2}
                    onChange={(e) => setNum2(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Real-time Result Big Banner */}
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 p-5 rounded-2xl border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Formula Rule</span>
              <div className="text-sm sm:text-base font-mono font-bold text-amber-300 mt-0.5">
                {selectedTrick.rule}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Instant Answer</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
                {calculation.result}
              </div>
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              The Mental Calculation Steps:
            </h4>
            <div className="space-y-2">
              {calculation.stepBreakdown.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs font-mono text-slate-200"
                >
                  <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Practice Challenge on this Trick */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Mastery Drill (+20 XP)
            </div>

            <p className="text-xs text-slate-300">
              Calculate this mentally using the <strong className="text-white">{selectedTrick.title}</strong> shortcut:
            </p>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
              <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                {selectedTrick.id === 'square-ending-5'
                  ? `${num1}² = ?`
                  : selectedTrick.id === 'multiply-by-11'
                  ? `${num1} × 11 = ?`
                  : selectedTrick.id === 'percentage-swap'
                  ? `${num1}% of ${num2} = ?`
                  : `${num1} × ${num2} = ?`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={practiceAnswer}
                onChange={(e) => {
                  setPracticeAnswer(e.target.value.replace(/\D/g, ''));
                  setPracticeStatus('idle');
                }}
                placeholder="Type your answer..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold text-center text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={checkPractice}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap active:scale-95"
              >
                Submit
              </button>
            </div>

            {practiceStatus === 'correct' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Perfect calculation! +20 XP awarded!
              </div>
            )}

            {practiceStatus === 'wrong' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                Not quite. Re-read step 2 in the left column and try again!
              </div>
            )}
          </div>

          {/* Sutra Principles Guide */}
          <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Why Vedic Math is So Fast
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard arithmetic forces you to calculate right-to-left with confusing carries. Vedic math works left-to-right (the way your brain naturally reads numbers), allowing mental estimation and verification in under 3 seconds!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
