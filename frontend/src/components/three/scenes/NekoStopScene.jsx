import React from 'react';
import { Float } from '@react-three/drei';
import { ModelCanvas } from '../ModelCanvas';
import { GenericGLTFModel } from '../GenericGLTFModel';

export function NekoStopScene() {
  return (
    <ModelCanvas height={340}>
      <ambientLight intensity={0.85} />
      <directionalLight intensity={0.9} position={[3, 5, 4]} />
      <directionalLight intensity={0.25} position={[-3, 2, -3]} color="#d1d5db" />

      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.15}>
        <GenericGLTFModel
          path="/models/the_neko_stop-off__-_hand-painted_diorama/scene.gltf"
          scale={0.55}
          position={[0, -0.7, 0]}
          rotation={[0, Math.PI * 0.1, 0]}
        />
      </Float>
    </ModelCanvas>
  );
}

