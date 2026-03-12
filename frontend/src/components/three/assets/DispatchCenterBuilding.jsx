import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d } from '../../../assets/3d';

/**
 * Stylized dispatch center building — compact, antenna/small tower.
 * For hero backdrop or “where dispatch lives”.
 */
export function DispatchCenterBuilding({ scale = 1, position = [0, 0, 0] }) {
  const antennaRef = useRef();
  useFrame((_, delta) => {
    if (antennaRef.current) antennaRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group scale={scale} position={position} castShadow>
      <mesh>
        <boxGeometry args={[0.32, 0.28, 0.26]} />
        <meshStandardMaterial color={colors3d.building} roughness={0.88} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.34, 0.06, 0.28]} />
        <meshStandardMaterial color={colors3d.buildingRoof} roughness={0.9} metalness={0.08} />
      </mesh>
      {/* Antenna / comms */}
      <group ref={antennaRef} position={[0, 0.25, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.12, 8]} />
          <meshStandardMaterial color={colors3d.ink} roughness={0.6} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color={colors3d.emergency}
            emissive={colors3d.emergency}
            emissiveIntensity={0.15}
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}
