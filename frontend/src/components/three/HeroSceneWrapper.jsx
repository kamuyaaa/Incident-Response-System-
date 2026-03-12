import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CommandCenterScene } from './scenes';

/**
 * Hero 3D content with GSAP entrance: slight Y + scale.
 * Uses Command Center scene as main visual identity.
 */
export function HeroSceneWrapper() {
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.fromTo(
      groupRef.current.position,
      { y: 0.2 },
      { y: 0, duration: 1.25, ease: 'power3.out' }
    );
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0.94, y: 0.94, z: 0.94 },
      { x: 1, y: 1, z: 1, duration: 1.15, ease: 'power2.out' }
    );
  }, []);

  return (
    <group ref={groupRef}>
      <CommandCenterScene />
    </group>
  );
}
