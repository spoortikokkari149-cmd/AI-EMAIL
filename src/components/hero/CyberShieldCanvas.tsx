import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type CyberShieldState = 'idle' | 'listening' | 'scanning' | 'threat' | 'safe';

interface CyberShieldCanvasProps {
  className?: string;
  state?: CyberShieldState;
}

export function CyberShieldCanvas({ className = '', state = 'idle' }: CyberShieldCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CyberShieldState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040711, 0.04);

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Main Group
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // 1. Procedural 3D Shield Geometry
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.85);
    shieldShape.quadraticCurveTo(1.25, 1.75, 1.55, 1.05);
    shieldShape.quadraticCurveTo(1.55, -0.3, 0, -1.85);
    shieldShape.quadraticCurveTo(-1.55, -0.3, -1.55, 1.05);
    shieldShape.quadraticCurveTo(-1.25, 1.75, 0, 1.85);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();

    // Shield Material
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x051b33,
      emissive: 0x02254d,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.2,
      transmission: 0.35,
      thickness: 0.5,
      transparent: true,
      opacity: 0.9,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldGroup.add(shieldMesh);

    // Glowing Neon Edges
    const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    shieldGroup.add(edgeLines);

    // Inner Crest
    const innerShape = new THREE.Shape();
    innerShape.moveTo(0, 1.35);
    innerShape.quadraticCurveTo(0.85, 1.25, 1.05, 0.75);
    innerShape.quadraticCurveTo(1.05, -0.2, 0, -1.35);
    innerShape.quadraticCurveTo(-1.05, -0.2, -1.05, 0.75);
    innerShape.quadraticCurveTo(-0.85, 1.25, 0, 1.35);

    const innerEdgesGeo = new THREE.EdgesGeometry(new THREE.ShapeGeometry(innerShape));
    const innerMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
    });
    const innerLines = new THREE.LineSegments(innerEdgesGeo, innerMat);
    innerLines.position.z = 0.22;
    shieldGroup.add(innerLines);

    // Central 3D AI Core (Glowing Spherical Orb)
    const coreGeo = new THREE.IcosahedronGeometry(0.35, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const aiCore = new THREE.Mesh(coreGeo, coreMat);
    aiCore.position.set(0, 0, 0.28);
    shieldGroup.add(aiCore);

    // Central Cross Circuit
    const crossGeo = new THREE.BufferGeometry();
    const crossVertices = new Float32Array([
      0, 0.65, 0.24,   0, -0.55, 0.24,
      -0.55, 0.15, 0.24,  0.55, 0.15, 0.24,
      -0.55, 0.15, 0.24,  -0.75, 0.38, 0.24,
      0.55, 0.15, 0.24,   0.75, 0.38, 0.24,
      0, -0.55, 0.24,    -0.35, -0.85, 0.24,
      0, -0.55, 0.24,     0.35, -0.85, 0.24,
    ]);
    crossGeo.setAttribute('position', new THREE.BufferAttribute(crossVertices, 3));
    const crossMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9,
    });
    const crossLines = new THREE.LineSegments(crossGeo, crossMat);
    shieldGroup.add(crossLines);

    // Concentric Holographic Security Rings
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.8;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // Scanning Laser Line
    const scanLineGeo = new THREE.BufferGeometry();
    const scanLineVertices = new Float32Array([-1.8, 0, 0.3, 1.8, 0, 0.3]);
    scanLineGeo.setAttribute('position', new THREE.BufferAttribute(scanLineVertices, 3));
    const scanLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
    });
    const scanLine = new THREE.Line(scanLineGeo, scanLineMat);
    shieldGroup.add(scanLine);

    // Particles
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.5, 12);
    cyanPoint.position.set(2, 3, 3);
    scene.add(cyanPoint);

    const bluePoint = new THREE.PointLight(0x2563eb, 3.0, 12);
    bluePoint.position.set(-3, -2, 2);
    scene.add(bluePoint);

    // Mouse movement
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = -y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentState = stateRef.current;

      if (!prefersReducedMotion) {
        // State-reactive color and speed modulation
        if (currentState === 'threat') {
          // Strong Warning Crimson Flare
          edgesMat.color.setHex(0xef4444);
          coreMat.color.setHex(0xef4444);
          ring1Mat.color.setHex(0xef4444);
          cyanPoint.color.setHex(0xef4444);
          cyanPoint.intensity = 5.0 + Math.sin(elapsedTime * 8) * 2.0;
          ring1.rotation.z = elapsedTime * 1.5;
          ring2.rotation.z = -elapsedTime * 1.2;
          aiCore.scale.setScalar(1.2 + Math.sin(elapsedTime * 6) * 0.2);
        } else if (currentState === 'scanning') {
          // Scanning: Fast rotating rings + vertical laser sweep
          edgesMat.color.setHex(0x00f0ff);
          coreMat.color.setHex(0x38bdf8);
          ring1Mat.color.setHex(0x00f0ff);
          cyanPoint.color.setHex(0x00f0ff);
          cyanPoint.intensity = 4.5;
          ring1.rotation.z = elapsedTime * 1.8;
          ring2.rotation.z = -elapsedTime * 1.5;
          scanLine.position.y = Math.sin(elapsedTime * 4) * 1.4;
          scanLine.visible = true;
          aiCore.rotation.y = elapsedTime * 4;
        } else if (currentState === 'listening') {
          // Listening: Pulsing AI core wave
          edgesMat.color.setHex(0x38bdf8);
          coreMat.color.setHex(0x00f0ff);
          cyanPoint.intensity = 3.5 + Math.sin(elapsedTime * 6) * 1.5;
          aiCore.scale.setScalar(1.0 + Math.sin(elapsedTime * 5) * 0.35);
          scanLine.visible = false;
        } else if (currentState === 'safe') {
          // Safe: Emerald Green Calm Verification
          edgesMat.color.setHex(0x10b981);
          coreMat.color.setHex(0x10b981);
          ring1Mat.color.setHex(0x10b981);
          cyanPoint.color.setHex(0x10b981);
          cyanPoint.intensity = 3.0 + Math.sin(elapsedTime * 2) * 0.5;
          ring1.rotation.z = elapsedTime * 0.3;
          ring2.rotation.z = -elapsedTime * 0.25;
          scanLine.visible = false;
          aiCore.scale.setScalar(1.0);
        } else {
          // Idle: Cyan / Blue cyber aesthetics
          edgesMat.color.setHex(0x00f0ff);
          coreMat.color.setHex(0x00f0ff);
          ring1Mat.color.setHex(0x00f0ff);
          cyanPoint.color.setHex(0x00f0ff);
          cyanPoint.intensity = 3.0 + Math.sin(elapsedTime * 3) * 0.8;
          ring1.rotation.z = elapsedTime * 0.25;
          ring2.rotation.z = -elapsedTime * 0.2;
          scanLine.visible = false;
          aiCore.rotation.y = elapsedTime * 1.5;
          aiCore.scale.setScalar(1.0);
        }

        // Shield idle bounce and tilt
        shieldGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
        shieldGroup.rotation.y += (targetRotationY - shieldGroup.rotation.y) * 0.05 + 0.003;
        shieldGroup.rotation.x += (targetRotationX - shieldGroup.rotation.x) * 0.05;

        // Particle cloud orbit
        particles.rotation.y = elapsedTime * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      innerEdgesGeo.dispose();
      innerMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      crossGeo.dispose();
      crossMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      scanLineGeo.dispose();
      scanLineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] lg:min-h-[520px] flex items-center justify-center ${className}`}
    />
  );
}
