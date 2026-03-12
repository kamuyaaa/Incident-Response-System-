import { colors3d, materials } from '../../../assets/3d';

/**
 * Stylized 3D medical cross — clean, soft, low-poly.
 */
export function MedicalCross({ scale = 1 }) {
  const s = 0.12;
  const h = 0.4;
  return (
    <group scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[s, h, s]} />
        <meshStandardMaterial
          color={colors3d.emergency}
          emissive={colors3d.emergency}
          emissiveIntensity={0.12}
          roughness={materials.soft.roughness}
          metalness={materials.soft.metalness}
        />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[h, s, s]} />
        <meshStandardMaterial
          color={colors3d.emergency}
          emissive={colors3d.emergency}
          emissiveIntensity={0.12}
          roughness={materials.soft.roughness}
          metalness={materials.soft.metalness}
        />
      </mesh>
    </group>
  );
}
