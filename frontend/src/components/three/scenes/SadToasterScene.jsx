import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ModelCanvas } from '../ModelCanvas';
import { GenericGLTFModel } from '../GenericGLTFModel';

export function SadToasterScene() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = -0.35 + Math.sin(t * 0.5) * 0.02;
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.05;
  });

  return (
    <ModelCanvas height={200}>
      <ambientLight intensity={0.75} />
      <directionalLight intensity={0.9} position={[3, 4, 3]} />

      <GenericGLTFModel
        ref={groupRef}
        path="/models/sad_toaster/scene.gltf"
        scale={0.9}
        position={[0, -0.35, 0]}
      />
    </ModelCanvas>
  );
}

