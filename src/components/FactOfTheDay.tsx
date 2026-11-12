import React, { useState } from 'react';
import { MATH_FACTS } from '../data/mathFacts';
import { MathFact } from '../types/math';
import {
  Sparkles,
  Play,
  RotateCcw,
  Lightbulb,
  Bot,
  ArrowRight,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface FactOfTheDayProps {
  onEarnXp: (amount: number) => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ onEarnXp, onOpenAiWithPrompt }) => {
  const [selectedFact, setSelectedFact] = useState<MathFact>(MATH_FACTS[0]);
  const [kaprekarInput, setKaprekarInput] = useState<string>('3524');
  const [kaprekarSteps, setKaprekarSteps] = useState<
    { step: number; desc: string; asc: string; diff: string }[]
  >([]);
  const [kaprekarError, setKaprekarError] = useState<string>('');
  const [nineInput, setNineInput] = useState<string>('8427');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiData, setAiData] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Run Kaprekar Routine
  const runKaprekar = (inputVal?: string) => {
    sound.playTick();
    setKaprekarError('');
    const val = inputVal || kaprekarInput;
    if (!/^\d{4}$/.test(val)) {
      setKaprekarError('Please enter exactly 4 digits (e.g. 3524).');
      sound.playWrong();
      return;
    }

    const digits = val.split('');
    const allSame = digits.every((d) => d === digits[0]);
    if (allSame) {
      setKaprekarError('All 4 digits cannot be identical (e.g. 1111).');
      sound.playWrong();
      return;
    }

    let current = parseInt(val, 10);
    const steps: { step: number; desc: string; asc: string; diff: string }[] = [];
    let stepCount = 0;

    while (current !== 6174 && stepCount < 10) {
      stepCount++;
      const str = current.toString().padStart(4, '0');
      const descArr = str.split('').sort((a, b) => b.localeCompare(a));
      const ascArr = [...descArr].reverse();

      const descNum = parseInt(descArr.join(''), 10);
      const ascNum = parseInt(ascArr.join(''), 10);
      const diff = descNum - ascNum;

      steps.push({
        step: stepCount,
        desc: descArr.join(''),
        asc: ascArr.join(''),
        diff: diff.toString().padStart(4, '0'),
      });

      current = diff;
      if (current === 6174) break;
    }

    setKaprekarSteps(steps);
    sound.playCorrect();
    onEarnXp(15);
  };

  const setRandomKaprekar = () => {
    let rand = '';
    do {
      rand = Math.floor(1000 + Math.random() * 9000).toString();
    } while (rand[0] === rand[1] && rand[1] === rand[2] && rand[2] === rand[3]);
    setKaprekarInput(rand);
    runKaprekar(rand);
  };

  // AI Deep Dive
  const handleAiDeepDive = async () => {
    setAiLoading(true);
    sound.playStreak();
    try {
      const res = await fetch('/api/ai/explain-fact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factTitle: selectedFact.title }),
      });
      const data = await res.json();
      setAiData(data);
      onEarnXp(25);
      sound.playVictory();
    } catch (err) {
      console.error(err);
      sound.playWrong();
    } finally {
      setAiLoading(false);
    }
  };

  const copyFact = () => {
    navigator.clipboard.writeText(
      `MathsFact 99 - ${selectedFact.title}: ${selectedFact.tagline}\n${selectedFact.summary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Interactive Simulators
  const renderInteractiveModule = () => {
    if (selectedFact.interactiveType === 'kaprekar') {
      return (
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-indigo-500/20 shadow-inner">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-400" />
                Live Kaprekar 6174 Simulator
              </h4>
              <p className="text-xs text-slate-400">
                Enter any 4-digit number (at least two distinct digits)
              </p>
            </div>
            <button
              onClick={setRandomKaprekar}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors"
            >
              🎲 Random 4 Digits
            </button>
          </div>

          <div className="flex items-center gap-2 max-w-sm mb-3">
            <input
              type="text"
              maxLength={4}
              value={kaprekarInput}
              onChange={(e) => setKaprekarInput(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 3524"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-mono font-bold tracking-widest text-center text-lg focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => runKaprekar()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-transform active:scale-95 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Solve
            </button>
          </div>

          {kaprekarError && (
            <p className="text-xs text-rose-400 font-medium mb-3">{kaprekarError}</p>
          )}

          {kaprekarSteps.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs text-indigo-300 font-semibold mb-2">
                Reaches 6174 in {kaprekarSteps.length} step{kaprekarSteps.length > 1 ? 's' : ''}:
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {kaprekarSteps.map((s) => (
                  <div
                    key={s.step}
                    className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl font-mono ${
                      s.diff === '6174'
                        ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-800/60 border border-slate-700/50 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-400">Step {s.step}:</span>
                    <span>
                      {s.desc} - {s.asc} = <span className="text-amber-300">{s.diff}</span>
                    </span>
                    {s.diff === '6174' && (
                      <span className="flex items-center gap-1 text-emerald-400 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Constant!
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedFact.interactiveType === 'ramanujan') {
      return (
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-indigo-500/20 shadow-inner">
          <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Two Sums of Two Cubes Visualizer
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Notice how two completely different cube combinations equal 1729:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="text-xs font-semibold text-indigo-300 mb-1">Way 1: Small + Giant</div>
              <div className="text-lg font-mono font-bold text-white mb-2">
                1³ + 12³ = 1729
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• 1³ = 1 × 1 × 1 = 1</div>
                <div>• 12³ = 12 × 12 × 12 = 1,728</div>
                <div className="text-emerald-400 font-semibold font-mono">1 + 1,728 = 1,729</div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="text-xs font-semibold text-purple-300 mb-1">Way 2: Twin Cubes</div>
              <div className="text-lg font-mono font-bold text-white mb-2">
                9³ + 10³ = 1729
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• 9³ = 9 × 9 × 9 = 729</div>
                <div>• 10³ = 10 × 10 × 10 = 1,000</div>
                <div className="text-emerald-400 font-semibold font-mono">729 + 1,000 = 1,729</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedFact.interactiveType === 'nines') {
      const numVal = parseInt(nineInput || '0', 10);
      const digitSum = (nineInput || '0')
        .split('')
        .reduce((acc, curr) => acc + (parseInt(curr, 10) || 0), 0);
      const diff = numVal - digitSum;
      const isMultipleOfNine = diff % 9 === 0;

      return (
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-indigo-500/20 shadow-inner">
          <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Vedic Magic of 9 Inspector
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Enter ANY positive integer. Subtract the sum of its digits: the result is GUARANTEED to be divisible by 9!
          </p>

          <div className="flex items-center gap-2 max-w-xs mb-3">
            <input
              type="text"
              value={nineInput}
              onChange={(e) => setNineInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter number..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-mono font-bold text-center text-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          {numVal > 0 && (
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-xs font-mono space-y-1.5">
              <div>1. Number (N) = <span className="text-white font-bold">{numVal}</span></div>
              <div>
                2. Sum of digits = {nineInput.split('').join(' + ')} ={' '}
                <span className="text-amber-300 font-bold">{digitSum}</span>
              </div>
              <div className="text-emerald-400 font-bold">
                3. Difference (N - Sum) = {numVal} - {digitSum} = {diff}
              </div>
              <div className="text-slate-300">
                4. {diff} ÷ 9 = <span className="text-cyan-300 font-bold">{diff / 9}</span> (Remainder 0!{' '}
                {isMultipleOfNine ? '✓' : ''})
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default / Fibonacci
    return (
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-indigo-500/20 shadow-inner">
        <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Mathematical Wonder Note
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedFact.deepExplanation}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
              Daily Curiosity
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Curated by MathsFact 99
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mind-Bending Mathematical Wonders
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            Explore the secrets hidden inside numbers: Ramanujan taxicabs, Kaprekar black holes, Vedic 9s, and cosmic geometry.
          </p>
        </div>

        <button
          onClick={copyFact}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4 text-indigo-400" />
          {copied ? 'Copied to Clipboard!' : 'Share Fact'}
        </button>
      </div>

      {/* Facts Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MATH_FACTS.map((fact) => {
          const isSelected = selectedFact.id === fact.id;
          return (
            <button
              key={fact.id}
              onClick={() => {
                sound.playTick();
                setSelectedFact(fact);
                setAiData(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
              }`}
            >
              <span className="font-mono px-1.5 py-0.5 rounded bg-black/30 text-amber-300 text-[10px]">
                {fact.highlightNumber}
              </span>
              <span>{fact.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Fact Card Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Fact Overview & Interactive Simulator */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                {selectedFact.category}
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {selectedFact.title}
              </h3>
              <p className="text-sm font-semibold text-amber-300 mt-1">
                "{selectedFact.tagline}"
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300 font-mono font-black text-xl shadow-inner">
              {selectedFact.highlightNumber.length <= 4 ? selectedFact.highlightNumber : '★'}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedFact.summary}
          </p>

          {/* Interactive Simulator Slot */}
          {renderInteractiveModule()}

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleAiDeepDive}
              disabled={aiLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              {aiLoading ? 'MathsFact AI Thinking...' : 'Deep Dive with MathsFact AI (+25 XP)'}
            </button>

            {onOpenAiWithPrompt && (
              <button
                onClick={() =>
                  onOpenAiWithPrompt(
                    `Can you explain the mathematical significance of "${selectedFact.title}" and give me a practice question on it?`
                  )
                }
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Ask Questions on This
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: AI Explainer Card or Quick Trivia Guide */}
        <div className="lg:col-span-5 space-y-4">
          {aiData ? (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/80 rounded-3xl p-6 border border-purple-500/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4 text-pink-400" />
                AI Mathematical Deep Dive
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1">Historical Origin:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{aiData.story}</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                <h4 className="text-xs font-bold text-emerald-400 mb-1">Why It Works:</h4>
                <p className="text-xs text-slate-300">{aiData.whyItWorks}</p>
              </div>

              <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/30">
                <h4 className="text-xs font-bold text-amber-300 mb-1">Try It Right Now:</h4>
                <p className="text-xs text-slate-300">{aiData.tryItYourself}</p>
              </div>

              {aiData.funFact && (
                <div className="text-xs text-slate-400 italic">
                  💡 <strong>Mind-Blower:</strong> {aiData.funFact}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 space-y-5">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Why Learn Math Facts?
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Instant Mental Fluency</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Understanding patterns eliminates rote memorization and boosts exam speed by 3x.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Vedic Self-Verification</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Techniques like "Navasesh" (casting out 9s) allow you to verify answers in 2 seconds without recalculating.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Olympiad &amp; Competitive Edge</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Familiarity with number theory constants gives intuition for high-stakes entrance exams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Ready to test your speed?
                </div>
                <div className="text-[11px] text-indigo-300">
                  Head over to the <strong className="text-white">99 Speed Arena</strong> to tackle timed rapid-fire challenges!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
