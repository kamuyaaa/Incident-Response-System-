import hospitalConfig from '../../../config/scenes/hospital-emergency-cluster.json';
import { SceneCanvas } from '../json/SceneCanvas';

export function JsonHospitalEmergencyCluster() {
  return (
    <SceneCanvas
      config={hospitalConfig}
      className="rounded-xl overflow-hidden"
      fallbackClassName="absolute inset-0 rounded-xl overflow-hidden"
      entrance={{ from: { opacity: 0, scale: 0.97, y: 14 }, to: { opacity: 1, scale: 1, y: 0, duration: 0.95, ease: 'power2.out' } }}
    />
  );
}

