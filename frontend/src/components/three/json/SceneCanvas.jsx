import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { JsonSceneRenderer, applySceneAnimations } from './JsonSceneRenderer';

const DefaultFallback = ({ className }) => (
  <div className={className} aria-hidden>
    <div className="absolute inset-0 bg-gradient-to-br from-ers-surface via-ers-subtle/90 to-ers-elevated" />
    <div className="absolute inset-0 flex items-center justify-center opacity-50">
      <div className="w-20 h-20 rounded-full border-2 border-ers-subtle border-t-emergency-600 animate-spin" />
    </div>
  </div>
);

function CanvasProbe({ onReady }) {
  const { gl, camera } = useThree();

  useEffect(() => {
    // If this runs, the Canvas mounted and WebGL renderer exists.
    if (typeof onReady === 'function') onReady({ gl, camera });

    // Ensure camera points at scene origin in case config lookAt is missing/late.
    camera.lookAt(0, 1, 0);
    camera.updateProjectionMatrix();
  }, [camera, gl, onReady]);

  return null;
}

export function SceneCanvas({
  config,
  className = '',
  fallbackClassName = 'absolute inset-0 rounded-xl overflow-hidden',
  entrance,
}) {
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(false);
  const shellRef = useRef(null);
  const registryRef = useRef(null);

  const style = config?.style || {};
  const camera = config?.camera || {};

  const onRegistryReady = useCallback((registry) => {
    registryRef.current = registry;
  }, []);

  // Apply JSON animations once scene registry is ready.
  useEffect(() => {
    if (!config || !registryRef.current?.refs || !registryRef.current?.sceneRoot) return undefined;
    return applySceneAnimations(config, registryRef.current);
  }, [config]);

  // GSAP entrance: wrapper opacity + sceneRoot transform (scale + y).
  useEffect(() => {
    const shell = shellRef.current;
    const sceneRoot = registryRef.current?.sceneRoot?.current;
    if (!shell || !entrance || !sceneRoot) return;

    const from = entrance.from || { opacity: 0, scale: 0.92, y: 24 };
    const to = entrance.to || { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' };

    gsap.fromTo(shell, { opacity: from.opacity ?? 0 }, { opacity: to.opacity ?? 1, duration: to.duration ?? 1.1, ease: to.ease ?? 'power3.out' });
    gsap.fromTo(
      sceneRoot.position,
      { y: (sceneRoot.position.y ?? 0) + ((from.y ?? 0) / 100) },
      { y: sceneRoot.position.y ?? 0, duration: to.duration ?? 1.1, ease: to.ease ?? 'power3.out' }
    );
    gsap.fromTo(
      sceneRoot.scale,
      { x: from.scale ?? 0.92, y: from.scale ?? 0.92, z: from.scale ?? 0.92 },
      { x: to.scale ?? 1, y: to.scale ?? 1, z: to.scale ?? 1, duration: to.duration ?? 1.1, ease: to.ease ?? 'power3.out' }
    );
  }, [entrance]);

  const onCreated = useCallback((state) => {
    const gl = state.gl;
    const canvas = gl.domElement;
    if (canvas && !canvas.getContext('webgl2') && !canvas.getContext('webgl')) setError(true);
    setCreated(true);
  }, []);

  const lights = config?.lights || {};

  const canvasCamera = useMemo(() => ({
    position: camera.position || [7, 5, 9],
    fov: camera.fov ?? 32,
  }), [camera.fov, camera.position]);

  if (error) return <DefaultFallback className={fallbackClassName} />;

  return (
    <div
      ref={shellRef}
      className={`absolute inset-0 pointer-events-none ${className} relative`}
      aria-hidden
    >
      {/* Force-visible backdrop so we can confirm canvas area */}
      <div
        className="absolute inset-0"
        style={{ background: style.background || '#FFF8F1' }}
      />
      <div className="absolute left-2 top-2 z-10 text-[10px] text-ers-inkTertiary bg-ers-elevated/80 border border-ers-subtle rounded px-2 py-1">
        scene: {config?.sceneId || 'unknown'} · webgl: {created ? 'ok' : '…'}
      </div>
      <Canvas
        camera={canvasCamera}
        dpr={[1, 2]}
        shadows
        gl={{ alpha: true, antialias: true, powerPreference: 'high' }}
        onCreated={onCreated}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <CanvasProbe onReady={() => setCreated(true)} />
        <color attach="background" args={[style.background || '#FFF8F1']} />

        {/* Lights (from JSON) */}
        {lights.ambient && <ambientLight intensity={lights.ambient.intensity ?? 1} color={lights.ambient.color || '#ffffff'} />}
        {lights.directional && (
          <directionalLight
            position={lights.directional.position || [6, 8, 4]}
            intensity={lights.directional.intensity ?? 1.6}
            color={lights.directional.color || '#fff7ed'}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
        )}
        {lights.fill && (
          <directionalLight
            position={lights.fill.position || [-4, 4, -3]}
            intensity={lights.fill.intensity ?? 0.6}
            color={lights.fill.color || '#dbeafe'}
          />
        )}
        {lights.rim && (
          <directionalLight
            position={lights.rim.position || [-4, 5, -2]}
            intensity={lights.rim.intensity ?? 0.6}
            color={lights.rim.color || '#dbeafe'}
          />
        )}

        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial color="#E53935" roughness={0.6} metalness={0.1} />
        </mesh>

        <Suspense fallback={null}>
          <JsonSceneRenderer config={config} onRegistryReady={onRegistryReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

