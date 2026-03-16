import kenyaCityConfig from '../../../config/scenes/kenya-city-block-scene.json';
import { SceneCanvas } from '../json/SceneCanvas';

export function JsonKenyaCityBlock() {
  return (
    <SceneCanvas
      config={kenyaCityConfig}
      className="rounded-xl overflow-hidden"
      fallbackClassName="absolute inset-0 rounded-xl overflow-hidden"
      entrance={{ from: { opacity: 0, scale: 0.97, y: 14 }, to: { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power2.out' } }}
    />
  );
}

