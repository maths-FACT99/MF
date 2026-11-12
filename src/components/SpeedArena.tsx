import React, { useState, useEffect, useRef } from 'react';
import { MathOperation, DifficultyLevel, Question } from '../types/math';
import { generateQuestion } from '../utils/questionGenerator';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Zap,
  Play,
  RotateCcw,
  Flame,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
} from 'lucide-react';

interface SpeedArenaProps {
  onEarnXp: (amount: number) => void;
  onRecordSolve: (correct: boolean) => void;
}

export const SpeedArena: React.FC<SpeedArenaProps> = ({ onEarnXp, onRecordSolve }) => {
  // Game Setup
  const [mode, setMode] = useState<'blitz' | 'century' | 'endurance'>('blitz');
  const [operation, setOperation] = useState<MathOperation>('mixed');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Gameplay State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [history, setHistory] = useState<
    { q: Question; selected: number; isCorrect: boolean }[]
  >([]);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<any>(null);

  const totalTimeForMode = mode === 'blitz' ? 60 : mode === 'endurance' ? 180 : 0;

  // Start Challenge
  const startGame = () => {
    sound.playStreak();
    setIsPlaying(true);
    setIsFinished(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setQuestionsAnswered(0);
    setHistory([]);
    setLastFeedback(null);

    const initialQ = generateQuestion(operation, difficulty);
    setCurrentQuestion(initialQ);

    if (mode === 'blitz') {
      setTimeLeft(60);
    } else if (mode === 'endurance') {
      setTimeLeft(180);
    } else {
      setTimeLeft(0); // Count-up for century mode
    }
  };

  // Timer Tick
  useEffect(() => {
    if (!isPlaying) return;

    if (mode === 'blitz' || mode === 'endurance') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          if (prev <= 5) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Century mode: timer counts UP
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, mode]);

  // Answer Submission
  const handleAnswer = (selectedOption: number) => {
    if (!currentQuestion || !isPlaying) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    onRecordSolve(isCorrect);

    if (isCorrect) {
      sound.playCorrect();
      setLastFeedback('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Streak milestones trigger celebration sound & confetti
      if (newCombo === 5 || newCombo === 10 || newCombo === 25 || newCombo === 50) {
        sound.playStreak();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }

      // Calculate XP with combo multiplier
      const multiplier = newCombo >= 10 ? 3 : newCombo >= 5 ? 2 : newCombo >= 3 ? 1.5 : 1;
      const earned = Math.round(10 * multiplier);
      onEarnXp(earned);
      setScore((prev) => prev + earned);
    } else {
      sound.playWrong();
      setLastFeedback('wrong');
      setCombo(0);
    }

    const newHistory = [
      ...history,
      { q: currentQuestion, selected: selectedOption, isCorrect },
    ];
    setHistory(newHistory);
    const newAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newAnswered);

    // If Century mode (99 questions) and reached 99:
    if (mode === 'century' && newAnswered >= 99) {
      finishGame();
      return;
    }

    // Next Question
    setCurrentQuestion(generateQuestion(operation, difficulty));
  };

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    if (!isPlaying || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion.options[idx] !== undefined) {
          handleAnswer(currentQuestion.options[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentQuestion]);

  const finishGame = () => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsFinished(true);
    sound.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Accuracy calculation
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = questionsAnswered > 0 ? Math.round((correctCount / questionsAnswered) * 100) : 0;
  const apm =
    mode === 'blitz'
      ? Math.round(questionsAnswered)
      : timeLeft > 0
      ? Math.round((questionsAnswered / timeLeft) * 60)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> 99 Math Arena
            </span>
            <span className="text-xs text-slate-400">Mental Fluency &amp; Speed Drills</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rapid-Fire Mental Math Sprint
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Build unstoppable calculating reflex. Solve fast, maintain your combo streak, and level up!
          </p>
        </div>

        {!isPlaying && (
          <button
            onClick={startGame}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Challenge
          </button>
        )}
      </div>

      {/* Mode & Category Config (Visible when not playing) */}
      {!isPlaying && !isFinished && (
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          {/* Game Mode Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              1. Choose Challenge Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setMode('blitz')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'blitz'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">60-Second Blitz</span>
                  <Clock className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-xs text-slate-400">
                  Solve as many equations as you can in 1 minute.
                </p>
              </button>

              <button
                onClick={() => setMode('century')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'century'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">The 99 Math Run</span>
                  <Flame className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xs text-slate-400">
                  Sprint through 99 rapid problems. Time counts up!
                </p>
              </button>

              <button
                onClick={() => setMode('endurance')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'endurance'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">3-Minute Endurance</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400">
                  Extended stamina session for competitive exam prep.
                </p>
              </button>
            </div>
          </div>

          {/* Operation Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              2. Select Operation Focus
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mixed' as MathOperation, label: '🎲 Mixed All-Rounder' },
                { id: 'multiply' as MathOperation, label: '× Multiplication' },
                { id: 'divide' as MathOperation, label: '÷ Division' },
                { id: 'add' as MathOperation, label: '+ Addition' },
                { id: 'subtract' as MathOperation, label: '- Subtraction' },
                { id: 'square' as MathOperation, label: 'x² Squares & Roots' },
                { id: 'fraction' as MathOperation, label: '% Fractions & Percents' },
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => setOperation(op.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    operation === op.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'easy' as DifficultyLevel, label: 'Rookie (Grade 3-5)' },
                { id: 'medium' as DifficultyLevel, label: 'Scholar (Grade 6-8)' },
                { id: 'hard' as DifficultyLevel, label: 'Master (Grade 9-10)' },
                { id: 'olympiad' as DifficultyLevel, label: 'Grandmaster (Vedic)' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setDifficulty(lvl.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    difficulty === lvl.id
                      ? 'bg-slate-100 text-slate-900 border-white shadow'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Game Interface */}
      {isPlaying && currentQuestion && (
        <div className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
          {/* Top Status HUD */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
            {/* Timer Display */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {mode === 'century' ? 'Time Elapsed' : 'Time Remaining'}
                </span>
                <span
                  className={`text-xl sm:text-2xl font-mono font-black ${
                    mode !== 'century' && timeLeft <= 10
                      ? 'text-rose-400 animate-pulse'
                      : 'text-white'
                  }`}
                >
                  {mode === 'century'
                    ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                        .toString()
                        .padStart(2, '0')}`
                    : `${timeLeft}s`}
                </span>
              </div>
            </div>

            {/* Questions Counter */}
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Solved
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-indigo-300">
                {questionsAnswered} {mode === 'century' ? '/ 99' : ''}
              </span>
            </div>

            {/* Streak Combo Multiplier */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs ${
                  combo >= 5
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/20 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <Flame
                  className={`w-4 h-4 ${
                    combo >= 5 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                  }`}
                />
                <span>Streak {combo}x</span>
              </div>
            </div>
          </div>

          {/* Big Equation Card */}
          <div
            className={`relative flex flex-col items-center justify-center py-12 px-6 rounded-3xl border transition-all ${
              lastFeedback === 'correct'
                ? 'bg-emerald-950/20 border-emerald-500/50 ring-2 ring-emerald-500/20'
                : lastFeedback === 'wrong'
                ? 'bg-rose-950/20 border-rose-500/50 ring-2 ring-rose-500/20'
                : 'bg-slate-800/40 border-slate-700/60'
            }`}
          >
            <div className="text-4xl sm:text-6xl font-mono font-black tracking-tight text-white mb-2 select-none">
              {currentQuestion.expression} = ?
            </div>

            {currentQuestion.speedTrick && (
              <div className="text-xs text-amber-300/80 font-medium flex items-center gap-1.5 mt-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Trick: {currentQuestion.speedTrick}</span>
              </div>
            )}
          </div>

          {/* 4 Interactive Answer Options */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/60 text-white font-mono font-extrabold text-xl sm:text-2xl transition-all shadow-md active:scale-95"
              >
                <span className="text-xs text-slate-500 font-sans font-bold group-hover:text-indigo-300">
                  [{idx + 1}]
                </span>
                <span className="tracking-wider">{opt}</span>
                <span className="w-3" />
              </button>
            ))}
          </div>

          {/* Quick instructions / keyboard note */}
          <div className="text-center text-[11px] text-slate-500">
            Tip: Press number keys <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">1</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">2</kbd>, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">3</kbd>, or <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">4</kbd> on your keyboard!
          </div>
        </div>
      )}

      {/* Finished Summary Screen */}
      {isFinished && (
        <div className="bg-slate-900/95 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Sprint Completed!</h3>
            <p className="text-xs text-slate-300">
              Outstanding effort! Here is your mental agility performance breakdown:
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Accuracy
              </span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                {accuracy}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {correctCount} / {questionsAnswered} correct
              </span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Speed (RPM)
              </span>
              <span className="text-2xl font-mono font-black text-indigo-400">
                {apm}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                problems / minute
              </span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Max Combo
              </span>
              <span className="text-2xl font-mono font-black text-amber-400">
                {maxCombo}x
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                consecutive correct
              </span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Total XP Earned
              </span>
              <span className="text-2xl font-mono font-black text-purple-400">
                +{score}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                mastery points
              </span>
            </div>
          </div>

          {/* Review Mistakes Section */}
          {history.filter((h) => !h.isCorrect).length > 0 && (
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/80 space-y-3">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Questions to Review &amp; Master:
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {history
                  .filter((h) => !h.isCorrect)
                  .map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                    >
                      <span className="font-mono font-bold text-white">
                        {h.q.expression}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-rose-400 font-mono line-through">
                          Your: {h.selected}
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          Correct: {h.q.answer}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={() => {
                setIsFinished(false);
                setIsPlaying(false);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
            >
              Change Mode &amp; Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
