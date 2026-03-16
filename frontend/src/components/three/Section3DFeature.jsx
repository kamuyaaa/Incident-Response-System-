import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FeatureSupportScene } from './scenes/FeatureSupportScene';

/**
 * Lazy-loaded small Canvas for feature section. Single scene, low dpr.
 */
function FeatureCanvasContent() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 2, 2]} intensity={0.6} />
      <FeatureSupportScene />
    </>
  );
}

export function Section3DFeature() {
  return (
    <div className="w-full h-full min-h-[120px] flex items-center justify-center bg-ers-surface/60 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        className="w-full h-full"
      >
        <color attach="background" args={['transparent']} />
        <Suspense fallback={null}>
          <FeatureCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
