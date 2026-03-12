import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TrackingSupportScene } from './scenes/TrackingSupportScene';

/**
 * Lazy-loaded small Canvas for tracking/map section.
 */
function TrackingCanvasContent() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[1.5, 1.5, 1.5]} intensity={0.7} />
      <TrackingSupportScene />
    </>
  );
}

export function Section3DTracking() {
  return (
    <div className="w-full h-full min-h-[180px] flex items-center justify-center bg-ers-subtle/40 rounded-b-xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 1.4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        className="w-full h-full"
      >
        <color attach="background" args={['transparent']} />
        <Suspense fallback={null}>
          <TrackingCanvasContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
