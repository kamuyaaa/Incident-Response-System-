import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d } from '../../../assets/3d';

/**
 * Stylized responder figure — paramedic/firefighter/police (one generic unit).
 * Standing, compact for use on map/tracking scenes.
 */
export function ResponderFigure({ scale = 1, variant = 'paramedic' }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.008;
  });

  const vestColor = variant === 'paramedic' ? colors3d.ambulanceDark
    : variant === 'fire' ? colors3d.fireDark
    : colors3d.policeDark;

  return (
    <group ref={groupRef} scale={scale}>
      {/* Base / feet */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 0.02, 8]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Legs / torso */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.06, 0.1, 0.04]} />
        <meshStandardMaterial color={colors3d.inkSecondary} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.05]} />
        <meshStandardMaterial color={vestColor} roughness={0.75} metalness={0.1} />
      </mesh>
      {/* Head + helmet */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color={colors3d.surface} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={vestColor} roughness={0.7} metalness={0.15} />
      </mesh>
    </group>
  );
}
