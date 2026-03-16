import { colors3d } from '../../../assets/3d';

/**
 * Stylized apartment/office building — multi-floor with window bands.
 * For “reporting from” / incident location storytelling.
 */
export function ApartmentBuilding({ scale = 1, position = [0, 0, 0], floors = 3 }) {
  const h = 0.08 * floors;
  return (
    <group scale={scale} position={position} castShadow>
      <mesh>
        <boxGeometry args={[0.28, h, 0.24]} />
        <meshStandardMaterial color={colors3d.building} roughness={0.88} metalness={0.05} />
      </mesh>
      {/* Window strips */}
      {Array.from({ length: floors }).map((_, i) => (
        <mesh key={i} position={[0, -h / 2 + 0.06 + i * 0.08, 0.125]}>
          <boxGeometry args={[0.22, 0.02, 0.01]} />
          <meshStandardMaterial
            color={colors3d.inkTertiary}
            emissive={colors3d.inkTertiary}
            emissiveIntensity={0.05}
            roughness={0.7}
            metalness={0.15}
          />
        </mesh>
      ))}
      <mesh position={[0, h / 2 + 0.03, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.26]} />
        <meshStandardMaterial color={colors3d.buildingRoof} roughness={0.9} metalness={0.08} />
      </mesh>
    </group>
  );
}
