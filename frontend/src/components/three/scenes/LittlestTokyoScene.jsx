import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ModelCanvas } from '../ModelCanvas';
import { GenericGLTFModel } from '../GenericGLTFModel';

export function LittlestTokyoScene() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = -0.55 + Math.sin(t * 0.6) * 0.04;
  });

  return (
    <ModelCanvas height={360}>
      <ambientLight intensity={0.9} />
      <directionalLight intensity={1.25} position={[4, 7, 5]} />
      <directionalLight intensity={0.4} position={[-5, 3, -4]} color="#88b4ff" />

      <GenericGLTFModel
        ref={groupRef}
        path="/models/littlest_tokyo_sunset_-_3d_editor_challenge/scene.gltf"
        scale={0.6}
        position={[0, -0.55, 0]}
      />
    </ModelCanvas>
  );
}

