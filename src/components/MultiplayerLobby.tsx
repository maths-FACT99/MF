import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { generateQuestion } from '../utils/questionGenerator';
import { Question } from '../types/math';
import confetti from 'canvas-confetti';
import {
  Users,
  Trophy,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Award,
  Crown,
  ChevronRight,
} from 'lucide-react';

interface MultiplayerLobbyProps {
  onEarnXp: (amount: number) => void;
}

interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isUser: boolean;
  streak: number;
}

const INITIAL_BOTS = [
  { id: '1', name: 'Aarav (Delhi)', score: 0, avatar: '🦁', isUser: false, streak: 0 },
  { id: '2', name: 'Priya (Mumbai)', score: 0, avatar: '🦊', isUser: false, streak: 0 },
  { id: '3', name: 'Rohan (Bangalore)', score: 0, avatar: '🐯', isUser: false, streak: 0 },
  { id: '4', name: 'Sneha (Kolkata)', score: 0, avatar: '🐼', isUser: false, streak: 0 },
];

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onEarnXp }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'podium'>('lobby');
  const [gamePin, setGamePin] = useState<string>('9942');
  const [userName, setUserName] = useState<string>('Maths Master');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [combo, setCombo] = useState<number>(0);

  const botIntervalRef = useRef<any>(null);

  const startLiveMatch = () => {
    sound.playStreak();
    const userPlayer: Player = {
      id: 'user',
      name: userName || 'You',
      score: 0,
      avatar: '⚡',
      isUser: true,
      streak: 0,
    };
    const all = [userPlayer, ...INITIAL_BOTS.map((b) => ({ ...b, score: 0, streak: 0 }))];
    setPlayers(all);
    setGameState('playing');
    setQuestionIdx(1);
    setCombo(0);
    setCurrentQ(generateQuestion('mixed', 'medium'));
  };

  // Bot score progress simulation
  useEffect(() => {
    if (gameState !== 'playing') return;

    botIntervalRef.current = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.isUser) return p;
          // Random chance for bot to answer
          if (Math.random() > 0.4) {
            const add = Math.random() > 0.2 ? 100 : 0;
            return { ...p, score: p.score + add };
          }
          return p;
        })
      );
    }, 1800);

    return () => clearInterval(botIntervalRef.current);
  }, [gameState]);

  const handleUserAnswer = (opt: number) => {
    if (!currentQ) return;
    const isCorrect = opt === currentQ.answer;

    if (isCorrect) {
      sound.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 100 + newCombo * 20;

      setPlayers((prev) =>
        prev.map((p) => (p.isUser ? { ...p, score: p.score + points, streak: newCombo } : p))
      );
      onEarnXp(15);
    } else {
      sound.playWrong();
      setCombo(0);
    }

    if (questionIdx >= 10) {
      // End game
      clearInterval(botIntervalRef.current);
      setGameState('podium');
      sound.playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      setQuestionIdx((prev) => prev + 1);
      setCurrentQ(generateQuestion('mixed', 'medium'));
    }
  };

  // Sort leaderboard
  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> 99Math Classroom Live Battle
            </span>
            <span className="text-xs text-slate-400">Real-time Multiplayer Simulation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Live Math Showdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Compete in a 10-question sprint against live classroom contenders. Rise to the top of the podium!
          </p>
        </div>
      </div>

      {/* 1. LOBBY SCREEN */}
      {gameState === 'lobby' && (
        <div className="max-w-xl mx-auto bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-white">Join Classroom Arena</h3>
            <p className="text-xs text-slate-400">
              Enter your student handle and game PIN to join the match.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Your Nickname</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Maths Master"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Game Room PIN</label>
              <input
                type="text"
                value={gamePin}
                onChange={(e) => setGamePin(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold text-lg text-center tracking-widest focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={startLiveMatch}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Enter Match
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE LIVE MATCH */}
      {gameState === 'playing' && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Active Question */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-indigo-500/30 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400">
                Question <span className="text-indigo-400 font-mono text-base">{questionIdx}</span> / 10
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> Streak {combo}x
              </div>
            </div>

            <div className="py-10 px-6 rounded-3xl bg-slate-800/50 border border-slate-700/80 text-center">
              <div className="text-4xl sm:text-6xl font-mono font-black text-white">
                {currentQ.expression} = ?
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleUserAnswer(opt)}
                  className="p-5 rounded-2xl bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 text-white font-mono font-black text-2xl transition-all shadow-md active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live Race Leaderboard */}
          <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              Live Race Standing
            </div>

            <div className="space-y-2">
              {ranked.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold ${
                    p.isUser
                      ? 'bg-indigo-950/60 border-indigo-500/60 text-white ring-1 ring-indigo-500/40'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 w-4 font-bold">#{idx + 1}</span>
                    <span className="text-base">{p.avatar}</span>
                    <span className="truncate max-w-[120px] font-bold">
                      {p.name} {p.isUser ? '(You)' : ''}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-amber-300">{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PODIUM SCREEN */}
      {gameState === 'podium' && (
        <div className="max-w-2xl mx-auto bg-slate-900/95 rounded-3xl p-8 border border-indigo-500/30 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <Crown className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-3xl font-black text-white">Match Finished!</h3>
            <p className="text-xs text-slate-300">Here are the final standings for PIN {gamePin}:</p>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-3 items-end pt-6">
            {/* 2nd Place */}
            {ranked[1] && (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
                <span className="text-2xl">{ranked[1].avatar}</span>
                <div className="text-xs font-bold text-slate-300 truncate">{ranked[1].name}</div>
                <div className="text-xs font-mono font-black text-slate-400">2nd Place</div>
                <div className="text-sm font-mono font-bold text-amber-300">{ranked[1].score} pts</div>
              </div>
            )}

            {/* 1st Place */}
            {ranked[0] && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-indigo-950 border border-amber-500/50 text-center space-y-1 scale-105 shadow-xl">
                <Crown className="w-5 h-5 text-amber-400 mx-auto" />
                <span className="text-3xl">{ranked[0].avatar}</span>
                <div className="text-sm font-black text-white truncate">{ranked[0].name}</div>
                <div className="text-xs font-mono font-black text-amber-400">CHAMPION</div>
                <div className="text-lg font-mono font-black text-amber-300">{ranked[0].score} pts</div>
              </div>
            )}

            {/* 3rd Place */}
            {ranked[2] && (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-1">
                <span className="text-2xl">{ranked[2].avatar}</span>
                <div className="text-xs font-bold text-slate-300 truncate">{ranked[2].name}</div>
                <div className="text-xs font-mono font-black text-slate-400">3rd Place</div>
                <div className="text-sm font-mono font-bold text-amber-300">{ranked[2].score} pts</div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => setGameState('lobby')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Play Another Classroom Round
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
