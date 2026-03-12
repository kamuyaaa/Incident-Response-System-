import { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroSceneWrapper } from '../three/HeroSceneWrapper';

const FALLBACK = (
  <div className="absolute inset-0 bg-gradient-to-br from-ers-surface to-ers-subtle/80 rounded-xl" aria-hidden />
);

export function HeroSceneLanding() {
  const [error, setError] = useState(false);

  const onCreated = useCallback((state) => {
    const gl = state.gl;
    const canvas = gl.domElement;
    if (canvas && !canvas.getContext('webgl2') && !canvas.getContext('webgl')) {
      setError(true);
    }
  }, []);

  if (error) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/90 to-ers-elevated" />
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <div className="w-24 h-24 rounded-full border-2 border-ers-subtle border-t-emergency-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0.05, 0.02, 2.6], fov: 38 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high' }}
        onCreated={onCreated}
        className="w-full h-full"
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[2.2, 2, 3]} intensity={0.85} />
        <directionalLight position={[-1.5, 0.8, 2]} intensity={0.2} />
        <pointLight position={[0.3, 0.15, 1.2]} intensity={0.15} color="#faf8f5" />
        <Suspense fallback={FALLBACK}>
          <HeroSceneWrapper />
        </Suspense>
      </Canvas>
    </div>
  );
}
