'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import type { Group } from 'three';
import { prefersReducedMotion, saveDataEnabled, whenIdle } from '@/lib/motion';

/*
 * Brief §5.1 + §5.3 — 3D BLAZE can with cinematic lighting, metallic
 * reflections, condensation. Subtle motion: floating + slow rotation.
 *
 * BUDGET (brief §8):
 *   - R3F + three: ~110KB gz, dynamic-imported once, cached for hero + BLAZE
 *   - Mounted only when:
 *       (a) hero in view (IntersectionObserver)
 *       (b) browser idle (requestIdleCallback)
 *       (c) NOT reduced-motion
 *       (d) NOT saveData
 *   - dpr capped at [1, 1.75] for mobile perf
 *
 * SWAP PROCEDURE (when /3d/blaze-can.glb is delivered):
 *   1. Place glb at /public/3d/blaze-can.glb (Draco-compressed)
 *   2. Add: import { useGLTF } from '@react-three/drei'
 *           useGLTF.preload('/3d/blaze-can.glb')
 *           const { scene } = useGLTF('/3d/blaze-can.glb')
 *   3. Replace <group ref={ref}>{procedural}</group> with
 *           <primitive ref={ref} object={scene} />
 *   4. Adjust scale + position to match scene framing
 *
 * Brief §10 — canvas has role="img" + aria-label for AT users.
 */

function BlazeCan() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.26;
    ref.current.position.y = Math.sin(t * 1.05) * 0.08;
  });

  // PROCEDURAL CAN — placeholder until /3d/blaze-can.glb is delivered.
  return (
    <group ref={ref} dispose={null}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.6, 64]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.85} roughness={0.22} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <torusGeometry args={[0.55, 0.04, 16, 64]} />
        <meshStandardMaterial color="#c7ccd1" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.8, 0]} castShadow>
        <torusGeometry args={[0.55, 0.04, 16, 64]} />
        <meshStandardMaterial color="#c7ccd1" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.553, 0.553, 0.18, 64]} />
        <meshStandardMaterial color="#e11d2a" metalness={0.4} roughness={0.4} emissive="#e11d2a" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

export function BlazeCanScene() {
  const [mount, setMount] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || saveDataEnabled()) return;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    whenIdle(() => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setMount(true);
            observer?.disconnect();
          }
        },
        { rootMargin: '100px' },
      );
      if (containerRef.current) observer.observe(containerRef.current);
    });

    return () => { cancelled = true; observer?.disconnect(); };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="A premium black-and-chrome BLAZE energy drink can with a deep red accent band, floating and slowly rotating in a cinematic dark environment."
      className="absolute inset-0 z-[1] pointer-events-none"
    >
      {mount && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 3.4], fov: 32 }}
          frameloop="always"
        >
          <ambientLight intensity={0.18} />
          <spotLight position={[3, 4, 3]} angle={0.4} penumbra={0.8} intensity={1.6} color="#ffffff" castShadow />
          <pointLight position={[-4, 1, -2]} intensity={0.7} color="#7cc4ff" />
          <pointLight position={[3, -1, 2]} intensity={0.5} color="#e11d2a" />
          <Suspense fallback={null}>
            <BlazeCan />
            <ContactShadows position={[0, -0.85, 0]} opacity={0.7} scale={6} blur={2.4} far={2} />
            <Environment preset="studio" />
          </Suspense>
          <EffectComposer>
            <Bloom intensity={0.6} luminanceThreshold={0.8} luminanceSmoothing={0.4} />
            <Vignette eskil={false} offset={0.18} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}
