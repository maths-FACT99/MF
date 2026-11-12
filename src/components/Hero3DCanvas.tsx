import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse reaction & rotation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer 3D Icosahedron (Crimson Red Wireframe + Glass faces)
    const icosahedronGeo = new THREE.IcosahedronGeometry(1.8, 0);
    const icosahedronMat = new THREE.MeshPhysicalMaterial({
      color: 0xdc2626,
      transparent: true,
      opacity: 0.22,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const icosahedronMesh = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    group.add(icosahedronMesh);

    // Outer Crimson Wireframe Edges
    const edgesGeo = new THREE.EdgesGeometry(icosahedronGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xef4444,
      linewidth: 2,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    group.add(edgesMesh);

    // 2. Inner Golden Octahedron
    const octahedronGeo = new THREE.OctahedronGeometry(1.0, 0);
    const octahedronMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
    });
    const octahedronMesh = new THREE.Mesh(octahedronGeo, octahedronMat);
    group.add(octahedronMesh);

    const innerEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(octahedronGeo),
      new THREE.LineBasicMaterial({ color: 0xfde68a })
    );
    group.add(innerEdges);

    // 3. Floating 3D Vertex Spheres
    const vertexPositions = icosahedronGeo.attributes.position;
    const vertexGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

    for (let i = 0; i < vertexPositions.count; i++) {
      const x = vertexPositions.getX(i);
      const y = vertexPositions.getY(i);
      const z = vertexPositions.getZ(i);
      const dot = new THREE.Mesh(sphereGeo, sphereMat);
      dot.position.set(x, y, z);
      vertexGroup.add(dot);
    }
    group.add(vertexGroup);

    // 4. Surrounding floating particle coordinate grid
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 8;
      particlePos[i + 1] = (Math.random() - 0.5) * 8;
      particlePos[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdc2626,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const crimsonLight = new THREE.PointLight(0xef4444, 4, 15);
    crimsonLight.position.set(4, 3, 4);
    scene.add(crimsonLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3, 15);
    goldLight.position.set(-4, -3, 3);
    scene.add(goldLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Mouse Tracking for Interactive 3D Parallax Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 1.5;
      targetY = (y / rect.height) * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation
      group.rotation.y = elapsedTime * 0.25 + mouseX;
      group.rotation.x = elapsedTime * 0.15 + mouseY;
      group.rotation.z = Math.sin(elapsedTime * 0.2) * 0.1;

      // Inner octahedron counter-spin
      octahedronMesh.rotation.x = -elapsedTime * 0.4;
      octahedronMesh.rotation.y = -elapsedTime * 0.5;
      innerEdges.rotation.x = -elapsedTime * 0.4;
      innerEdges.rotation.y = -elapsedTime * 0.5;

      // Gentle floating oscillation
      group.position.y = Math.sin(elapsedTime * 0.8) * 0.15;
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icosahedronGeo.dispose();
      icosahedronMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      octahedronGeo.dispose();
      octahedronMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[460px] relative cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
      title="Interactive 3D Polyhedron: Move cursor to tilt & inspect"
    />
  );
};
