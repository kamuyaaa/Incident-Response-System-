import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function ModelCanvas({ children, height = 320, className }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true }}
      >
        {/* Consistent base lighting for all scenes */}
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.1} position={[4, 6, 4]} />
        <directionalLight intensity={0.3} position={[-3, 3, -4]} color="#dbeafe" />

        <Suspense fallback={null}>{children}</Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={2}
          maxDistance={8}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  );
}

