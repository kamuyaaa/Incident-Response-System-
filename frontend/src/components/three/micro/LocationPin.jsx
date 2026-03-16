import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d, materials } from '../../../assets/3d';

/**
 * Stylized 3D location pin — soft geometry, design-system colors.
 */
export function LocationPin({ scale = 1, float = true }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current || !float) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
  });

  return (
    <group ref={ref} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial
          color={colors3d.emergency}
          emissive={colors3d.emergency}
          emissiveIntensity={0.15}
          roughness={materials.soft.roughness}
          metalness={materials.soft.metalness}
        />
      </mesh>
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 20]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}
