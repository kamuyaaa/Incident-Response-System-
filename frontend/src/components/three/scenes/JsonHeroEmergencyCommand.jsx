import heroConfig from '../../../config/scenes/hero-emergency-command-scene.json';
import { SceneCanvas } from '../json/SceneCanvas';

export function JsonHeroEmergencyCommand() {
  return (
    <SceneCanvas
      config={heroConfig}
      className="rounded-xl overflow-hidden"
      fallbackClassName="absolute inset-0 rounded-xl overflow-hidden"
      entrance={heroConfig?.gsap?.heroEntrance?.scene}
    />
  );
}

