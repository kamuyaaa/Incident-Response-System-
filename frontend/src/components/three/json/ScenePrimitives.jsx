import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { useSceneRegistry } from './SceneRegistry';
import minimalCharacterSpec from '../../../config/scenes/minimal-character-spec.json';

function SoftMaterial({ color }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.92}
      metalness={0.06}
    />
  );
}

function RegisterRef({ id, children }) {
  const ref = useRef(null);
  const { register } = useSceneRegistry();

  useEffect(() => {
    if (id) register(id, ref);
  }, [id, register]);

  return children(ref);
}

export function Ground({ ground }) {
  const type = ground?.type;
  const size = ground?.size || [8, 0.4, 8];
  const position = ground?.position || [0, -0.2, 0];
  const color = ground?.color || '#EDE4D8';

  const radius =
    type === 'roundedPlatform' ? 0.35
      : type === 'cityBase' ? 0.28
        : 0.22;

  return (
    <group position={position}>
      <RoundedBox
        args={size}
        radius={radius}
        smoothness={8}
        receiveShadow
      >
        <SoftMaterial color={color} />
      </RoundedBox>
    </group>
  );
}

export function BoxObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [1, 1, 1];
  const color = obj.color || '#ffffff';
  const radius = obj.radius ?? 0.12;

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          <RoundedBox args={[1, 1, 1]} radius={radius} smoothness={8} castShadow receiveShadow>
            <SoftMaterial color={color} />
          </RoundedBox>
        </group>
      )}
    </RegisterRef>
  );
}

export function RoundedBoxObject({ obj }) {
  return <BoxObject obj={obj} />;
}

export function CylinderObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [1, 0.1, 1];
  const color = obj.color || '#ffffff';

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 1, 28]} />
            <SoftMaterial color={color} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

export function RoadObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [6, 0.03, 1.2];
  const color = obj.color || '#D1D5DB';

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          <RoundedBox args={[1, 1, 1]} radius={0.18} smoothness={6} receiveShadow>
            <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
          </RoundedBox>
          <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.85, 0.12]} />
            <meshStandardMaterial color="#ffffff" opacity={0.35} transparent roughness={1} metalness={0} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

export function PlatformObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [2, 0.12, 1.4];
  const color = obj.color || '#F5EFE7';
  const radius = obj.radius ?? 0.16;

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          <RoundedBox args={[1, 1, 1]} radius={radius} smoothness={8} receiveShadow>
            <SoftMaterial color={color} />
          </RoundedBox>
        </group>
      )}
    </RegisterRef>
  );
}

export function BuildingObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [1, 1, 1];
  const color = obj.color || '#FBD5D5';
  const roofColor = obj.roofColor || '#e7e5e4';
  const details = obj.details || {};

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          <RoundedBox args={[1, 1, 1]} radius={obj.radius ?? 0.16} smoothness={8} castShadow receiveShadow>
            <SoftMaterial color={color} />
          </RoundedBox>
          <mesh position={[0, 0.52, 0]} castShadow>
            <RoundedBox args={[1.02, 0.16, 1.02]} radius={0.14} smoothness={6}>
              <SoftMaterial color={roofColor} />
            </RoundedBox>
          </mesh>
          {details.crossSign && (
            <group position={[0.0, 0.24, 0.52]}>
              <mesh>
                <RoundedBox args={[0.08, 0.22, 0.04]} radius={0.02} smoothness={6}>
                  <meshStandardMaterial color={details.crossColor || '#E53935'} roughness={0.8} metalness={0.08} />
                </RoundedBox>
              </mesh>
              <mesh>
                <RoundedBox args={[0.22, 0.08, 0.04]} radius={0.02} smoothness={6}>
                  <meshStandardMaterial color={details.crossColor || '#E53935'} roughness={0.8} metalness={0.08} />
                </RoundedBox>
              </mesh>
            </group>
          )}
        </group>
      )}
    </RegisterRef>
  );
}

export function BuildingClusterObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const count = obj.count ?? 3;
  const spacing = obj.spacing ?? 0.9;
  const color = obj.buildingColor || '#DDEAD6';
  const heightRange = obj.heightRange || [1.4, 2.2];

  const heights = useMemo(() => {
    const [minH, maxH] = heightRange;
    return Array.from({ length: count }, (_, i) => minH + ((maxH - minH) * (0.25 + (i / Math.max(1, count - 1)) * 0.75)));
  }, [count, heightRange]);

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          {heights.map((h, i) => (
            <group key={i} position={[i * spacing, h / 2, 0]}>
              <RoundedBox args={[0.7, h, 0.7]} radius={0.14} smoothness={8} castShadow receiveShadow>
                <SoftMaterial color={color} />
              </RoundedBox>
              <mesh position={[0, h / 2 + 0.08, 0]}>
                <RoundedBox args={[0.74, 0.12, 0.74]} radius={0.12} smoothness={6}>
                  <meshStandardMaterial color="#e7e5e4" roughness={0.9} metalness={0.04} />
                </RoundedBox>
              </mesh>
            </group>
          ))}
        </group>
      )}
    </RegisterRef>
  );
}

export function DecorClusterObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const count = obj.count ?? 3;
  const color = obj.color || '#9BC2A6';

  const points = useMemo(() => (
    Array.from({ length: count }, (_, i) => [Math.cos(i * 2.1) * 0.65, 0, Math.sin(i * 2.1) * 0.5])
  ), [count]);

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          {points.map(([x, y, z], i) => (
            <group key={i} position={[x, 0, z]}>
              <mesh position={[0, 0.18, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.09, 0.26, 10]} />
                <meshStandardMaterial color="#8b5a2b" roughness={0.95} metalness={0.02} />
              </mesh>
              <mesh position={[0, 0.42, 0]} castShadow>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial color={color} roughness={0.9} metalness={0.03} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </RegisterRef>
  );
}

export function ParkClusterObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const count = obj.count ?? 4;
  const color = obj.color || '#A7C9A5';

  const points = useMemo(() => (
    Array.from({ length: count }, (_, i) => [Math.cos(i * 1.8) * 0.8, 0, Math.sin(i * 1.8) * 0.7])
  ), [count]);

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          {points.map(([x, y, z], i) => (
            <mesh key={i} position={[x, 0.07, z]} receiveShadow>
              <RoundedBox args={[0.8, 0.12, 0.6]} radius={0.18} smoothness={6}>
                <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
              </RoundedBox>
            </mesh>
          ))}
        </group>
      )}
    </RegisterRef>
  );
}

export function VehicleObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [1, 1, 1];
  const color = obj.color || '#ffffff';
  const accent = obj.accent || '#E53935';

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale} castShadow>
          {/* Body */}
          <RoundedBox args={[1.15, 0.32, 0.6]} radius={0.12} smoothness={8} castShadow receiveShadow>
            <SoftMaterial color={color} />
          </RoundedBox>
          {/* Cabin */}
          <group position={[0.18, 0.22, 0]}>
            <RoundedBox args={[0.55, 0.28, 0.55]} radius={0.12} smoothness={8} castShadow receiveShadow>
              <SoftMaterial color={accent} />
            </RoundedBox>
          </group>
          {/* Wheels */}
          {[-0.38, 0.38].map((x) => (
            <group key={x} position={[x, -0.18, 0]}>
              <mesh position={[0, 0, 0.26]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
                <meshStandardMaterial color="#1c1917" roughness={0.8} metalness={0.1} />
              </mesh>
              <mesh position={[0, 0, -0.26]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
                <meshStandardMaterial color="#1c1917" roughness={0.8} metalness={0.1} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </RegisterRef>
  );
}

export function CharacterObject({ obj, sceneStyle }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [1, 1, 1];
  const spec = minimalCharacterSpec;
  const role = obj.role || 'civilian';
  const roleVariant = spec?.roleVariants?.[role] || {};
  const parts = spec?.parts || {};

  const torsoColor = roleVariant.torsoColor || parts?.torso?.color || (sceneStyle?.accentSecondary || '#0F766E');
  const legsColor = roleVariant.legsColor || parts?.legs?.color || '#334155';
  const hairColor = roleVariant.hairColor || parts?.hair?.color || '#6B4F3A';
  const skinColor = parts?.head?.color || '#F2D1B3';

  const pose = spec?.poses?.[obj.pose || 'standingNeutral'] || spec?.poses?.standingNeutral || {};

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          {/* Torso */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <RoundedBox args={[0.34, 0.46, 0.22]} radius={0.14} smoothness={8}>
              <meshStandardMaterial color={torsoColor} roughness={0.92} metalness={0.05} />
            </RoundedBox>
          </mesh>
          {/* Head */}
          <group position={[0, 0.66, 0]} rotation={pose.headRotation || [0, 0, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.92} metalness={0.02} />
            </mesh>
            <mesh position={[0, 0.08, 0]} castShadow>
              <sphereGeometry args={[0.17, 16, 16]} />
              <meshStandardMaterial color={hairColor} roughness={0.95} metalness={0.02} />
            </mesh>
            {spec?.face?.eyes?.enabled && (
              <>
                <mesh position={[-0.06, 0.02, 0.15]}>
                  <sphereGeometry args={[0.018, 10, 10]} />
                  <meshStandardMaterial color={spec.face.eyes.color || '#111827'} roughness={1} metalness={0} />
                </mesh>
                <mesh position={[0.06, 0.02, 0.15]}>
                  <sphereGeometry args={[0.018, 10, 10]} />
                  <meshStandardMaterial color={spec.face.eyes.color || '#111827'} roughness={1} metalness={0} />
                </mesh>
              </>
            )}
          </group>
          {/* Legs */}
          <mesh position={[-0.08, 0.08, 0]} rotation={pose.legLeftRotation || [0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.26, 6, 10]} />
            <meshStandardMaterial color={legsColor} roughness={0.9} metalness={0.06} />
          </mesh>
          <mesh position={[0.08, 0.08, 0]} rotation={pose.legRightRotation || [0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.26, 6, 10]} />
            <meshStandardMaterial color={legsColor} roughness={0.9} metalness={0.06} />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.24, 0.32, 0]} rotation={pose.armLeftRotation || [0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.26, 6, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.92} metalness={0.02} />
          </mesh>
          <mesh position={[0.24, 0.32, 0]} rotation={pose.armRightRotation || [0, 0, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.26, 6, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.92} metalness={0.02} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

export function BeaconObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const scale = obj.scale || [1, 1, 1];
  const color = obj.color || '#E53935';

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position} scale={scale}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.24, 0.42, 20]} />
            <meshStandardMaterial color="#1c1917" roughness={0.75} metalness={0.12} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.24, 20, 20]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.22} roughness={0.5} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.05, 12, 36]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} roughness={0.6} metalness={0.2} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

export function PinsObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const count = obj.count ?? 3;
  const color = obj.color || '#0F766E';
  const points = useMemo(() => {
    const out = [];
    for (let i = 0; i < count; i += 1) {
      out.push([Math.cos(i * 2.2) * 0.35, 0, Math.sin(i * 2.2) * 0.25]);
    }
    return out;
  }, [count]);

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          {points.map(([x, y, z], i) => (
            <group key={i} position={[x, 0, z]}>
              <mesh>
                <coneGeometry args={[0.12, 0.34, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} roughness={0.55} metalness={0.15} />
              </mesh>
              <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.05, 16]} />
                <meshStandardMaterial color="#1c1917" roughness={0.8} metalness={0.08} />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </RegisterRef>
  );
}

export function PathObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const color = obj.color || '#D1D5DB';

  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(-2.6, 0, 1.2),
      new THREE.Vector3(-1.4, 0, 0.7),
      new THREE.Vector3(0.1, 0, 0.2),
      new THREE.Vector3(1.6, 0, -0.6),
      new THREE.Vector3(2.4, 0, -1.1),
    ];
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  }, []);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 50, 0.06, 10, false), [curve]);

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          <mesh geometry={geometry} position={[0, 0.02, 0]} receiveShadow>
            <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

export function MarkerObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const color = obj.color || '#E53935';

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          <mesh castShadow>
            <coneGeometry args={[0.18, 0.52, 18]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} roughness={0.55} metalness={0.18} />
          </mesh>
          <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 18]} />
            <meshStandardMaterial color="#1c1917" roughness={0.85} metalness={0.05} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

export function MarkerVehicleObject({ obj }) {
  const position = obj.position || [0, 0, 0];
  const color = obj.color || '#0EA5E9';

  return (
    <RegisterRef id={obj.id}>
      {(ref) => (
        <group ref={ref} position={position}>
          <mesh castShadow>
            <RoundedBox args={[0.62, 0.24, 0.36]} radius={0.1} smoothness={8}>
              <meshStandardMaterial color={color} roughness={0.8} metalness={0.06} />
            </RoundedBox>
          </mesh>
          <mesh position={[0, 0.24, 0]} castShadow>
            <coneGeometry args={[0.12, 0.28, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.02} />
          </mesh>
        </group>
      )}
    </RegisterRef>
  );
}

