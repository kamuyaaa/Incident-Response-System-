import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Large integrated 3D scene for hero: command beacon + ground plane + subtle radar.
 * Designed to fill the hero viewport and feel like a single focal environment.
 */
function Beacon() {
  const ringRef = useRef();
  const ring2Ref = useRef();
  const pillarRef = useRef();
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.12;
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.1;
    if (pillarRef.current) pillarRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group position={[0, 0.4, 0]} scale={2.4}>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#f5f2ed" roughness={0.92} metalness={0.05} />
      </mesh>
      <group ref={pillarRef}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.14, 0.22, 0.7, 24]} />
          <meshStandardMaterial color="#1c1917" roughness={0.6} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.25} roughness={0.45} metalness={0.2} />
        </mesh>
      </group>
      <group ref={ringRef} position={[0, 0.38, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.045, 20, 56]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.4} roughness={0.35} metalness={0.35} />
        </mesh>
      </group>
      <group ref={ring2Ref} position={[0, 0.62, 0]}>
        <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <torusGeometry args={[0.22, 0.028, 14, 36]} />
          <meshStandardMaterial color="#faf8f5" roughness={0.7} metalness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

function RadarArc() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });
  return (
    <group ref={ref} position={[0, 0.15, 0.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.35, 32, 1, 0, Math.PI * 0.35]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.12} side={2} />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[2.2, 48]} />
      <meshStandardMaterial color="#efebe6" roughness={0.95} metalness={0} />
    </mesh>
  );
}

export function HeroCommandScene() {
  return (
    <group position={[0, 0, 0]}>
      <Ground />
      <RadarArc />
      <Beacon />
    </group>
  );
}
