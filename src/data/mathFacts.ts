import { MathFact } from '../types/math';

export const MATH_FACTS: MathFact[] = [
  {
    id: 'kaprekar-6174',
    title: "Kaprekar's Magic Constant",
    tagline: 'Take any 4-digit number. In at most 7 steps, you always reach 6174!',
    highlightNumber: '6174',
    category: 'Number Theory',
    summary:
      "Discovered in 1949 by Indian mathematician D.R. Kaprekar. Arrange digits in descending order, then ascending order, and subtract. Repeat the process. Within 7 steps, any non-repdigit 4-digit number ends at 6174, where it loops forever (7641 - 1467 = 6174)!",
    deepExplanation:
      "This routine is known as Kaprekar's transformation. For example, start with 3524: Descending: 5432, Ascending: 2345. Difference: 3087. Next: 8730 - 0378 = 8352. Next: 8532 - 2358 = 6174! Once you reach 6174, 7641 - 1467 = 6174, an irreducible mathematical black hole.",
    interactiveType: 'kaprekar',
  },
  {
    id: 'ramanujan-1729',
    title: "The Hardy-Ramanujan Taxicab Number",
    tagline: 'The smallest number expressible as the sum of two cubes in two different ways!',
    highlightNumber: '1729',
    category: 'History',
    summary:
      "When G.H. Hardy visited Srinivasa Ramanujan in hospital, he remarked that taxi number 1729 seemed quite dull. Ramanujan immediately replied: 'No, it is a very interesting number; it is the smallest number expressible as the sum of two cubes in two different ways!' (1³ + 12³ = 9³ + 10³ = 1729).",
    deepExplanation:
      "1³ = 1, 12³ = 1728, so 1 + 1728 = 1729. Also, 9³ = 729, 10³ = 1000, so 729 + 1000 = 1729. It is also an Harshad number (divisible by the sum of its digits: 1+7+2+9 = 19, and 1729 / 19 = 91).",
    interactiveType: 'ramanujan',
  },
  {
    id: 'magic-of-nine',
    title: 'The Unstoppable Magic of 9',
    tagline: 'Sum of digits of any multiple of 9 always adds up to 9 (or another multiple of 9)!',
    highlightNumber: '9',
    category: 'Vedic',
    summary:
      "Multiply 9 by any single-digit number, and the digits of the product will always sum to 9 (e.g. 9×8=72 -> 7+2=9). Even more magical: take ANY number, subtract the sum of its digits, and the result is ALWAYS divisible by 9!",
    deepExplanation:
      "In base 10, every power of 10 leaves remainder 1 when divided by 9: 10 = 9 + 1, 100 = 99 + 1, 1000 = 999 + 1. Thus any integer N modulo 9 is identical to the sum of its decimal digits! This forms the basis of Vedic 'Navasesh' (casting out nines) used for instant calculation verification.",
    interactiveType: 'nines',
  },
  {
    id: 'golden-ratio-phi',
    title: 'Phi (Φ) & The Fibonacci Spiral',
    tagline: 'The divine proportion 1.618033... governing galaxies, sunflowers, and architecture.',
    highlightNumber: '1.618...',
    category: 'Geometry',
    summary:
      "In the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...), the ratio of consecutive terms converges directly to the Golden Ratio Phi: Φ = (1 + √5)/2 ≈ 1.61803398875.",
    deepExplanation:
      "Phi is the most irrational number in mathematics (its continued fraction is [1; 1, 1, 1, ...]). Because it resists rational approximation, plants pack seeds with maximum efficiency (like sunflower spirals and pinecone scales) by using angles derived from 360° / Φ² ≈ 137.5° (the Golden Angle).",
    interactiveType: 'fibonacci',
  },
  {
    id: 'eulers-identity',
    title: "Euler's Identity: The Most Beautiful Equation",
    tagline: 'e^(i·π) + 1 = 0 unites the 5 greatest constants of mathematics.',
    highlightNumber: 'e^(iπ)+1=0',
    category: 'Curiosity',
    summary:
      "Discovered by Leonhard Euler, this single equation connects e (base of natural log), i (imaginary unit √-1), π (ratio of circumference to diameter), 1 (multiplicative identity), and 0 (additive identity).",
    deepExplanation:
      "Derived from Euler's formula e^(iθ) = cos(θ) + i·sin(θ). When θ = π radians (180°), cos(π) = -1 and sin(π) = 0. Substituting gives e^(iπ) = -1, which rearranges to e^(iπ) + 1 = 0. Feynman called it 'our jewel'.",
    interactiveType: 'general',
  },
  {
    id: 'birthday-paradox',
    title: 'The Birthday Paradox',
    tagline: 'In a room of just 23 people, there is a >50% chance two share the exact same birthday!',
    highlightNumber: '23',
    category: 'Number Theory',
    summary:
      "While it intuitively feels like you need ~183 people (half of 365) to have a 50% chance, probability looks at pairs! In 23 people, there are 23 × 22 / 2 = 253 distinct pairs.",
    deepExplanation:
      "The probability that NO two people share a birthday is (365/365) × (364/365) × ... × (343/365) ≈ 0.4927. Therefore, the chance of at least one shared birthday is 1 - 0.4927 = 50.73%! By 70 people, the chance exceeds 99.9%.",
    interactiveType: 'general',
  },
];
