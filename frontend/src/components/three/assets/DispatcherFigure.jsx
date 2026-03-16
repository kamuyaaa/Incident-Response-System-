import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d } from '../../../assets/3d';

/**
 * Stylized dispatcher figure — seated at desk, headset, facing map/screens.
 * Scale to fit hero command center (small).
 */
export function DispatcherFigure({ scale = 1 }) {
  const headRef = useRef();
  useFrame((state) => {
    if (!headRef.current) return;
    headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.04;
  });

  return (
    <group scale={scale} position={[-0.22, -0.38, 0.08]}>
      {/* Seat */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.2, 0.06, 0.18]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.14, 0.2, 0.1]} />
        <meshStandardMaterial color={colors3d.inkSecondary} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Head */}
      <group ref={headRef} position={[0, 0.28, 0.02]}>
        <mesh castShadow>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color={colors3d.surface} roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Headset */}
        <mesh position={[0.04, 0.02, 0.04]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.06, 0.02, 0.02]} />
          <meshStandardMaterial color={colors3d.ink} roughness={0.6} metalness={0.25} />
        </mesh>
        <mesh position={[-0.04, 0.02, 0.04]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.06, 0.02, 0.02]} />
          <meshStandardMaterial color={colors3d.ink} roughness={0.6} metalness={0.25} />
        </mesh>
      </group>
      {/* Arm toward map */}
      <mesh position={[0.06, 0.1, 0.08]} rotation={[0.2, 0, -0.4]} castShadow>
        <boxGeometry args={[0.06, 0.12, 0.04]} />
        <meshStandardMaterial color={colors3d.inkSecondary} roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  );
}
