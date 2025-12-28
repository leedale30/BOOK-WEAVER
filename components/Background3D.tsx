import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AppState } from '../types';

interface Background3DProps {
  appState: AppState;
  themeColor: string;
}

const Background3D: React.FC<Background3DProps> = ({ appState, themeColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetColor = useRef(new THREE.Color(themeColor));

  // Update target color whenever themeColor prop changes
  useEffect(() => {
    targetColor.current.set(themeColor);
  }, [themeColor]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle System
    const particleCount = 2000; // Increased count for better detail
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      const pos = (Math.random() - 0.5) * 12;
      positions[i] = pos;
      initialPositions[i] = pos;
      velocities[i] = (Math.random() - 0.5) * 0.01;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(themeColor),
      size: 0.03,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1, but mapped to scene units (~ -5 to 5 on plane z=0)
      mouseRef.current.x = (e.clientX / window.innerWidth) * 10 - 5;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 10 + 5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (particlesRef.current && cameraRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const speedMultiplier = appState === AppState.PROCESSING ? 3.0 : 1;

        // Smooth Color Transitions
        material.color.lerp(targetColor.current, 0.05);

        // Slow rotation base
        particlesRef.current.rotation.y += 0.0002 * speedMultiplier;
        particlesRef.current.rotation.x += 0.0001 * speedMultiplier;

        // Mouse interaction logic (Repulsion)
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;

        for (let i = 0; i < particleCount; i++) {
          const ix = i * 3;
          const iy = i * 3 + 1;
          const iz = i * 3 + 2;

          // 1. Return to home position slowly (spring-like effect)
          positions[ix] += (initialPositions[ix] - positions[ix]) * 0.01;
          positions[iy] += (initialPositions[iy] - positions[iy]) * 0.01;
          positions[iz] += (initialPositions[iz] - positions[iz]) * 0.01;

          // 2. Mouse Repulsion
          const dx = positions[ix] - mouseX;
          const dy = positions[iy] - mouseY;
          const distSq = dx * dx + dy * dy;
          const radiusSq = 2.0; // 1.4 units influence radius

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (radiusSq - distSq) / radiusSq;
            positions[ix] += dx * force * 0.1;
            positions[iy] += dy * force * 0.1;
          }

          // 3. Processing swirl
          if (appState === AppState.PROCESSING) {
            const time = Date.now() * 0.0005;
            positions[ix] += Math.sin(time + positions[iy]) * 0.01;
            positions[iy] += Math.cos(time + positions[ix]) * 0.01;
          }
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        // Camera parallax
        const camTargetX = (mouseRef.current.x * 0.1);
        const camTargetY = (mouseRef.current.y * 0.1);
        cameraRef.current.position.x += (camTargetX - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y += (camTargetY - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [appState]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default Background3D;