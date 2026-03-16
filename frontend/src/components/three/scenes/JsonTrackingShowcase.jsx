import trackingConfig from '../../../config/scenes/tracking-showcase-scene.json';
import { SceneCanvas } from '../json/SceneCanvas';

export function JsonTrackingShowcase() {
  return (
    <SceneCanvas
      config={trackingConfig}
      className="rounded-xl overflow-hidden"
      fallbackClassName="absolute inset-0 rounded-xl overflow-hidden"
      entrance={{ from: { opacity: 0, scale: 0.96, y: 18 }, to: { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power2.out' } }}
    />
  );
}

