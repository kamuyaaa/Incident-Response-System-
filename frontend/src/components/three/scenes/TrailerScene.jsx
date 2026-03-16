import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ModelCanvas } from '../ModelCanvas';
import { GenericGLTFModel } from '../GenericGLTFModel';

export function TrailerScene() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
  });

  return (
    <ModelCanvas height={300}>
      <ambientLight intensity={0.7} />
      <directionalLight intensity={1.1} position={[4, 6, 3]} />
      <directionalLight intensity={0.25} position={[-3, 3, -4]} color="#e5e7eb" />

      <GenericGLTFModel
        ref={groupRef}
        path="/models/trailer/scene.gltf"
        scale={0.9}
        position={[0, -0.5, 0]}
        rotation={[0, Math.PI * 0.05, 0]}
      />
    </ModelCanvas>
  );
}

