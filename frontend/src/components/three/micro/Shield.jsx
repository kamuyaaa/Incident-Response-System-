import { colors3d, materials } from '../../../assets/3d';

/**
 * Stylized shield — rounded box with slight taper look (low-poly).
 */
export function Shield({ scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.35, 0.45, 0.08]} />
        <meshStandardMaterial
          color={colors3d.ink}
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.08, 0.06]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.02]} />
        <meshStandardMaterial
          color={colors3d.emergency}
          emissive={colors3d.emergency}
          emissiveIntensity={0.1}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
