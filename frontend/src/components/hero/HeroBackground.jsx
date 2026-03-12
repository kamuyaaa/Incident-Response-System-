import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function HeroBackground() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.04;
  });

  return (
    <mesh ref={meshRef} scale={2} position={[0, 0, -2.5]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color="#0f172a"
        emissive="#7f1d1d"
        emissiveIntensity={0.15}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}
