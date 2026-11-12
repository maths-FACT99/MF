export type MathOperation = 'add' | 'subtract' | 'multiply' | 'divide' | 'square' | 'fraction' | 'mixed';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'olympiad';

export interface Question {
  id: string;
  expression: string;
  answer: number;
  options: number[];
  speedTrick?: string;
  explanation?: string;
  category: MathOperation;
}

export interface MathFact {
  id: string;
  title: string;
  tagline: string;
  highlightNumber: string;
  summary: string;
  deepExplanation: string;
  interactiveType: 'kaprekar' | 'ramanujan' | 'fibonacci' | 'nines' | 'general';
  category: 'History' | 'Number Theory' | 'Geometry' | 'Vedic' | 'Curiosity';
}

export interface VedicTrick {
  id: string;
  title: string;
  subtitle: string;
  sanskritName?: string;
  description: string;
  defaultNum1: number;
  defaultNum2?: number;
  rule: string;
  steps: string[];
  calculate: (n1: number, n2?: number) => { result: number; stepBreakdown: string[] };
}

export interface BrainTeaser {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialEquation?: string;
  correctEquation?: string;
  hint: string;
  solution: string;
  type: 'matchstick' | 'sequence' | 'logic' | 'grid';
  matchstickData?: {
    sticks: { id: number; active: boolean; x: number; y: number; horizontal: boolean }[];
  };
}

export interface UserStats {
  totalSolved: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  xp: number;
  level: number;
  soundEnabled: boolean;
  unlockedBadges: string[];
}
