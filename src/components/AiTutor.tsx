import React, { useState } from 'react';
import { sound } from '../utils/audio';
import {
  Bot,
  Sparkles,
  Send,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface AiTutorProps {
  onEarnXp: (amount: number) => void;
  initialPrompt?: string;
}

export const AiTutor: React.FC<AiTutorProps> = ({ onEarnXp, initialPrompt }) => {
  const [problem, setProblem] = useState<string>(
    initialPrompt || 'Solve 2x² - 7x + 3 = 0 using factoring and quadratic formula'
  );
  const [topic, setTopic] = useState<string>('Algebra & Quadratic Equations');
  const [level, setLevel] = useState<string>('Class 10 CBSE/NCERT');
  const [loading, setLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    {
      title: 'Quadratic Equation',
      query: 'Solve 2x² - 7x + 3 = 0 using factoring and quadratic formula',
      topic: 'Class 10 Algebra',
    },
    {
      title: 'Vedic Speed Multiply',
      query: 'What is the fastest Vedic shortcut to multiply 96 × 94 without long multiplication?',
      topic: 'Vedic Math',
    },
    {
      title: 'Mensuration Cone',
      query: 'A cone has radius 7 cm and height 24 cm. Find its slant height, total surface area, and volume.',
      topic: 'Class 9/10 Mensuration',
    },
    {
      title: 'Why x⁰ = 1 ?',
      query: 'Explain with visual mathematical proof why any non-zero number raised to power 0 equals 1.',
      topic: 'Exponents & Powers',
    },
    {
      title: 'Speed, Distance & Time',
      query: 'A train 150 meters long is traveling at 54 km/h. In how many seconds will it cross an electric pole?',
      topic: 'Arithmetic Word Problem',
    },
  ];

  const handleSolve = async (customQuery?: string) => {
    const q = customQuery || problem;
    if (!q.trim()) return;

    sound.playStreak();
    setLoading(true);
    setError('');
    setSolution(null);

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: q, topic, level }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSolution(data.data);
        sound.playVictory();
        onEarnXp(25);
      } else {
        throw new Error(data.error || 'Failed to solve problem');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to MathsFact AI. Please try again.');
      sound.playWrong();
    } finally {
      setLoading(false);
    }
  };

  const copySolution = () => {
    if (!solution) return;
    const txt = `${solution.title}\nFinal Answer: ${solution.finalAnswer}\n\nSteps:\n${solution.steps
      ?.map((s: any) => `${s.stepNumber}. ${s.title}: ${s.explanation} (${s.calculation})`)
      .join('\n')}\n\nQuick Trick: ${solution.quickTrick}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider flex items-center gap-1">
              <Bot className="w-3 h-3 text-indigo-400" /> MathsFact AI Engine
            </span>
            <span className="text-xs text-slate-400">Powered by Gemini 3.8</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Step-by-Step AI Problem Solver
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Type any math question from DAV, NCERT, CBSE or competitive exams. Get clear step-by-step logic, speed tricks, and common pitfalls.
          </p>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Try Example:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setProblem(p.query);
              setTopic(p.topic);
              handleSolve(p.query);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium whitespace-nowrap transition-all"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Enter Math Question or Concept:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Find the roots of x² - 5x + 6 = 0 or explain the Pythagorean theorem..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2"
            >
              <option value="Algebra & Quadratic Equations">Algebra &amp; Quadratics</option>
              <option value="Trigonometry & Heights">Trigonometry</option>
              <option value="Geometry & Mensuration">Mensuration &amp; Geometry</option>
              <option value="Vedic & Speed Math">Vedic &amp; Speed Math</option>
              <option value="Arithmetic & Commercial Math">Commercial Arithmetic</option>
              <option value="Probability & Statistics">Probability &amp; Stats</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl px-3 py-2"
            >
              <option value="Middle School (Class 6-8)">Class 6-8</option>
              <option value="High School (Class 9-10)">Class 9-10 (DAV/NCERT)</option>
              <option value="Senior Secondary (Class 11-12)">Class 11-12</option>
              <option value="Olympiad / Competitive Exam">Olympiad / NTSE</option>
            </select>
          </div>

          <button
            onClick={() => handleSolve()}
            disabled={loading || !problem.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Solving Step-by-Step...' : 'Solve Problem (+25 XP)'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Solution Display Card */}
      {solution && (
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                MathsFact AI Solution
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {solution.title}
              </h3>
            </div>
            <button
              onClick={copySolution}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Solution'}
            </button>
          </div>

          {/* Final Answer Big Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-800 to-indigo-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Final Answer
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white mt-1">
                {solution.finalAnswer}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Verified Solution ✓
            </span>
          </div>

          {/* Step-by-Step Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Step-by-Step Working:
            </h4>
            <div className="space-y-3">
              {solution.steps?.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                      {s.stepNumber || idx + 1}
                    </span>
                    <h5 className="text-sm font-bold text-white">{s.title}</h5>
                  </div>
                  <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                    {s.explanation}
                  </p>
                  {s.formula && (
                    <div className="ml-8 text-xs font-mono font-bold text-indigo-300 bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-500/20 inline-block">
                      Formula: {s.formula}
                    </div>
                  )}
                  {s.calculation && (
                    <div className="ml-8 p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 font-mono text-xs text-amber-300 font-semibold">
                      Calculation: {s.calculation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Trick & Common Trap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.quickTrick && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Speed Trick / Vedic Check:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {solution.quickTrick}
                </p>
              </div>
            )}

            {solution.commonPitfall && (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Common Exam Trap:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {solution.commonPitfall}
                </p>
              </div>
            )}
          </div>

          {/* Follow-up Practice Challenge */}
          {solution.practiceChallenge && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  Try Similar Question:
                </span>
                <p className="text-xs font-bold text-white mt-0.5">
                  {solution.practiceChallenge.question}
                </p>
              </div>
              <button
                onClick={() => {
                  setProblem(solution.practiceChallenge.question);
                  handleSolve(solution.practiceChallenge.question);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all whitespace-nowrap active:scale-95"
              >
                Solve Practice
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
