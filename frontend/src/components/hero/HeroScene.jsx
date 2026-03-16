import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroBackground } from './HeroBackground';

export function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 2], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        className="w-full h-full"
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={0.6} />
        <Suspense fallback={null}>
          <HeroBackground />
        </Suspense>
      </Canvas>
    </div>
  );
}
