import { colors3d } from '../../../assets/3d';

/**
 * Stylized hospital building — low-poly with cross accent.
 * For tracking/resolution storytelling (destination).
 */
export function HospitalBuilding({ scale = 1, position = [0, 0, 0] }) {
  return (
    <group scale={scale} position={position} castShadow>
      <mesh>
        <boxGeometry args={[0.4, 0.35, 0.32]} />
        <meshStandardMaterial color={colors3d.building} roughness={0.88} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.42, 0.08, 0.34]} />
        <meshStandardMaterial color={colors3d.buildingRoof} roughness={0.9} metalness={0.08} />
      </mesh>
      {/* Red cross front */}
      <mesh position={[0, 0.08, 0.165]}>
        <boxGeometry args={[0.08, 0.2, 0.02]} />
        <meshStandardMaterial
          color={colors3d.emergency}
          emissive={colors3d.emergency}
          emissiveIntensity={0.08}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.08, 0.165]}>
        <boxGeometry args={[0.2, 0.06, 0.02]} />
        <meshStandardMaterial
          color={colors3d.emergency}
          emissive={colors3d.emergency}
          emissiveIntensity={0.08}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
