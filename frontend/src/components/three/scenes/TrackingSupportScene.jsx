import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d } from '../../../assets/3d';
import { HospitalBuilding, ApartmentBuilding, ResponderFigure } from '../assets';

/**
 * Mini isometric scene: incident (apartment) → responder en route → resolution (hospital).
 * Story: reporting, dispatching, tracking resolution. Integrated layout.
 */
export function TrackingSupportScene() {
  const groupRef = useRef();
  const responderRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    if (responderRef.current) {
      responderRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.02;
    }
  });

  return (
    <group ref={groupRef} scale={1.15}>
      {/* Ground */}
      <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshStandardMaterial color={colors3d.subtle} roughness={0.92} metalness={0} />
      </mesh>
      {/* Road (path between incident and hospital) */}
      <mesh position={[0, -0.265, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.9]} />
        <meshStandardMaterial color={colors3d.inkSecondary} roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Apartment: incident / reporting location */}
      <group position={[-0.28, 0.02, 0.22]}>
        <ApartmentBuilding scale={0.7} position={[0, 0, 0]} floors={3} />
      </group>
      {/* Hospital: resolution destination */}
      <group position={[0.3, 0, -0.2]}>
        <HospitalBuilding scale={0.55} position={[0, 0, 0]} />
      </group>
      {/* Responder on the road (en route) */}
      <group ref={responderRef} position={[0.02, 0.02, 0.05]}>
        <ResponderFigure scale={0.85} variant="paramedic" />
      </group>
    </group>
  );
}
