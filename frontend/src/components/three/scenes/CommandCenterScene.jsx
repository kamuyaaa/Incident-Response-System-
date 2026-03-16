import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { colors3d, materials } from '../../../assets/3d';

/**
 * Single hero 3D: clean isometric command center.
 * Desk, map panel with pins, one screen, beacon. No figures or buildings — premium, minimal.
 */
function Desk() {
  return (
    <group position={[0, -0.42, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, 1.1]} />
        <meshStandardMaterial color={colors3d.surface} roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.75, 0.08]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.75} metalness={0.15} />
      </mesh>
    </group>
  );
}

function MapPanel() {
  const pinsRef = useRef();
  useFrame((state) => {
    if (!pinsRef.current) return;
    pinsRef.current.children.forEach((pin, i) => {
      if (pin.position) pin.position.y = Math.sin(state.clock.elapsedTime * 0.6 + i * 0.6) * 0.008;
    });
  });

  return (
    <group position={[0, -0.15, 0.25]}>
      <mesh rotation={[0.1, 0, 0]} receiveShadow>
        <planeGeometry args={[0.72, 0.5]} />
        <meshStandardMaterial color={colors3d.bg} roughness={0.94} metalness={0} />
      </mesh>
      <mesh position={[0, 0.002, 0.25]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[0.68, 0.46]} />
        <meshStandardMaterial color={colors3d.subtle} roughness={0.92} metalness={0} />
      </mesh>
      <group ref={pinsRef}>
        {[[-0.12, 0.08], [0.08, -0.05], [-0.05, -0.12], [0.15, 0.1]].map(([x, z], i) => (
          <group key={i} position={[x, 0.01, z]}>
            <mesh>
              <coneGeometry args={[0.026, 0.07, 16]} />
              <meshStandardMaterial
                {...materials.softEmissive(colors3d.emergency, 0.18)}
                roughness={0.55}
                metalness={0.15}
              />
            </mesh>
            <mesh position={[0, -0.048, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.01, 16]} />
              <meshStandardMaterial color={colors3d.ink} roughness={0.7} metalness={0.12} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Screen({ position, width, height, glow = 0.06 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = glow + Math.sin(state.clock.elapsedTime * 0.4) * 0.015;
  });

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, height, 0.035]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.7} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.02]} ref={ref}>
        <planeGeometry args={[width * 0.92, height * 0.92]} />
        <meshStandardMaterial
          color="#e8eaf0"
          emissive="#6366f1"
          emissiveIntensity={glow}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function Beacon() {
  const ringRef = useRef();
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group position={[0.38, -0.1, 0.32]}>
      <mesh>
        <cylinderGeometry args={[0.055, 0.09, 0.16, 20]} />
        <meshStandardMaterial color={colors3d.ink} roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshStandardMaterial {...materials.softEmissive(colors3d.emergency, 0.22)} />
      </mesh>
      <group ref={ringRef} position={[0, 0.12, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.018, 12, 36]} />
          <meshStandardMaterial {...materials.beacon} />
        </mesh>
      </group>
    </group>
  );
}

function StatusLight({ position, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.12 + Math.sin(state.clock.elapsedTime * 0.9) * 0.05;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.028, 14, 14]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        roughness={0.5}
        metalness={0.15}
      />
    </mesh>
  );
}

export function CommandCenterScene() {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.02;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.01;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.1, 0]}>
      <Desk />
      <MapPanel />
      <Screen position={[-0.42, -0.08, 0.18]} width={0.28} height={0.2} glow={0.08} />
      <Screen position={[-0.42, -0.08, -0.18]} width={0.26} height={0.18} glow={0.05} />
      <Beacon />
      <StatusLight position={[0.5, -0.35, 0.35]} color={colors3d.emergency} />
      <StatusLight position={[0.52, -0.35, 0.2]} color="#0d9488" />
      <StatusLight position={[0.54, -0.35, 0.05]} color="#d97706" />
    </group>
  );
}
