import { MathOperation, DifficultyLevel, Question } from '../types/math';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateQuestion(op: MathOperation, difficulty: DifficultyLevel): Question {
  let expression = '';
  let answer = 0;
  let speedTrick = '';
  let category: MathOperation = op;

  const actualOp = op === 'mixed'
    ? (['add', 'subtract', 'multiply', 'divide', 'square'] as MathOperation[])[getRandomInt(0, 4)]
    : op;

  category = actualOp;

  if (actualOp === 'add') {
    let a = 0;
    let b = 0;
    if (difficulty === 'easy') {
      a = getRandomInt(5, 50);
      b = getRandomInt(5, 50);
    } else if (difficulty === 'medium') {
      a = getRandomInt(35, 180);
      b = getRandomInt(25, 120);
    } else if (difficulty === 'hard') {
      a = getRandomInt(120, 990);
      b = getRandomInt(85, 880);
    } else {
      a = getRandomInt(850, 4500);
      b = getRandomInt(650, 3800);
    }
    expression = `${a} + ${b}`;
    answer = a + b;
    speedTrick = `Break into tens & units: ${a} + ${b} = (${Math.floor(a/10)*10} + ${Math.floor(b/10)*10}) + (${a%10} + ${b%10})`;
  } else if (actualOp === 'subtract') {
    let a = 0;
    let b = 0;
    if (difficulty === 'easy') {
      a = getRandomInt(20, 99);
      b = getRandomInt(5, a - 1);
    } else if (difficulty === 'medium') {
      a = getRandomInt(100, 350);
      b = getRandomInt(25, a - 10);
    } else if (difficulty === 'hard') {
      a = getRandomInt(500, 1500);
      b = getRandomInt(120, a - 50);
    } else {
      a = getRandomInt(2000, 8000);
      b = getRandomInt(750, a - 100);
    }
    expression = `${a} - ${b}`;
    answer = a - b;
    speedTrick = `Subtract to round number first: ${a} - ${Math.round(b/10)*10} ± remainder`;
  } else if (actualOp === 'multiply') {
    let a = 0;
    let b = 0;
    if (difficulty === 'easy') {
      a = getRandomInt(2, 12);
      b = getRandomInt(2, 12);
    } else if (difficulty === 'medium') {
      // Often test 11x or 5x or 9x tricks
      const useSpecial = Math.random() > 0.4;
      if (useSpecial) {
        a = getRandomInt(12, 75);
        b = 11;
        speedTrick = 'Multiply by 11: add the two digits and put the sum in the middle!';
      } else {
        a = getRandomInt(12, 35);
        b = getRandomInt(3, 9);
      }
    } else if (difficulty === 'hard') {
      a = getRandomInt(14, 99);
      b = getRandomInt(12, 25);
    } else {
      a = getRandomInt(88, 99);
      b = getRandomInt(88, 99);
      speedTrick = 'Base 100 trick: cross subtract deficiencies from 100!';
    }
    expression = `${a} × ${b}`;
    answer = a * b;
  } else if (actualOp === 'divide') {
    let b = 0;
    let q = 0;
    if (difficulty === 'easy') {
      b = getRandomInt(2, 9);
      q = getRandomInt(2, 12);
    } else if (difficulty === 'medium') {
      b = getRandomInt(4, 15);
      q = getRandomInt(12, 40);
    } else if (difficulty === 'hard') {
      b = getRandomInt(7, 25);
      q = getRandomInt(25, 95);
    } else {
      b = getRandomInt(12, 45);
      q = getRandomInt(50, 150);
    }
    const a = b * q;
    expression = `${a} ÷ ${b}`;
    answer = q;
  } else if (actualOp === 'square') {
    let n = 0;
    if (difficulty === 'easy') {
      n = getRandomInt(4, 15);
    } else if (difficulty === 'medium') {
      // numbers ending in 5
      n = getRandomInt(1, 9) * 10 + 5;
      speedTrick = 'Square ending in 5: tens × (tens + 1), followed by 25!';
    } else if (difficulty === 'hard') {
      n = getRandomInt(16, 50);
    } else {
      n = getRandomInt(51, 99);
    }
    expression = `${n}²`;
    answer = n * n;
  } else {
    // Fraction or percentage
    const percent = [10, 20, 25, 50, 75][getRandomInt(0, 4)];
    const base = getRandomInt(2, 20) * 10;
    expression = `${percent}% of ${base}`;
    answer = (percent * base) / 100;
    speedTrick = 'Swap percentages or convert to simple fraction (e.g. 25% = 1/4, 50% = 1/2)';
  }

  // Generate 4 plausible options including the correct answer
  const distractors = new Set<number>();
  distractors.add(answer);

  // Common pitfalls
  const offsets = [-10, 10, -1, 1, -2, 2, -5, 5, 100, -100];
  for (const off of shuffleArray(offsets)) {
    const candidate = answer + off;
    if (candidate > 0 && candidate !== answer) {
      distractors.add(candidate);
    }
    if (distractors.size >= 4) break;
  }

  // If still less than 4, generate random variations
  while (distractors.size < 4) {
    const diff = getRandomInt(-15, 15);
    const candidate = answer + (diff === 0 ? 3 : diff);
    if (candidate > 0) distractors.add(candidate);
  }

  const options = shuffleArray(Array.from(distractors)).slice(0, 4);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    expression,
    answer,
    options,
    speedTrick,
    category,
  };
}
