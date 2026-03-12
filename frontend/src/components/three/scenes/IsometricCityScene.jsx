import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d, materials } from '../../../assets/3d';

/**
 * Stylized isometric city block + dispatch tower for hero.
 * Low-poly buildings, soft materials, single beacon focal point.
 */
function Building({ position, size, roof = true }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={colors3d.building} roughness={0.88} metalness={0.05} />
      </mesh>
      {roof && (
        <mesh position={[0, h / 2 + 0.08, 0]} castShadow>
          <boxGeometry args={[w * 1.05, 0.12, d * 1.05]} />
          <meshStandardMaterial color={colors3d.buildingRoof} roughness={0.9} metalness={0.08} />
        </mesh>
      )}
    </group>
  );
}

function DispatchTower() {
  const ringRef = useRef();
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group position={[0, 0.35, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.5, 16]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.6} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial {...materials.softEmissive(colors3d.emergency, 0.22)} />
      </mesh>
      <group ref={ringRef} position={[0, 0.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.035, 14, 40]} />
          <meshStandardMaterial {...materials.beacon} />
        </mesh>
      </group>
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.5, 4.5, 1, 1]} />
      <meshStandardMaterial color={colors3d.subtle} roughness={0.95} metalness={0} />
    </mesh>
  );
}

export function IsometricCityScene() {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1}>
      <GroundPlane />
      <Building position={[-0.7, 0.1, 0.3]} size={[0.5, 0.35, 0.4]} />
      <Building position={[0.5, 0.08, 0.25]} size={[0.4, 0.28, 0.35]} />
      <Building position={[0.35, 0.12, -0.4]} size={[0.45, 0.4, 0.38]} roof={false} />
      <Building position={[-0.4, 0.06, -0.35]} size={[0.35, 0.22, 0.3]} />
      <DispatchTower />
    </group>
  );
}
