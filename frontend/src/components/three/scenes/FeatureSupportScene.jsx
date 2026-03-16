import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d } from '../../../assets/3d';
import { LocationPin } from '../micro';
import { ApartmentBuilding } from '../assets';

/**
 * Feature section: “Report from your location” — pin + apartment building.
 * Story: reporting incidents from where you are (building + pin).
 */
export function FeatureSupportScene() {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <group ref={groupRef} scale={1.35}>
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshStandardMaterial color={colors3d.surface} roughness={0.9} metalness={0.05} />
      </mesh>
      <group position={[-0.12, -0.05, -0.08]}>
        <ApartmentBuilding scale={0.5} position={[0, 0, 0]} floors={2} />
      </group>
      <LocationPin scale={0.85} float />
    </group>
  );
}
