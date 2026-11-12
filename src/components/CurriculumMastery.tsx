import React, { useState } from 'react';
import { sound } from '../utils/audio';
import {
  BookOpen,
  Compass,
  Layers,
  Sparkles,
  Calculator,
  PieChart,
  Box,
  CheckCircle2,
} from 'lucide-react';

interface CurriculumMasteryProps {
  onEarnXp: (amount: number) => void;
}

export const CurriculumMastery: React.FC<CurriculumMasteryProps> = ({ onEarnXp }) => {
  const [activeModule, setActiveModule] = useState<'trig' | 'quadratic' | 'hcflcm' | 'geometry'>(
    'trig'
  );

  // Trig state
  const [trigAngle, setTrigAngle] = useState<number>(30);

  // Quadratic state
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  // HCF/LCM state
  const [numA, setNumA] = useState<number>(48);
  const [numB, setNumB] = useState<number>(18);

  // Geometry state
  const [shape, setShape] = useState<'cylinder' | 'cone' | 'sphere'>('cone');
  const [geoRadius, setGeoRadius] = useState<number>(7);
  const [geoHeight, setGeoHeight] = useState<number>(24);

  // Trig Values lookup
  const trigValues: Record<
    number,
    { sin: string; cos: string; tan: string; cosec: string; sec: string; cot: string }
  > = {
    0: { sin: '0', cos: '1', tan: '0', cosec: 'Not defined', sec: '1', cot: 'Not defined' },
    30: {
      sin: '1/2',
      cos: '√3/2',
      tan: '1/√3',
      cosec: '2',
      sec: '2/√3',
      cot: '√3',
    },
    45: {
      sin: '1/√2',
      cos: '1/√2',
      tan: '1',
      cosec: '√2',
      sec: '√2',
      cot: '1',
    },
    60: {
      sin: '√3/2',
      cos: '1/2',
      tan: '√3',
      cosec: '2/√3',
      sec: '2',
      cot: '1/√3',
    },
    90: { sin: '1', cos: '0', tan: 'Not defined', cosec: '1', sec: 'Not defined', cot: '0' },
  };

  // Quadratic Calculation
  const disc = quadB * quadB - 4 * quadA * quadC;
  let root1 = '';
  let root2 = '';
  let natureOfRoots = '';
  if (quadA !== 0) {
    if (disc > 0) {
      natureOfRoots = 'Two distinct real roots (D > 0)';
      const r1 = (-quadB + Math.sqrt(disc)) / (2 * quadA);
      const r2 = (-quadB - Math.sqrt(disc)) / (2 * quadA);
      root1 = Number.isInteger(r1) ? `${r1}` : r1.toFixed(3);
      root2 = Number.isInteger(r2) ? `${r2}` : r2.toFixed(3);
    } else if (disc === 0) {
      natureOfRoots = 'Two equal real roots (D = 0)';
      const r = -quadB / (2 * quadA);
      root1 = root2 = Number.isInteger(r) ? `${r}` : r.toFixed(3);
    } else {
      natureOfRoots = 'No real roots (Complex conjugate roots, D < 0)';
      const real = -quadB / (2 * quadA);
      const imag = Math.sqrt(-disc) / (2 * quadA);
      root1 = `${real.toFixed(2)} + ${imag.toFixed(2)}i`;
      root2 = `${real.toFixed(2)} - ${imag.toFixed(2)}i`;
    }
  }

  // HCF / LCM calculation using Euclidean algorithm
  const getEuclideanSteps = (a: number, b: number) => {
    let x = Math.max(a, b);
    let y = Math.min(a, b);
    const steps: { a: number; b: number; q: number; r: number }[] = [];
    while (y !== 0) {
      const q = Math.floor(x / y);
      const r = x % y;
      steps.push({ a: x, b: y, q, r });
      x = y;
      y = r;
    }
    const hcf = x;
    const lcm = (a * b) / (hcf || 1);
    return { hcf, lcm, steps };
  };

  const euclidean = getEuclideanSteps(numA, numB);

  // Geometry calculation
  const PI = Math.PI;
  let csa = 0;
  let tsa = 0;
  let vol = 0;
  let slantHeight = 0;

  if (shape === 'cylinder') {
    csa = 2 * PI * geoRadius * geoHeight;
    tsa = 2 * PI * geoRadius * (geoRadius + geoHeight);
    vol = PI * geoRadius * geoRadius * geoHeight;
  } else if (shape === 'cone') {
    slantHeight = Math.sqrt(geoRadius * geoRadius + geoHeight * geoHeight);
    csa = PI * geoRadius * slantHeight;
    tsa = PI * geoRadius * (geoRadius + slantHeight);
    vol = (1 / 3) * PI * geoRadius * geoRadius * geoHeight;
  } else {
    csa = 4 * PI * geoRadius * geoRadius;
    tsa = 4 * PI * geoRadius * geoRadius;
    vol = (4 / 3) * PI * Math.pow(geoRadius, 3);
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" /> Curriculum Mastery Hub
            </span>
            <span className="text-xs text-slate-400">DAV / NCERT / CBSE Class 6–10</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Concept Visualizers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Interactive mathematical sandboxes for Trigonometry, Quadratic Equations, Euclidean HCF/LCM, and 3D Mensuration.
          </p>
        </div>
      </div>

      {/* Module Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'trig', label: 'Trigonometry Table', icon: Compass },
          { id: 'quadratic', label: 'Quadratic Solver', icon: Calculator },
          { id: 'hcflcm', label: 'HCF & LCM Euclidean', icon: Layers },
          { id: 'geometry', label: '3D Mensuration', icon: Box },
        ].map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                sound.playTick();
                setActiveModule(m.id as any);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <div className="text-xs sm:text-sm font-bold">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* 1. TRIGONOMETRY MODULE */}
      {activeModule === 'trig' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white">
                Trigonometric Ratios Angle Explorer (0° - 90°)
              </h3>
              <p className="text-xs text-slate-300">
                Click any standard angle to view exact radical values and the 5-finger trick.
              </p>
            </div>
            {/* Angle buttons */}
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              {[0, 30, 45, 60, 90].map((deg) => (
                <button
                  key={deg}
                  onClick={() => {
                    sound.playTick();
                    setTrigAngle(deg);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    trigAngle === deg
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Values Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { ratio: 'sin θ', val: trigValues[trigAngle].sin, color: 'text-indigo-400' },
              { ratio: 'cos θ', val: trigValues[trigAngle].cos, color: 'text-violet-400' },
              { ratio: 'tan θ', val: trigValues[trigAngle].tan, color: 'text-emerald-400' },
              { ratio: 'cosec θ', val: trigValues[trigAngle].cosec, color: 'text-pink-400' },
              { ratio: 'sec θ', val: trigValues[trigAngle].sec, color: 'text-amber-400' },
              { ratio: 'cot θ', val: trigValues[trigAngle].cot, color: 'text-cyan-400' },
            ].map((item) => (
              <div
                key={item.ratio}
                className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 text-center"
              >
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  {item.ratio.replace('θ', `${trigAngle}°`)}
                </span>
                <span className={`text-xl sm:text-2xl font-mono font-black ${item.color}`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          {/* Left Hand Trick Explainer */}
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-indigo-500/20 space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              The Famous Left-Hand Trick (Satyam Sir's Tip):
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Place your left palm facing you. Assign Thumb = 0°, Index = 30°, Middle = 45°, Ring = 60°, Pinky = 90°.
              <br />
              <strong className="text-white">sin(θ) = √(Fingers Below) / 2</strong> &nbsp;|&nbsp;{' '}
              <strong className="text-white">cos(θ) = √(Fingers Above) / 2</strong>.
              <br />
              For example at 30° (Index finger): Below = 1 finger (Thumb) → sin(30°) = √1 / 2 = 1/2!
            </p>
          </div>
        </div>
      )}

      {/* 2. QUADRATIC EQUATION SOLVER */}
      {activeModule === 'quadratic' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-white">
              Quadratic Equation &amp; Discriminant (ax² + bx + c = 0)
            </h3>
            <p className="text-xs text-slate-300">
              Instantly compute discriminant D = b² - 4ac, test nature of roots, and solve.
            </p>
          </div>

          {/* Coefficients Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Coefficient a (x²)
              </label>
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Coefficient b (x)
              </label>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Constant c
              </label>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Current Equation Display */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center font-mono text-xl sm:text-2xl font-black text-white">
            {quadA}x² {quadB >= 0 ? `+ ${quadB}` : `- ${Math.abs(quadB)}`}x{' '}
            {quadC >= 0 ? `+ ${quadC}` : `- ${Math.abs(quadC)}`} = 0
          </div>

          {/* Discriminant and Roots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Discriminant Analysis
              </span>
              <div className="text-2xl font-mono font-black text-amber-300">
                D = {disc}
              </div>
              <p className="text-xs text-slate-300 font-mono mt-2">
                D = ({quadB})² - 4({quadA})({quadC}) = {quadB * quadB} - {4 * quadA * quadC} = {disc}
              </p>
              <div className="text-xs font-semibold text-emerald-400 mt-2">
                Nature: {natureOfRoots}
              </div>
            </div>

            <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Calculated Roots
              </span>
              <div className="text-2xl font-mono font-black text-emerald-400">
                x₁ = {root1}
              </div>
              <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
                x₂ = {root2}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Formula: x = [-b ± √(b² - 4ac)] / (2a)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. EUCLIDEAN HCF / LCM */}
      {activeModule === 'hcflcm' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-white">
              Euclid's Division Algorithm: HCF &amp; LCM Finder
            </h3>
            <p className="text-xs text-slate-300">
              Fundamental Theorem of Arithmetic: a = bq + r (0 ≤ r &lt; b).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Number 1 (a)</label>
              <input
                type="number"
                value={numA}
                onChange={(e) => setNumA(Math.abs(parseInt(e.target.value, 10)) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Number 2 (b)</label>
              <input
                type="number"
                value={numB}
                onChange={(e) => setNumB(Math.abs(parseInt(e.target.value, 10)) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center">
              <span className="text-xs uppercase font-bold text-indigo-300">
                Highest Common Factor (HCF)
              </span>
              <div className="text-3xl font-mono font-black text-white mt-1">
                {euclidean.hcf}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-center">
              <span className="text-xs uppercase font-bold text-purple-300">
                Lowest Common Multiple (LCM)
              </span>
              <div className="text-3xl font-mono font-black text-white mt-1">
                {euclidean.lcm}
              </div>
            </div>
          </div>

          {/* Step-by-Step Division Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Euclid Division Lemma Steps (Dividend = Divisor × Quotient + Remainder):
            </h4>
            <div className="space-y-2 font-mono text-xs">
              {euclidean.steps.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200"
                >
                  <span>Step {idx + 1}:</span>
                  <span className="font-bold">
                    {s.a} = {s.b} × {s.q} + <span className="text-amber-300">{s.r}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {s.r === 0 ? 'Remainder 0 reached!' : `r = ${s.r} ≠ 0`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 3D MENSURATION */}
      {activeModule === 'geometry' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white">
                3D Mensuration &amp; Surface Area Visualizer
              </h3>
              <p className="text-xs text-slate-300">
                Class 9 &amp; 10 formulas: CSA, TSA, and Volume of Solids.
              </p>
            </div>
            {/* Shape toggle */}
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              {[
                { id: 'cone', label: 'Right Circular Cone' },
                { id: 'cylinder', label: 'Cylinder' },
                { id: 'sphere', label: 'Sphere' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playTick();
                    setShape(s.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    shape === s.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders for Radius and Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-700/60">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Radius (r): <span className="text-indigo-400 font-mono text-sm">{geoRadius} cm</span>
              </label>
              <input
                type="range"
                min={1}
                max={35}
                value={geoRadius}
                onChange={(e) => setGeoRadius(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
            {shape !== 'sphere' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Height (h): <span className="text-purple-400 font-mono text-sm">{geoHeight} cm</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={geoHeight}
                  onChange={(e) => setGeoHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Calculations Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Curved Surface Area (CSA)
              </span>
              <div className="text-2xl font-mono font-black text-amber-300">
                {csa.toFixed(1)} cm²
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {shape === 'cone' ? 'Formula: π·r·l' : shape === 'cylinder' ? 'Formula: 2·π·r·h' : 'Formula: 4·π·r²'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Total Surface Area (TSA)
              </span>
              <div className="text-2xl font-mono font-black text-indigo-300">
                {tsa.toFixed(1)} cm²
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {shape === 'cone' ? 'Formula: π·r·(l + r)' : shape === 'cylinder' ? 'Formula: 2·π·r·(h + r)' : 'Formula: 4·π·r²'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Volume (V)
              </span>
              <div className="text-2xl font-mono font-black text-emerald-400">
                {vol.toFixed(1)} cm³
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {shape === 'cone' ? 'Formula: ⅓·π·r²·h' : shape === 'cylinder' ? 'Formula: π·r²·h' : 'Formula: ⁴⁄₃·π·r³'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
