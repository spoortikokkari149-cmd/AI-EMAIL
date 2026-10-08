import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Sparkles, RefreshCw, Zap } from 'lucide-react';

export type ShieldMode = 'defense' | 'scan' | 'overcharge';

interface ThreeCyberShieldProps {
  mode?: ShieldMode;
  onModeChange?: (mode: ShieldMode) => void;
  className?: string;
}

export function ThreeCyberShield({
  mode = 'defense',
  onModeChange,
  className = '',
}: ThreeCyberShieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<ShieldMode>(mode);
  const sceneRef = useRef<{
    shieldMesh?: THREE.Mesh;
    wireframeShield?: THREE.LineSegments;
    particles?: THREE.Points;
    ringsGroup?: THREE.Group;
    pointLight?: THREE.PointLight;
    ambientLight?: THREE.AmbientLight;
    scanRing?: THREE.Mesh;
  }>({});

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const getThemeColors = (m: ShieldMode) => {
    switch (m) {
      case 'scan':
        return {
          primary: 0xf59e0b, // Amber
          secondary: 0xef4444, // Red
          emissive: 0xd97706,
          particles: 0xfbbf24,
          glowHex: '#f59e0b',
        };
      case 'overcharge':
        return {
          primary: 0x10b981, // Emerald
          secondary: 0x06b6d4, // Cyan
          emissive: 0x059669,
          particles: 0x34d399,
          glowHex: '#10b981',
        };
      default:
        return {
          primary: 0x00f0ff, // Cyber Cyan
          secondary: 0x3b82f6, // Neon Blue
          emissive: 0x0284c7,
          particles: 0x38bdf8,
          glowHex: '#00f0ff',
        };
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const colors = getThemeColors(currentMode);

    const pointLight = new THREE.PointLight(colors.primary, 4, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(colors.secondary, 3, 20);
    backLight.position.set(0, 0, -4);
    scene.add(backLight);

    // Build 3D Shield Shape
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 2.3);
    shieldShape.quadraticCurveTo(1.7, 2.1, 1.7, 0.6);
    shieldShape.quadraticCurveTo(1.7, -0.9, 0, -2.3);
    shieldShape.quadraticCurveTo(-1.7, -0.9, -1.7, 0.6);
    shieldShape.quadraticCurveTo(-1.7, 2.1, 0, 2.3);

    const extrudeSettings = {
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    // Shield Material - Holographic Translucent Cyber Surface
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x050b14,
      emissive: colors.emissive,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.2,
      transmission: 0.65,
      thickness: 1.2,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    rootGroup.add(shieldMesh);

    // Wireframe Outer Cage
    const wireframeGeometry = new THREE.WireframeGeometry(shieldGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
    const wireframeShield = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    wireframeShield.scale.set(1.04, 1.04, 1.04);
    rootGroup.add(wireframeShield);

    // Outer Geodesic Icosahedron Ring
    const cageGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const cageWireGeo = new THREE.WireframeGeometry(cageGeo);
    const cageMat = new THREE.LineBasicMaterial({
      color: colors.secondary,
      transparent: true,
      opacity: 0.25,
    });
    const cageMesh = new THREE.LineSegments(cageWireGeo, cageMat);
    rootGroup.add(cageMesh);

    // Scan Ring traversing up/down
    const scanRingGeo = new THREE.TorusGeometry(1.9, 0.04, 16, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.8,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    rootGroup.add(scanRing);

    // Floating 3D Orbital Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 2.0;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.5;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleAngles[i] = angle;
      particleRadii[i] = radius;
      particleSpeeds[i] = (0.2 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.07,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Save references for dynamic updates
    sceneRef.current = {
      shieldMesh,
      wireframeShield,
      particles,
      pointLight,
      ambientLight,
      scanRing,
    };

    // Mouse Parallax Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.6;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base idle rotation + mouse offset
      rootGroup.rotation.y = Math.sin(elapsedTime * 0.6) * 0.25 + mouseRef.current.x;
      rootGroup.rotation.x = Math.cos(elapsedTime * 0.5) * 0.15 - mouseRef.current.y;
      rootGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.05;

      // Pulse scan ring vertically
      scanRing.position.y = Math.sin(elapsedTime * 2.2) * 2.0;
      scanRing.scale.setScalar(1 + Math.sin(elapsedTime * 4.4) * 0.08);

      // Rotate geodesic outer cage
      cageMesh.rotation.y = elapsedTime * 0.2;
      cageMesh.rotation.x = elapsedTime * 0.15;

      // Update orbital particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleAngles[i] += particleSpeeds[i] * 0.015;
        const rad = particleRadii[i];
        arr[i * 3] = Math.cos(particleAngles[i]) * rad;
        arr[i * 3 + 2] = Math.sin(particleAngles[i]) * rad;
      }
      posAttr.needsUpdate = true;

      // Gentle floating elevation
      rootGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update theme colors when mode changes
  const handleSetMode = (newMode: ShieldMode) => {
    setCurrentMode(newMode);
    onModeChange?.(newMode);

    const colors = getThemeColors(newMode);
    const { shieldMesh, wireframeShield, particles, pointLight, scanRing } = sceneRef.current;

    if (shieldMesh) {
      const mat = shieldMesh.material as THREE.MeshPhysicalMaterial;
      mat.emissive.setHex(colors.emissive);
    }
    if (wireframeShield) {
      const mat = wireframeShield.material as THREE.LineBasicMaterial;
      mat.color.setHex(colors.primary);
    }
    if (particles) {
      const mat = particles.material as THREE.PointsMaterial;
      mat.color.setHex(colors.particles);
    }
    if (pointLight) {
      pointLight.color.setHex(colors.primary);
    }
    if (scanRing) {
      const mat = scanRing.material as THREE.MeshBasicMaterial;
      mat.color.setHex(colors.primary);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas Mounting Point */}
      <div
        ref={mountRef}
        className="w-full h-[380px] sm:h-[450px] cursor-grab active:cursor-grabbing relative"
      />

      {/* 3D Mode Selector Buttons */}
      <div className="absolute bottom-1 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] z-20">
        <button
          type="button"
          onClick={() => handleSetMode('defense')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            currentMode === 'defense'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_#00f0ff]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>DEFENSE</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetMode('scan')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            currentMode === 'scan'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_#f59e0b]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>RADAR SCAN</span>
        </button>

        <button
          type="button"
          onClick={() => handleSetMode('overcharge')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            currentMode === 'overcharge'
              ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_12px_#10b981]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>HARDENED</span>
        </button>
      </div>
    </div>
  );
}
