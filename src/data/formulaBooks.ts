import { FormulaBook } from '../types';

export const FORMULA_BOOKS: FormulaBook[] = [
  {
    id: 'book-trigonometry',
    title: 'Trigonometry & Heights',
    domain: 'Geometry & Angles',
    classLevel: 'Class IX - XII',
    coverGradient: 'from-red-600 via-rose-700 to-amber-900',
    chainLength: 120,
    accentColor: '#EF4444',
    summary:
      'Master the foundational ratios, reciprocal identities, Pythagorean formulations, and real-world elevation angles without memorization.',
    formulas: [
      {
        name: 'Fundamental Pythagorean Identity',
        formula: 'sin²θ + cos²θ = 1',
        explanation: 'Direct algebraic result of dividing Pythagoras theorem (a² + b² = c²) by hypotenuse squared.',
        example: 'If sin θ = 3/5, then cos θ = √(1 - 9/25) = 4/5.',
      },
      {
        name: 'Secant-Tangent Identity',
        formula: '1 + tan²θ = sec²θ',
        explanation: 'Obtained by dividing sin²θ + cos²θ = 1 by cos²θ.',
        example: 'sec²θ - tan²θ = 1, so (secθ - tanθ)(secθ + tanθ) = 1.',
      },
      {
        name: 'Cotangent-Cosecant Identity',
        formula: '1 + cot²θ = cosec²θ',
        explanation: 'Obtained by dividing fundamental identity by sin²θ.',
        example: 'cosec²θ - cot²θ = 1.',
      },
      {
        name: 'Satyam Sir’s Height & Distance Ratio',
        formula: 'h = d · tan(θ)',
        explanation: 'Relates building height (h) to horizontal distance from observer (d) and elevation angle (θ).',
        example: 'At 30m away with 45° elevation: h = 30 · tan(45°) = 30m.',
      },
    ],
    keyDerivations: [
      'Proof of sin²θ + cos²θ = 1 from right-angled ΔABC',
      'Proof of standard angles (0°, 30°, 45°, 60°, 90°) from geometric figures',
      'Derivation of complementary angle relationships: sin(90° - A) = cos A',
    ],
  },
  {
    id: 'book-quadratic',
    title: 'Quadratic & Polynomials',
    domain: 'Algebra & Functions',
    classLevel: 'Class IX - XI',
    coverGradient: 'from-amber-600 via-orange-700 to-red-950',
    chainLength: 145,
    accentColor: '#F59E0B',
    summary:
      'Explore second-degree equations, discriminant analysis for nature of roots, parabolic trajectory graphs, and Sridharacharya derivations.',
    formulas: [
      {
        name: 'Quadratic Formula (Sridharacharya)',
        formula: 'x = [-b ± √(b² - 4ac)] / (2a)',
        explanation: 'Yields the roots of any quadratic equation ax² + bx + c = 0.',
        example: 'For 2x² - 7x + 3 = 0: a=2, b=-7, c=3 -> roots are 3 and 1/2.',
      },
      {
        name: 'Discriminant & Nature of Roots',
        formula: 'D = b² - 4ac',
        explanation: 'Determines whether roots are real and distinct (D > 0), real and equal (D = 0), or non-real (D < 0).',
        example: 'If D = 0, the parabola touches the x-axis at exactly one point.',
      },
      {
        name: 'Relations Between Roots and Coefficients',
        formula: 'α + β = -b/a,  α · β = c/a',
        explanation: 'Allows building quadratic equations directly: x² - (Sum)x + (Product) = 0.',
        example: 'Roots 3 and 5 -> Equation is x² - 8x + 15 = 0.',
      },
    ],
    keyDerivations: [
      'Step-by-step derivation of x = (-b ± √D) / 2a by Completing the Square',
      'Factoring quadratic polynomials using geometric area decomposition',
      'Proof of the Maximum/Minimum vertex point of a parabola at x = -b / (2a)',
    ],
  },
  {
    id: 'book-calculus',
    title: 'Differential & Integral Calculus',
    domain: 'Higher Mathematics',
    classLevel: 'Class XI - XII',
    coverGradient: 'from-red-800 via-rose-900 to-slate-950',
    chainLength: 110,
    accentColor: '#DC2626',
    summary:
      'Understand limits as infinitesimal approximations, derivatives as instantaneous slopes, and integrals as smooth area accumulation.',
    formulas: [
      {
        name: 'First Principles of Differentiation',
        formula: "f'(x) = lim_{h->0} [f(x+h) - f(x)] / h",
        explanation: 'Defines the instantaneous rate of change of f(x) with respect to x.',
        example: 'd/dx (x²) = lim [x² + 2xh + h² - x²]/h = 2x.',
      },
      {
        name: 'Product & Quotient Differentiation Rules',
        formula: '(u·v)\' = u\'v + uv\',   (u/v)\' = (u\'v - uv\') / v²',
        explanation: 'Essential rules for differentiating composites of standard algebraic and trigonometric functions.',
        example: 'd/dx (x · sin x) = sin x + x · cos x.',
      },
      {
        name: 'Fundamental Theorem of Calculus',
        formula: '∫_a^b f(x) dx = F(b) - F(a)',
        explanation: 'Connects differentiation and integration, evaluating definite integrals via antiderivative F(x).',
        example: 'Area under y = 2x from 0 to 4: [x²]_0^4 = 16.',
      },
    ],
    keyDerivations: [
      'Derivation of derivative of sin(x) from first principles using trigonometric limits',
      'Chain Rule intuition using nested rates of change',
      'Integration by parts derivation from the product rule of differentiation',
    ],
  },
  {
    id: 'book-coordinate',
    title: 'Coordinate Geometry & Straight Lines',
    domain: 'Analytical Geometry',
    classLevel: 'Class IX - XI',
    coverGradient: 'from-amber-700 via-red-700 to-slate-900',
    chainLength: 135,
    accentColor: '#F59E0B',
    summary:
      'Cartesian coordinate planes, section formula for internal divisions, centroid coordinates, and slope-intercept linear equations.',
    formulas: [
      {
        name: 'Distance Formula',
        formula: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]',
        explanation: 'Applies Pythagoras theorem directly on orthogonal coordinates (Δx and Δy).',
        example: 'Distance between (1, 2) and (4, 6) is √(9 + 16) = 5.',
      },
      {
        name: 'Section Formula (Internal Division)',
        formula: 'P(x, y) = [(m₁x₂ + m₂x₁) / (m₁ + m₂), (m₁y₂ + m₂y₁) / (m₁ + m₂)]',
        explanation: 'Coordinates of point P dividing line segment AB in ratio m₁ : m₂.',
        example: 'Midpoint is the special case when m₁ = m₂ = 1.',
      },
      {
        name: 'Slope-Intercept Form of a Line',
        formula: 'y = mx + c  (where m = tan θ)',
        explanation: 'Represents a straight line with slope m and y-intercept c.',
        example: 'Line at 45° crossing y-axis at (0, 3): y = x + 3.',
      },
    ],
    keyDerivations: [
      'Proof of the Distance Formula from right triangle in Cartesian plane',
      'Derivation of Section Formula using similar triangles',
      'Area of a triangle with vertices (x₁, y₁), (x₂, y₂), (x₃, y₃)',
    ],
  },
  {
    id: 'book-number-theory',
    title: 'Number Systems & Real Numbers',
    domain: 'Number Theory',
    classLevel: 'Class VI - X',
    coverGradient: 'from-crimson via-red-900 to-black',
    chainLength: 125,
    accentColor: '#EF4444',
    summary:
      'Euclid’s Division Lemma, Fundamental Theorem of Arithmetic, irrationality proofs, prime factorization, and HCF/LCM relations.',
    formulas: [
      {
        name: 'Euclid’s Division Lemma',
        formula: 'a = b·q + r   (where 0 ≤ r < b)',
        explanation: 'Given positive integers a and b, there exist unique integers q and r satisfying this relation.',
        example: '45 = 6·7 + 3 (Dividend = Divisor × Quotient + Remainder).',
      },
      {
        name: 'HCF and LCM Product Relationship',
        formula: 'HCF(a, b) × LCM(a, b) = a × b',
        explanation: 'The product of two positive integers equals the product of their HCF and LCM.',
        example: 'For 12 and 18: HCF is 6, LCM is 36. 6 × 36 = 216 = 12 × 18.',
      },
      {
        name: 'Terminating Decimal Condition',
        formula: 'q = 2^n · 5^m   (n, m ≥ 0)',
        explanation: 'A rational number p/q has a terminating decimal expansion iff prime factorization of q has only 2s and 5s.',
        example: '7/80 = 7 / (2⁴ · 5¹) terminates; 1/3 does not terminate.',
      },
    ],
    keyDerivations: [
      'Contradiction proof that √2, √3, √5 are irrational numbers',
      'Proof of Euclid’s algorithm for finding highest common factor',
      'Fundamental Theorem of Arithmetic uniqueness proof',
    ],
  },
  {
    id: 'book-probability',
    title: 'Probability & Statistics',
    domain: 'Data Science & Chance',
    classLevel: 'Class IX - XII',
    coverGradient: 'from-amber-500 via-rose-700 to-slate-900',
    chainLength: 150,
    accentColor: '#F59E0B',
    summary:
      'Theoretical probability, sample spaces, mean/median/mode empirical relationships, conditional probability, and Bayes theorem.',
    formulas: [
      {
        name: 'Classical Probability Formula',
        formula: 'P(E) = Number of Favorable Outcomes / Total Outcomes',
        explanation: '0 ≤ P(E) ≤ 1 for any event E. P(Sure Event) = 1, P(Impossible Event) = 0.',
        example: 'Probability of rolling a prime (2,3,5) on a 6-sided die: 3/6 = 1/2.',
      },
      {
        name: 'Empirical Relationship of Central Tendency',
        formula: '3 · Median = Mode + 2 · Mean',
        explanation: 'Satyam Sir’s memorable rule: "3 Medians minus 2 Means equals Mode".',
        example: 'If Mean = 20 and Median = 22: Mode = 3(22) - 2(20) = 66 - 40 = 26.',
      },
      {
        name: 'Complementary Probability',
        formula: 'P(E) + P(not E) = 1',
        explanation: 'The sum of probabilities of all elementary events in an experiment is 1.',
        example: 'If chance of rain is 0.7, chance of no rain is 1 - 0.7 = 0.3.',
      },
    ],
    keyDerivations: [
      'Step-by-step derivation of Assumed Mean & Step-Deviation methods',
      'Derivation of Median formula for grouped data from ogives',
      'Bayes’ theorem derivation from conditional probability P(A|B) = P(A ∩ B) / P(B)',
    ],
  },
];
