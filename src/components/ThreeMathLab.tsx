import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Box,
  RotateCw,
  Eye,
  Layers,
  Sparkles,
  Compass,
  Maximize2,
  BookOpen,
  Info,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

type SolidType =
  | 'icosahedron'
  | 'dodecahedron'
  | 'octahedron'
  | 'torusknot'
  | 'tetrahedron'
  | 'cylinder';

interface SolidDetails {
  id: SolidType;
  name: string;
  category: string;
  gradeLevels: string;
  vertices: number;
  edges: number;
  faces: number;
  eulerFormula: string;
  surfaceAreaFormula: string;
  volumeFormula: string;
  description: string;
  curriculumTopic: string;
  concepts: string[];
}

const SOLIDS_DATA: Record<SolidType, SolidDetails> = {
  icosahedron: {
    id: 'icosahedron',
    name: 'Regular Icosahedron',
    category: 'Platonic Solid (20-Faced)',
    gradeLevels: 'Classes IX - XII & Olympiad',
    vertices: 12,
    edges: 30,
    faces: 20,
    eulerFormula: '12 - 30 + 20 = 2 (Verified)',
    surfaceAreaFormula: 'A = 5√3 · a²',
    volumeFormula: 'V = (5/12)(3 + √5) · a³ ≈ 2.1817 · a³',
    description:
      'Formed by 20 equilateral triangular faces with 5 triangles meeting at each vertex. Exhibiting icosahedral symmetry and golden ratio proportions (ϕ = (1+√5)/2).',
    curriculumTopic: 'Solid Geometry, Golden Ratio & 3D Spatial Symmetry',
    concepts: [
      'Euler Characteristic (V - E + F = 2)',
      'Equilateral triangular face geometry',
      'Golden Ratio (ϕ) coordinates: (0, ±1, ±ϕ)',
    ],
  },
  dodecahedron: {
    id: 'dodecahedron',
    name: 'Regular Dodecahedron',
    category: 'Platonic Solid (12-Faced)',
    gradeLevels: 'Classes IX - XII',
    vertices: 20,
    edges: 30,
    faces: 12,
    eulerFormula: '20 - 30 + 12 = 2 (Verified)',
    surfaceAreaFormula: 'A = 3√(25 + 10√5) · a²',
    volumeFormula: 'V = (1/4)(15 + 7√5) · a³ ≈ 7.663 · a³',
    description:
      'Dual solid to the icosahedron, composed of 12 regular pentagonal faces. Famous in Euclidean geometry (Book XIII) and Pythagorean mysticism.',
    curriculumTopic: 'Regular Polygons, Dihedral Angles & Duality',
    concepts: [
      'Dual solid of the icosahedron',
      'Pentagonal face internal angles: 108°',
      'Dihedral angle calculation: ~116.57°',
    ],
  },
  octahedron: {
    id: 'octahedron',
    name: 'Regular Octahedron',
    category: 'Platonic Solid (Dual of Cube)',
    gradeLevels: 'Classes VIII - X (CBSE / ICSE)',
    vertices: 6,
    edges: 12,
    faces: 8,
    eulerFormula: '6 - 12 + 8 = 2 (Verified)',
    surfaceAreaFormula: 'A = 2√3 · a²',
    volumeFormula: 'V = (√2 / 3) · a³ ≈ 0.4714 · a³',
    description:
      'Composed of 8 equilateral triangular faces meeting 4 at each vertex. Represents a double square pyramid joined at their common base.',
    curriculumTopic: 'Class X Coordinate Geometry & Mensuration',
    concepts: [
      'Double pyramid structure: V = 2 × (1/3 Base × Height)',
      'Dual of the 3D cube',
      'Cartesian coordinates: (±1, 0, 0), (0, ±1, 0), (0, 0, ±1)',
    ],
  },
  torusknot: {
    id: 'torusknot',
    name: 'Torus Knot (p=2, q=3)',
    category: 'Topological 3D Manifold',
    gradeLevels: 'Senior Secondary & Higher Maths',
    vertices: 120,
    edges: 240,
    faces: 120,
    eulerFormula: 'Curved Surface Topology (χ = 0)',
    surfaceAreaFormula: 'Parametric Arc Integral ∫ ||r\'(t)|| dt',
    volumeFormula: 'V = 2π² · R · r² (Torus envelope)',
    description:
      'A continuous trefoil curve winding p times around the rotational symmetry axis of a torus while threading through its hole q times.',
    curriculumTopic: 'Vector Calculus, Parametric Curves & Topology',
    concepts: [
      'Parametric equations in 3D cylindrical coordinates',
      'Curvature (κ) and Torsion (τ) along space curves',
      'Knot theory & fundamental group π₁(S³ \\ K)',
    ],
  },
  tetrahedron: {
    id: 'tetrahedron',
    name: 'Regular Tetrahedron',
    category: 'Platonic Simplex (3-Simplex)',
    gradeLevels: 'Classes VII - XII (CBSE / ICSE)',
    vertices: 4,
    edges: 6,
    faces: 4,
    eulerFormula: '4 - 6 + 4 = 2 (Verified)',
    surfaceAreaFormula: 'A = √3 · a²',
    volumeFormula: 'V = a³ / (6√2) ≈ 0.1179 · a³',
    description:
      'The simplest regular polyhedron, self-dual, bounded by 4 equilateral triangles. A foundational building block in 3D vector geometry and coordinate space.',
    curriculumTopic: '3D Vector Triple Products & Solid Mensuration',
    concepts: [
      'Self-dual Platonic solid',
      'Scalar triple product volume: V = (1/6) |a · (b × c)|',
      'Tetrahedral bond angle: cos⁻¹(-1/3) ≈ 109.47°',
    ],
  },
  cylinder: {
    id: 'cylinder',
    name: 'Solid of Revolution (Cylinder & Cone)',
    category: 'Calculus & Mensuration Solid',
    gradeLevels: 'Classes IX - X & XII (Board Exams)',
    vertices: 2,
    edges: 3,
    faces: 3,
    eulerFormula: 'Curved Surface Solid (Mensuration Core)',
    surfaceAreaFormula: 'Total SA = 2πr(r + h)',
    volumeFormula: 'V = πr²h  (Cone = 1/3 πr²h)',
    description:
      'Generated by rotating a rectangle or right triangle about an axis. Essential for CBSE/ICSE board exam problem sets on surface area and integral volume.',
    curriculumTopic: 'Class X Surface Areas & Volumes & Class XII Integrals',
    concepts: [
      'Disc integration method: V = π ∫ [f(x)]² dx',
      'Curved surface area derivation: 2πrh = Circumference × Height',
      'Ratio relationship: V_cone : V_sphere : V_cylinder = 1 : 2 : 3',
    ],
  },
};

export const ThreeMathLab: React.FC = () => {
  const [selectedSolid, setSelectedSolid] = useState<SolidType>('icosahedron');
  const [showWireframe, setShowWireframe] = useState(true);
  const [showSolid, setShowSolid] = useState(true);
  const [showVertices, setShowVertices] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const solidGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const solidData = SOLIDS_DATA[selectedSolid];

  // Set up Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const crimsonLight = new THREE.DirectionalLight(0xdc2626, 4.5);
    crimsonLight.position.set(5, 5, 4);
    scene.add(crimsonLight);

    const amberLight = new THREE.DirectionalLight(0xf59e0b, 3.5);
    amberLight.position.set(-5, -4, 4);
    scene.add(amberLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Group holding the current mathematical solid
    const solidGroup = new THREE.Group();
    scene.add(solidGroup);
    solidGroupRef.current = solidGroup;

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !solidGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      solidGroupRef.current.rotation.y += deltaX * 0.008;
      solidGroupRef.current.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !solidGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      solidGroupRef.current.rotation.y += deltaX * 0.008;
      solidGroupRef.current.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();

      if (autoRotate && solidGroupRef.current && !isDragging) {
        solidGroupRef.current.rotation.y += delta * 0.45 * rotationSpeed;
        solidGroupRef.current.rotation.x += delta * 0.25 * rotationSpeed;
      }

      renderer.render(scene, camera);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  // Update Mesh when solid or render modes change
  useEffect(() => {
    const group = solidGroupRef.current;
    if (!group) return;

    // Clear existing children
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    let geometry: THREE.BufferGeometry;

    switch (selectedSolid) {
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1.6, 0);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(1.5, 0);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1.7, 0);
        break;
      case 'torusknot':
        geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 120, 24, 2, 3);
        break;
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(1.8, 0);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.9, 0.9, 2.2, 32);
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(1.6, 0);
    }

    // 1. Translucent Obsidian Glass Material
    if (showSolid) {
      const solidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x121622,
        emissive: 0x991b1b,
        emissiveIntensity: 0.25,
        roughness: 0.15,
        metalness: 0.85,
        transparent: true,
        opacity: 0.85,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });
      const solidMesh = new THREE.Mesh(geometry, solidMaterial);
      group.add(solidMesh);
    }

    // 2. Wireframe / Edges
    if (showWireframe) {
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xef4444,
        linewidth: 2,
      });
      const wireframeLines = new THREE.LineSegments(edges, lineMaterial);
      group.add(wireframeLines);
    }

    // 3. Glowing Golden Vertices
    if (showVertices && selectedSolid !== 'torusknot') {
      const posAttr = geometry.attributes.position;
      const sphereGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const vertexMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });

      // Avoid duplicate vertex points
      const pointsSet = new Set<string>();
      const vertexGroup = new THREE.Group();

      for (let i = 0; i < posAttr.count; i++) {
        const x = Number(posAttr.getX(i).toFixed(3));
        const y = Number(posAttr.getY(i).toFixed(3));
        const z = Number(posAttr.getZ(i).toFixed(3));
        const key = `${x},${y},${z}`;

        if (!pointsSet.has(key)) {
          pointsSet.add(key);
          const sphere = new THREE.Mesh(sphereGeo, vertexMat);
          sphere.position.set(x, y, z);
          vertexGroup.add(sphere);
        }
      }
      group.add(vertexGroup);
    }
  }, [selectedSolid, showSolid, showWireframe, showVertices]);

  const handleSelectSolid = (id: SolidType) => {
    sound.playTick();
    setSelectedSolid(id);
  };

  const handleResetCamera = () => {
    sound.playTick();
    if (solidGroupRef.current) {
      solidGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5.5);
    }
  };

  return (
    <section
      id="3d-math-lab"
      className="py-20 lg:py-28 relative bg-[#F8F7F4] border-b-2 border-[#111113] overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12 space-y-4">
          <div className="label text-[11px] font-mono font-bold tracking-widest text-[#E63946] inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#111113] shadow-[2px_2px_0px_#111113]">
            <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
            <span>[ 3D MATHEMATICAL SOLID LABORATORY ]</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#111113] tracking-tighter leading-tight">
            Master 3D Solid Geometry &amp; Euler’s Formula in Real-Time
          </h2>

          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            At Maths Fact in Dhanbad, Satyam Sir teaches geometric visualization from first principles.
            Rotate Platonic solids, verify <strong className="text-[#111113]">Euler’s Polyhedral Formula (V - E + F = 2)</strong>, and dissect 3D surface formulas before memorizing them.
          </p>
        </div>

        {/* Solid Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {(Object.keys(SOLIDS_DATA) as SolidType[]).map((key) => {
            const item = SOLIDS_DATA[key];
            const isSelected = selectedSolid === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectSolid(key)}
                className={`px-4 py-2 text-xs sm:text-sm font-mono font-bold uppercase transition-all flex items-center gap-2 border-2 border-[#111113] ${
                  isSelected
                    ? 'bg-[#111113] text-[#F8F7F4] shadow-[4px_4px_0px_#E63946]'
                    : 'bg-white text-[#111113] hover:bg-[#F8F7F4] shadow-[2px_2px_0px_#111113]'
                }`}
              >
                <Box className={`w-4 h-4 ${isSelected ? 'text-[#E63946]' : 'text-[#71717A]'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Stage & Interactive Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 3D Canvas Stage */}
          <div className="lg:col-span-7 bg-white border-2 border-[#111113] p-4 sm:p-6 shadow-[8px_8px_0px_#111113] relative flex flex-col justify-between overflow-hidden">
            {/* Top Toolbar Overlay */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-[#F8F7F4] p-3 border-2 border-[#111113]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#E63946] animate-pulse" />
                <span className="text-xs font-mono font-bold text-[#111113] uppercase tracking-wider">
                  3D WebGL Studio
                </span>
                <span className="text-[11px] text-[#71717A] font-mono hidden sm:inline">
                  (Drag to Orbit)
                </span>
              </div>

              {/* View Mode Toggles */}
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <button
                  onClick={() => setShowSolid(!showSolid)}
                  className={`px-2.5 py-1 border border-[#111113] transition-colors ${
                    showSolid
                      ? 'bg-[#111113] text-white'
                      : 'bg-white text-[#111113]'
                  }`}
                  title="Toggle Solid Obsidian Glass"
                >
                  Solid
                </button>
                <button
                  onClick={() => setShowWireframe(!showWireframe)}
                  className={`px-2.5 py-1 border border-[#111113] transition-colors ${
                    showWireframe
                      ? 'bg-[#111113] text-white'
                      : 'bg-white text-[#111113]'
                  }`}
                  title="Toggle Wireframe Edges"
                >
                  Edges
                </button>
                <button
                  onClick={() => setShowVertices(!showVertices)}
                  className={`px-2.5 py-1 border border-[#111113] transition-colors ${
                    showVertices
                      ? 'bg-[#E63946] text-white'
                      : 'bg-white text-[#111113]'
                  }`}
                  title="Toggle Vertex Spheres"
                >
                  Vertices
                </button>
                <button
                  onClick={handleResetCamera}
                  className="p-1.5 bg-white hover:bg-[#111113] hover:text-white text-[#111113] border border-[#111113] transition-colors"
                  title="Reset 3D Rotation"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Three.js Interactive Viewport */}
            <div
              ref={mountRef}
              className="w-full h-[360px] sm:h-[420px] lg:h-[460px] my-2 bg-[#111113] border-2 border-[#111113] cursor-grab active:cursor-grabbing relative select-none flex items-center justify-center shadow-[4px_4px_0px_#E63946]"
            />

            {/* Bottom Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-[#F8F7F4] p-3 border-2 border-[#111113]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sound.playTick();
                    setAutoRotate(!autoRotate);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 border border-[#111113] transition-all ${
                    autoRotate
                      ? 'bg-[#111113] text-white'
                      : 'bg-white text-[#111113]'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>{autoRotate ? 'Auto-Spin: ON' : 'Auto-Spin: OFF'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#52525B]">
                  <span>Speed:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.2"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-20 accent-[#E63946] cursor-pointer"
                  />
                  <span className="font-bold text-[#111113]">{rotationSpeed}x</span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-bold text-[#E63946] bg-white px-2.5 py-1 border border-[#111113]">
                Euler: {solidData.eulerFormula}
              </div>
            </div>
          </div>

          {/* Mathematical Anatomy & Curriculum Cards */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* 1. Euler Characteristic Card */}
            <div className="bg-white border-2 border-[#111113] p-6 shadow-[8px_8px_0px_#111113] relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="label text-[10px] block">
                    Euler’s Polyhedral Theorem
                  </span>
                  <h3 className="font-heading font-black text-2xl text-[#111113]">
                    {solidData.name}
                  </h3>
                  <p className="text-xs font-mono text-[#71717A]">{solidData.category}</p>
                </div>
                <div className="px-2.5 py-1 bg-[#111113] text-white font-mono text-xs font-bold">
                  {solidData.gradeLevels}
                </div>
              </div>

              {/* V - E + F Metric Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center my-4 font-mono">
                <div className="bg-[#F8F7F4] p-3 border-2 border-[#111113]">
                  <div className="text-3xl font-black text-[#111113]">
                    {solidData.vertices}
                  </div>
                  <div className="label text-[9px] block">
                    Vertices (V)
                  </div>
                </div>
                <div className="bg-[#F8F7F4] p-3 border-2 border-[#111113]">
                  <div className="text-3xl font-black text-[#E63946]">
                    {solidData.edges}
                  </div>
                  <div className="label text-[9px] block">
                    Edges (E)
                  </div>
                </div>
                <div className="bg-[#F8F7F4] p-3 border-2 border-[#111113]">
                  <div className="text-3xl font-black text-[#111113]">
                    {solidData.faces}
                  </div>
                  <div className="label text-[9px] block">
                    Faces (F)
                  </div>
                </div>
              </div>

              {/* Theorem Box */}
              <div className="bg-[#F8F7F4] border-2 border-[#111113] p-3.5 text-xs font-mono space-y-1">
                <div className="font-bold text-[#111113] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
                  <span>Euler Characteristic (χ = 2) Verified:</span>
                </div>
                <p className="text-[#3F3F46] text-[13px] pl-5 font-bold">
                  V - E + F = {solidData.vertices} - {solidData.edges} + {solidData.faces} ={' '}
                  <span className="text-[#E63946] font-black">2</span>
                </p>
              </div>
            </div>

            {/* 2. Formula Breakdown Card */}
            <div className="bg-white border-2 border-[#111113] p-6 shadow-[8px_8px_0px_#111113] space-y-4">
              <h4 className="font-heading font-black text-lg text-[#111113] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#E63946]" />
                <span>Mensuration &amp; Spatial Formulas</span>
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="bg-[#F8F7F4] p-3 border border-[#111113] space-y-1">
                  <div className="label text-[9px]">Total Surface Area:</div>
                  <div className="text-sm font-bold text-[#111113]">
                    {solidData.surfaceAreaFormula}
                  </div>
                </div>

                <div className="bg-[#F8F7F4] p-3 border border-[#111113] space-y-1">
                  <div className="label text-[9px]">Volume Formula:</div>
                  <div className="text-sm font-bold text-[#E63946]">
                    {solidData.volumeFormula}
                  </div>
                </div>
              </div>

              {/* Concepts Covered */}
              <div className="space-y-1.5 pt-1">
                <div className="label text-[10px] block">
                  Concepts Taught by Satyam Sir:
                </div>
                <ul className="space-y-1 text-xs font-mono text-[#3F3F46]">
                  {solidData.concepts.map((concept, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-[#E63946] shrink-0 mt-0.5" />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
