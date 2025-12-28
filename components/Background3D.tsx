import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AppState } from '../types';

interface Background3DProps {
  appState: AppState;
}

const Background3D: React.FC<Background3DProps> = ({ appState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      velocities[i] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
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
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        
        // Behavior based on state - reduced multipliers for slower movement
        const speedMultiplier = appState === AppState.PROCESSING ? 2.5 : 1;

        // Base slow rotation
        particlesRef.current.rotation.y += 0.0003 * speedMultiplier;
        particlesRef.current.rotation.x += 0.00015 * speedMultiplier;

        // Processing swirl - subtle movement
        if (appState === AppState.PROCESSING) {
          const time = Date.now() * 0.0001;
          for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            positions[ix] += Math.sin(time + positions[iy]) * 0.005;
            positions[iy] += Math.cos(time + positions[ix]) * 0.005;
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Smoother camera parallax
        camera.position.x += (mouseRef.current.x * 0.8 - camera.position.x) * 0.02;
        camera.position.y += (mouseRef.current.y * 0.8 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
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