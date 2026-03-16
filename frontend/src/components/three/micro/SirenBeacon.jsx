import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d, materials } from '../../../assets/3d';

/**
 * Small siren beacon — rotating ring + dome, subtle emissive.
 */
export function SirenBeacon({ scale = 1 }) {
  const ringRef = useRef();
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.8;
  });

  return (
    <group scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial {...materials.softEmissive(colors3d.emergency, 0.25)} />
      </mesh>
      <group ref={ringRef} position={[0, 0.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.025, 12, 24]} />
          <meshStandardMaterial {...materials.beacon} />
        </mesh>
      </group>
    </group>
  );
}
