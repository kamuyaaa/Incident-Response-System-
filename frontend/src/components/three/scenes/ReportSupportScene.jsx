import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d } from '../../../assets/3d';
import { MedicalCross } from '../micro';

/**
 * Small 3D support for incident reporting section: medical cross on base.
 */
export function ReportSupportScene() {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.06;
  });

  return (
    <group ref={groupRef} scale={1.3}>
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 24]} />
        <meshStandardMaterial color={colors3d.surface} roughness={0.9} metalness={0.05} />
      </mesh>
      <MedicalCross scale={1.2} />
    </group>
  );
}
