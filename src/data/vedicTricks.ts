import { VedicTrick } from '../types/math';

export const VEDIC_TRICKS: VedicTrick[] = [
  {
    id: 'square-ending-5',
    title: 'Squaring Numbers Ending in 5',
    subtitle: 'Solve in 2 seconds without pen or paper',
    sanskritName: 'Ekadhikena Purvena (By one more than the previous one)',
    description:
      'Any number ending with 5 can be squared instantly. Multiply the tens digit n by (n + 1), then suffix 25 to the end.',
    defaultNum1: 75,
    rule: 'n5² = [n × (n + 1)] [25]',
    steps: [
      'Separate the tens digit (n) from the unit digit (5)',
      'Multiply n by the next consecutive number (n + 1)',
      'Write 25 right next to the product',
    ],
    calculate: (n1: number) => {
      const tens = Math.floor(n1 / 10);
      const product = tens * (tens + 1);
      const result = product * 100 + 25;
      return {
        result,
        stepBreakdown: [
          `Number: ${n1}`,
          `Tens digit: ${tens}`,
          `Left part: ${tens} × (${tens} + 1) = ${tens} × ${tens + 1} = ${product}`,
          `Right part: 5² = 25`,
          `Combined: ${product} & 25 = ${result}`,
        ],
      };
    },
  },
  {
    id: 'multiply-by-11',
    title: 'Instant Multiplication by 11',
    subtitle: 'Split digits and insert their sum in the middle',
    sanskritName: 'Antyayoreva (Only the end terms)',
    description:
      'To multiply any two-digit number ab by 11, write a on the left, b on the right, and insert (a + b) in the middle. If sum ≥ 10, carry 1 to the left.',
    defaultNum1: 43,
    rule: 'ab × 11 = a | (a + b) | b',
    steps: [
      'Take the two digits: a and b',
      'Add them together: sum = a + b',
      'Place the sum in between a and b (carry 1 to a if sum ≥ 10)',
    ],
    calculate: (n1: number) => {
      const a = Math.floor(n1 / 10);
      const b = n1 % 10;
      const sum = a + b;
      const result = n1 * 11;
      const carry = Math.floor(sum / 10);
      const middle = sum % 10;
      return {
        result,
        stepBreakdown: [
          `Original number: ${n1}`,
          `Digits: First = ${a}, Last = ${b}`,
          `Sum of digits: ${a} + ${b} = ${sum}`,
          carry > 0
            ? `Since ${sum} ≥ 10, keep ${middle} in middle and add ${carry} to ${a} -> (${a} + ${carry}) = ${a + carry}`
            : `Place ${sum} in between ${a} and ${b}`,
          `Final answer: ${result}`,
        ],
      };
    },
  },
  {
    id: 'base-100-multiplication',
    title: 'Numbers Near 100 Multiplication',
    subtitle: 'Nikhilam Navatashcaramam Dashatah (All from 9 and last from 10)',
    description:
      'Multiply two numbers close to 100 (e.g. 96 × 94 or 104 × 107) using cross-subtraction and deficiency products.',
    defaultNum1: 97,
    defaultNum2: 94,
    rule: '(100 - d1) × (100 - d2) = (100 - d1 - d2) | (d1 × d2)',
    steps: [
      'Find deficiency from 100 for each number: d1 = 100 - num1, d2 = 100 - num2',
      'Left part: num1 - d2 (or num2 - d1)',
      'Right part: d1 × d2 (as two digits)',
    ],
    calculate: (n1: number, n2: number = 94) => {
      const d1 = 100 - n1;
      const d2 = 100 - n2;
      const left = n1 - d2;
      const right = d1 * d2;
      const result = n1 * n2;
      const rightStr = right < 10 ? `0${right}` : `${right}`;
      return {
        result,
        stepBreakdown: [
          `Numbers: ${n1} and ${n2}`,
          `Deficiency from 100: ${n1} is (${-d1}), ${n2} is (${-d2})`,
          `Cross-operation for left side: ${n1} - ${d2} = ${left}`,
          `Product of deficiencies for right side: (${-d1}) × (${-d2}) = ${rightStr}`,
          `Combine: ${left}${rightStr} = ${result}`,
        ],
      };
    },
  },
  {
    id: 'percentage-swap',
    title: 'Percentage Swap Shortcut',
    subtitle: 'x% of y = y% of x',
    description:
      'Percentages are reversible! Calculating 16% of 50 in your head is hard, but 50% of 16 is effortless (8)!',
    defaultNum1: 18,
    defaultNum2: 50,
    rule: 'x% of y = (x × y) / 100 = y% of x',
    steps: [
      'Notice if x or y is a friendly number (e.g., 25, 50, 75, 20)',
      'Swap the percentage sign: x% of y becomes y% of x',
      'Compute the friendly fraction instantly (e.g. 50% = 1/2, 25% = 1/4)',
    ],
    calculate: (n1: number, n2: number = 50) => {
      const result = (n1 * n2) / 100;
      return {
        result,
        stepBreakdown: [
          `Original problem: Find ${n1}% of ${n2}`,
          `Applying the Swap Law: ${n1}% of ${n2} = ${n2}% of ${n1}`,
          `Since ${n2}% is equal to ${n2}/100 = ${(n2 / 100).toFixed(2)}, calculate ${(n2 / 100).toFixed(2)} × ${n1}`,
          `Result: ${result}`,
        ],
      };
    },
  },
  {
    id: 'tens-same-units-ten',
    title: 'Same Tens & Units Sum to 10',
    subtitle: 'e.g. 43 × 47 or 64 × 66 in 1 second',
    sanskritName: 'Antyayordashake pi',
    description:
      'When tens digits are identical and unit digits add up to 10: Left part is tens × (tens + 1), Right part is unit1 × unit2.',
    defaultNum1: 43,
    defaultNum2: 47,
    rule: 'n(a) × n(b) where a + b = 10 -> [n × (n+1)] | [a × b]',
    steps: [
      'Check if units add to 10 (3 + 7 = 10)',
      'Left part: tens × (tens + 1)',
      'Right part: unit1 × unit2 (two digits)',
    ],
    calculate: (n1: number, n2: number = 47) => {
      const tens = Math.floor(n1 / 10);
      const u1 = n1 % 10;
      const u2 = n2 % 10;
      const left = tens * (tens + 1);
      const right = u1 * u2;
      const rightStr = right < 10 ? `0${right}` : `${right}`;
      const result = n1 * n2;
      return {
        result,
        stepBreakdown: [
          `Numbers: ${n1} and ${n2}`,
          `Check condition: Units sum to 10? ${u1} + ${u2} = ${u1 + u2} ✓`,
          `Tens digit: ${tens}`,
          `Left part: ${tens} × (${tens} + 1) = ${left}`,
          `Right part: ${u1} × ${u2} = ${rightStr}`,
          `Final answer: ${left}${rightStr} = ${result}`,
        ],
      };
    },
  },
  {
    id: 'divisibility-inspector',
    title: 'Secret Divisibility Tricks (7, 11, 13)',
    subtitle: 'Lightning check without long division',
    description:
      'Rule for 7: Double last digit and subtract from rest. Rule for 11: Alternating sum of digits is multiple of 11. Rule for 13: Add 4 times last digit to rest.',
    defaultNum1: 343,
    rule: '7: (Rest - 2×Last) | 11: (OddSum - EvenSum) | 13: (Rest + 4×Last)',
    steps: [
      'Take the unit digit and truncate it from the rest of the number',
      'Apply multiplier for target divisor',
      'If intermediate number is divisible, original number is divisible!',
    ],
    calculate: (n1: number) => {
      const last = n1 % 10;
      const rest = Math.floor(n1 / 10);
      const rule7 = rest - 2 * last;
      const isDiv7 = n1 % 7 === 0;
      const isDiv11 = n1 % 11 === 0;
      const isDiv13 = n1 % 13 === 0;
      return {
        result: isDiv7 ? 7 : isDiv11 ? 11 : isDiv13 ? 13 : 0,
        stepBreakdown: [
          `Checking ${n1}:`,
          `Truncate: Rest = ${rest}, Last digit = ${last}`,
          `Rule for 7: ${rest} - (2 × ${last}) = ${rule7}. Divisible by 7? ${isDiv7 ? 'YES!' : 'No'}`,
          `Rule for 11: Alternating digit sum -> Divisible by 11? ${isDiv11 ? 'YES!' : 'No'}`,
          `Rule for 13: ${rest} + (4 × ${last}) = ${rest + 4 * last}. Divisible by 13? ${isDiv13 ? 'YES!' : 'No'}`,
        ],
      };
    },
  },
];
