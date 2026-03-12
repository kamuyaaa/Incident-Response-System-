import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function HeroBeacon() {
  const ringRef = useRef();
  const ring2Ref = useRef();
  const pillarRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.12;
    if (pillarRef.current) pillarRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group position={[0, 0, 0]} scale={1.2}>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.85, 32]} />
        <meshStandardMaterial color="#f5f2ed" roughness={0.9} metalness={0.1} />
      </mesh>
      <group ref={pillarRef}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.65, 24]} />
          <meshStandardMaterial color="#1c1917" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.2} roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      <group ref={ringRef} position={[0, 0.35, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.04, 16, 48]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.35} roughness={0.4} metalness={0.3} />
        </mesh>
      </group>
      <group ref={ring2Ref} position={[0, 0.55, 0]}>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <torusGeometry args={[0.2, 0.025, 12, 32]} />
          <meshStandardMaterial color="#faf8f5" roughness={0.7} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
