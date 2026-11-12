import React, { useState, useEffect, useRef } from 'react';
import { FORMULA_BOOKS } from '../data/formulaBooks';
import { FormulaBook } from '../types';
import { sound } from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  Zap,
  Play,
  RotateCcw,
  Clock,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight,
  Calculator,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FormulaRailSectionProps {
  onEarnXp?: (amount: number) => void;
}

export const FormulaRailSection: React.FC<FormulaRailSectionProps> = ({ onEarnXp }) => {
  const [selectedBook, setSelectedBook] = useState<FormulaBook | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameDifficulty, setGameDifficulty] = useState<'easy' | 'medium' | 'olympiad'>('medium');
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameStreak, setGameStreak] = useState<number>(0);
  const [gameTimeLeft, setGameTimeLeft] = useState<number>(45);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<{
    q: string;
    answer: number;
    options: number[];
    tip: string;
  } | null>(null);

  const gameTimerRef = useRef<any>(null);

  // Mouse tilt tracking for 3D physics rail
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Generate question for the embedded speed game
  const generateGameQuestion = (diff: 'easy' | 'medium' | 'olympiad') => {
    let q = '';
    let answer = 0;
    let tip = '';

    if (diff === 'easy') {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        q = `${a} + ${b}`;
        answer = a + b;
        tip = 'Add tens first, then units!';
      } else if (type === 1) {
        const a = Math.floor(Math.random() * 12) + 3;
        const b = Math.floor(Math.random() * 12) + 3;
        q = `${a} × ${b}`;
        answer = a * b;
        tip = 'Times table recall';
      } else {
        const a = Math.floor(Math.random() * 80) + 20;
        const b = Math.floor(Math.random() * a * 0.7) + 5;
        q = `${a} - ${b}`;
        answer = a - b;
        tip = 'Count up from subtracted number';
      }
    } else if (diff === 'medium') {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        // Square ending in 5
        const tens = Math.floor(Math.random() * 8) + 1;
        const n = tens * 10 + 5;
        q = `${n}²`;
        answer = n * n;
        tip = `Vedic rule: ${tens} × ${tens + 1} = ${tens * (tens + 1)}, attach 25!`;
      } else if (type === 1) {
        // Multiply by 11
        const n = Math.floor(Math.random() * 65) + 12;
        q = `${n} × 11`;
        answer = n * 11;
        tip = 'Insert the sum of the two digits in between!';
      } else if (type === 2) {
        // Quadratic root product
        const a = 1;
        const b = -(Math.floor(Math.random() * 6) + 3);
        const c = Math.floor(Math.random() * 10) + 2;
        q = `Product of roots for x² + (${b})x + ${c} = 0`;
        answer = c;
        tip = 'Product of roots α·β = c / a = ' + c;
      } else {
        // Percentage shortcut
        const base = (Math.floor(Math.random() * 9) + 2) * 10;
        q = `20% of ${base}`;
        answer = (20 * base) / 100;
        tip = '20% is exactly 1/5 of the number';
      }
    } else {
      // Olympiad Master
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        // Base 100 multiplication
        const d1 = Math.floor(Math.random() * 6) + 1; // 94 to 99
        const d2 = Math.floor(Math.random() * 6) + 1;
        const n1 = 100 - d1;
        const n2 = 100 - d2;
        q = `${n1} × ${n2}`;
        answer = n1 * n2;
        tip = `Deficiencies: -${d1}, -${d2}. Left: ${n1 - d2}, Right: ${d1 * d2}`;
      } else if (type === 1) {
        // Trig special
        const angles = [
          { expr: 'sin(30°) + cos(60°)', ans: 1 },
          { expr: 'tan(45°) + sin(90°)', ans: 2 },
          { expr: 'sec²(45°) - tan²(45°)', ans: 1 },
          { expr: 'sin²(60°) + cos²(60°)', ans: 1 },
        ];
        const pick = angles[Math.floor(Math.random() * angles.length)];
        q = pick.expr;
        answer = pick.ans;
        tip = 'Apply standard trigonometric angle identities';
      } else {
        // Discriminant calculation
        const a = 2;
        const b = 5;
        const c = 2;
        q = `Discriminant (b² - 4ac) for 2x² + 5x + 2 = 0`;
        answer = 5 * 5 - 4 * 2 * 2; // 25 - 16 = 9
        tip = 'D = 5² - 4(2)(2) = 25 - 16 = 9';
      }
    }

    // Generate 4 plausible options
    const set = new Set<number>();
    set.add(answer);
    const deltas = [-10, 10, -1, 1, -2, 2, -5, 5];
    for (const d of deltas) {
      if (set.size >= 4) break;
      const candidate = answer + d;
      if (candidate >= 0 && candidate !== answer) {
        set.add(candidate);
      }
    }
    while (set.size < 4) {
      const rand = answer + Math.floor(Math.random() * 15) - 7;
      if (rand >= 0 && rand !== answer) set.add(rand);
    }

    const options = Array.from(set).sort(() => Math.random() - 0.5);
    return { q, answer, options, tip };
  };

  const startGame = () => {
    sound.playStreak();
    setGameActive(true);
    setGameFinished(false);
    setGameScore(0);
    setGameStreak(0);
    setGameTimeLeft(45);
    setCurrentQuestion(generateGameQuestion(gameDifficulty));
  };

  useEffect(() => {
    if (!gameActive) return;

    gameTimerRef.current = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          endGame();
          return 0;
        }
        if (prev <= 5) sound.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameActive]);

  const handleGameAnswer = (selected: number) => {
    if (!currentQuestion || !gameActive) return;

    const isCorrect = selected === currentQuestion.answer;
    if (isCorrect) {
      sound.playCorrect();
      const newStreak = gameStreak + 1;
      setGameStreak(newStreak);
      const points = 10 * (newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1);
      setGameScore((prev) => prev + points);
      if (onEarnXp) onEarnXp(points);

      if (newStreak === 5 || newStreak === 10) {
        sound.playStreak();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      sound.playWrong();
      setGameStreak(0);
    }

    setCurrentQuestion(generateGameQuestion(gameDifficulty));
  };

  const endGame = () => {
    clearInterval(gameTimerRef.current);
    setGameActive(false);
    setGameFinished(true);
    sound.playVictory();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <section
      id="formula-rail"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-20 bg-[#F8F7F4] border-b-2 border-[#111113] relative overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div className="space-y-3">
            <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
              <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
              <span>[ HANGING BOOKS PHYSICS &amp; SPEED CHALLENGE ]</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
              3D Hanging Formula Books &amp;{' '}
              <span className="text-[#E63946]">Speed Challenge</span>
            </h2>
            <p className="text-base sm:text-lg text-[#52525B] max-w-2xl">
              Hover and tilt to explore suspended subject handbooks. Click any book for instant theorem derivations, or launch the embedded mental math speed run!
            </p>
          </div>

          <button
            onClick={startGame}
            className="btn-ink flex items-center gap-2 text-xs"
          >
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>Launch Speed Challenge</span>
          </button>
        </div>

        {/* --- 3D OVERHEAD MOUNTING RAIL & SUSPENDED BOOKS --- */}
        <div className="relative pt-8 pb-16">
          {/* Overhead Heavy Metallic Mounting Rail */}
          <div className="relative mx-auto max-w-6xl h-5 rounded-full bg-gradient-to-r from-slate-800 via-zinc-600 to-slate-800 border-t border-b border-zinc-500 shadow-2xl shadow-black flex items-center justify-between px-6 z-20">
            {/* Mounting Wall Brackets */}
            <div className="w-5 h-8 -mt-1.5 rounded bg-zinc-700 border border-zinc-500 shadow" />
            <div className="w-5 h-8 -mt-1.5 rounded bg-zinc-700 border border-zinc-500 shadow" />
            <div className="w-5 h-8 -mt-1.5 rounded bg-zinc-700 border border-zinc-500 shadow" />
            <div className="w-5 h-8 -mt-1.5 rounded bg-zinc-700 border border-zinc-500 shadow" />
            <div className="w-5 h-8 -mt-1.5 rounded bg-zinc-700 border border-zinc-500 shadow" />
          </div>

          {/* Hanging Books Rail Container with Perspective */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 pt-0 relative z-10"
            style={{
              perspective: '1000px',
            }}
          >
            {FORMULA_BOOKS.map((book, idx) => {
              // Tilt computation based on mouse offset + index alternating sway
              const swayClass = idx % 2 === 0 ? 'animate-sway-slow' : 'animate-sway-opposite';
              const tiltX = mouseOffset.y * 12;
              const tiltY = -mouseOffset.x * 14;

              return (
                <div
                  key={book.id}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => {
                    sound.playTick();
                    setSelectedBook(book);
                  }}
                >
                  {/* Suspension Cable / Chain */}
                  <div
                    className="w-1 bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-400 shadow-sm relative transition-all duration-300"
                    style={{
                      height: `${book.chainLength}px`,
                      backgroundImage:
                        'repeating-linear-gradient(0deg, #71717a, #71717a 3px, #27272a 3px, #27272a 6px)',
                    }}
                  >
                    {/* Ring Hook at top */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-zinc-400" />
                    {/* Carabiner Clasp at book top */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-3 rounded-sm bg-amber-500 border border-amber-300" />
                  </div>

                  {/* 3D Hanging Book Cover Card */}
                  <div
                    className={`w-full max-w-[170px] aspect-[1/1.42] rounded-2xl p-4 bg-gradient-to-br ${book.coverGradient} border border-white/20 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400 relative overflow-hidden flex flex-col justify-between select-none ${swayClass}`}
                    style={{
                      transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.8), 0 0 15px -3px rgba(220,38,38,0.3)',
                    }}
                  >
                    {/* Book spine simulation overlay */}
                    <div className="absolute top-0 left-0 bottom-0 w-3.5 bg-black/40 border-r border-white/20 shadow-inner" />

                    {/* Book Top Header */}
                    <div className="pl-2 space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/50 text-amber-300 inline-block">
                        {book.classLevel}
                      </span>
                      <div className="text-[10px] text-gray-200 uppercase font-bold tracking-tight line-clamp-1">
                        {book.domain}
                      </div>
                    </div>

                    {/* Book Center Title & Icon */}
                    <div className="pl-2 py-2 text-center">
                      <div className="w-8 h-8 mx-auto rounded-xl bg-black/40 border border-white/20 flex items-center justify-center mb-1.5 shadow">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-heading font-black text-xs sm:text-sm text-white tracking-tight leading-snug">
                        {book.title}
                      </h4>
                    </div>

                    {/* Book Bottom Preview */}
                    <div className="pl-2 pt-1 border-t border-white/15 flex items-center justify-between text-[9px] text-amber-200 font-bold">
                      <span>Click to Open</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- EMBEDDED SPEED CHALLENGE GAME MODAL / PANEL --- */}
        {gameActive && currentQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-[#121622] border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setGameActive(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Game Top HUD */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">
                      Time Remaining
                    </span>
                    <span
                      className={`font-mono font-black text-2xl ${
                        gameTimeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'
                      }`}
                    >
                      {gameTimeLeft}s
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Score</span>
                  <span className="font-mono font-black text-2xl text-amber-400">
                    {gameScore} pts
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/20 text-red-300 border border-red-500/40 font-bold text-xs">
                  <Flame className="w-4 h-4 text-red-400 fill-red-400" />
                  <span>Streak {gameStreak}x</span>
                </div>
              </div>

              {/* Question Expression Box */}
              <div className="p-8 rounded-3xl bg-[#0B0D11] border border-white/10 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Solve Mentally:
                </span>
                <div className="font-mono font-black text-3xl sm:text-5xl text-white select-none">
                  {currentQuestion.q} = ?
                </div>
                <div className="text-xs text-amber-400 font-semibold pt-1">
                  💡 Hint: {currentQuestion.tip}
                </div>
              </div>

              {/* 4 Interactive Answer Options */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleGameAnswer(opt)}
                    className="p-5 rounded-2xl bg-[#181D2A] hover:bg-red-600 border border-white/10 hover:border-red-400 text-white font-mono font-black text-xl sm:text-2xl transition-all shadow active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game Finished Summary Dialog */}
        {gameFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-[#121622] border border-amber-500/40 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative">
              <button
                onClick={() => setGameFinished(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center">
                <Award className="w-9 h-9" />
              </div>

              <div>
                <h3 className="font-heading font-black text-2xl text-white">Speed Round Over!</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Great mental agility! Here is your performance:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0D11] border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Total Points</span>
                <div className="font-mono font-black text-4xl text-amber-400">
                  {gameScore} <span className="text-sm font-sans font-bold text-gray-400">PTS</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startGame}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-heading font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
                <button
                  onClick={() => setGameFinished(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- BOOK DETAIL MODAL --- */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-[#121622] border border-red-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-18 rounded-xl bg-gradient-to-br ${selectedBook.coverGradient} p-1 shrink-0 shadow-lg`}
                >
                  <div className="w-full h-full rounded-lg bg-black/40 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 uppercase">
                    {selectedBook.classLevel} • {selectedBook.domain}
                  </span>
                  <h3 className="font-heading font-black text-2xl text-white mt-1">
                    {selectedBook.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {selectedBook.summary}
                  </p>
                </div>
              </div>

              {/* Core Formulas List */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  Key Formulas &amp; Practical Applications:
                </h4>
                <div className="space-y-2.5">
                  {selectedBook.formulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-[#0B0D11] border border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{f.name}</span>
                        <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {f.formula}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {f.explanation}
                      </p>
                      <div className="text-[10px] text-gray-300 font-mono bg-white/5 p-2 rounded-lg">
                        Example: {f.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Derivations */}
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/25 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 block">
                  Fundamental Concept Derivations Covered in Class:
                </span>
                <ul className="text-xs text-gray-200 space-y-1">
                  {selectedBook.keyDerivations.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10"
                >
                  Close Handbook
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
