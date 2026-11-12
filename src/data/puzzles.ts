import { BrainTeaser } from '../types/math';

export const BRAIN_TEASERS: BrainTeaser[] = [
  {
    id: 'matchstick-6-plus-4-equals-4',
    title: 'Matchstick Riddle: 6 + 4 = 4',
    difficulty: 'Medium',
    type: 'matchstick',
    description:
      'Look at the matchstick equation: 6 + 4 = 4. Move exactly ONE matchstick to make the mathematical equation true!',
    initialEquation: '6 + 4 = 4',
    correctEquation: '0 + 4 = 4  (or  5 + 4 = 9,  or  8 - 4 = 4)',
    hint: 'Look closely at the digit 6 or the plus sign (+). Can you remove a stick from 6 to turn it into a 0 or 5?',
    solution:
      'Solution 1: Take the middle horizontal matchstick from 6 and make it 0. Now: 0 + 4 = 4 (Correct!).\nSolution 2: Move the vertical stick from (+) to make (-), and place it on the 6 to make 8: 8 - 4 = 4 (Correct!).\nSolution 3: Move the vertical stick from (+) to the right-hand 4 to make 9: 5 + 4 = 9 (Correct!).',
  },
  {
    id: 'missing-number-triangle',
    title: 'The Number Triangle Mystery',
    difficulty: 'Easy',
    type: 'grid',
    description:
      'In a triangle, vertices are labelled: Top = 12, Bottom-Left = 4, Bottom-Right = 3. Center = 36.\nSecond triangle: Top = 15, Bottom-Left = 5, Bottom-Right = 3. Center = 45.\nThird triangle: Top = 20, Bottom-Left = 4, Bottom-Right = 7. Center = ?',
    hint: 'Find the relationship between the top number, bottom numbers, and the center.',
    solution:
      'Look at Triangle 1: (12 / 4) × 3 = 3 × 3 = 9... Wait! Notice: Top × Bottom-Right / Bottom-Left? Or (12 / 4) × 12 = 36! Check Triangle 2: (15 / 5) × 15 = 3 × 15 = 45! So Triangle 3: (20 / 4) × 20 = 5 × 20 = 100 (or if using Bottom-Right: (Top / Left) × Right: (12/4) × 3 = 9? No: Center is (Top / Bottom-Left) × Bottom-Right × 4? In our triangle: (20 / 4) × 7 = 35! So the answer is 35!',
  },
  {
    id: 'consecutive-sum-100',
    title: 'Consecutive Numbers that Sum to 100',
    difficulty: 'Hard',
    type: 'logic',
    description:
      'Can you express 100 as the sum of consecutive positive integers? (e.g. n + (n+1) + ... = 100). Find all such series!',
    hint: 'Use the arithmetic progression formula: Sum = k/2 × (2a + k - 1) = 100, so k × (2a + k - 1) = 200. Check the divisors of 200.',
    solution:
      'Only odd divisors of 200 yield positive integer solutions! The odd divisors of 200 are 1, 5, 25. For k=5: 18 + 19 + 20 + 21 + 22 = 100! (5 consecutive numbers starting from 18). Also for k=8: 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16 = 100! (8 consecutive numbers).',
  },
  {
    id: 'clock-angle-puzzle',
    title: 'The Exact Clock Angle at 3:15',
    difficulty: 'Medium',
    type: 'logic',
    description:
      'What is the angle between the hour hand and the minute hand of a clock at 3:15? (Warning: It is NOT 0 degrees!)',
    hint: 'Remember: as the minute hand moves 15 minutes (a quarter of the circle), the hour hand also moves a quarter of the way between 3 and 4!',
    solution:
      'The dial has 360 degrees, with 30 degrees per hour (360° / 12 = 30°). At 3:15, the minute hand points directly at the 3 (90°). But the hour hand has moved for 15 minutes! The hour hand moves at 0.5° per minute (30° / 60 min). In 15 minutes, the hour hand has moved: 15 × 0.5° = 7.5° past the 3! Therefore, the angle between the two hands is exactly 7.5°!',
  },
];
