import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { SceneRegistryProvider, useSceneRegistry } from './SceneRegistry';
import {
  Ground,
  BoxObject,
  RoundedBoxObject,
  CylinderObject,
  RoadObject,
  PlatformObject,
  VehicleObject,
  CharacterObject,
  BeaconObject,
  PinsObject,
  PathObject,
  MarkerObject,
  MarkerVehicleObject,
  BuildingObject,
  BuildingClusterObject,
  DecorClusterObject,
  ParkClusterObject,
} from './ScenePrimitives';
import { applySceneAnimations } from './sceneGsap';

function SceneRoot({ config }) {
  const rootRef = useRef(null);
  const { setSceneRoot } = useSceneRegistry();
  const { camera } = useThree();

  useEffect(() => {
    if (rootRef.current) setSceneRoot(rootRef);
  }, [setSceneRoot]);

  useEffect(() => {
    const cam = config?.camera;
    if (!cam) return;
    if (Array.isArray(cam.position)) camera.position.set(cam.position[0], cam.position[1], cam.position[2]);
    camera.fov = cam.fov ?? camera.fov;
    camera.updateProjectionMatrix();
    if (Array.isArray(cam.lookAt)) camera.lookAt(cam.lookAt[0], cam.lookAt[1], cam.lookAt[2]);
  }, [camera, config]);

  const objects = config?.objects || [];
  const ground = config?.ground;
  const style = config?.style || {};

  const renderObject = (obj) => {
    if (!obj?.type) return null;
    if (obj.type === 'group') {
      return (
        <group key={obj.id} position={obj.position || [0, 0, 0]}>
          {(obj.children || []).map(renderObject)}
        </group>
      );
    }
    if (obj.type === 'box') return <BoxObject key={obj.id} obj={obj} />;
    if (obj.type === 'roundedBox') return <RoundedBoxObject key={obj.id} obj={obj} />;
    if (obj.type === 'cylinder') return <CylinderObject key={obj.id} obj={obj} />;
    if (obj.type === 'road') return <RoadObject key={obj.id} obj={obj} />;
    if (obj.type === 'platform') return <PlatformObject key={obj.id} obj={obj} />;
    if (obj.type === 'vehicle') return <VehicleObject key={obj.id} obj={obj} />;
    if (obj.type === 'character') return <CharacterObject key={obj.id} obj={obj} sceneStyle={style} />;
    if (obj.type === 'beacon') return <BeaconObject key={obj.id} obj={obj} />;
    if (obj.type === 'pins') return <PinsObject key={obj.id} obj={obj} />;
    if (obj.type === 'path') return <PathObject key={obj.id} obj={obj} />;
    if (obj.type === 'marker') return <MarkerObject key={obj.id} obj={obj} />;
    if (obj.type === 'markerVehicle') return <MarkerVehicleObject key={obj.id} obj={obj} />;
    if (obj.type === 'building') return <BuildingObject key={obj.id} obj={obj} />;
    if (obj.type === 'buildingCluster') return <BuildingClusterObject key={obj.id} obj={obj} />;
    if (obj.type === 'decorCluster') return <DecorClusterObject key={obj.id} obj={obj} />;
    if (obj.type === 'parkCluster') return <ParkClusterObject key={obj.id} obj={obj} />;
    return null;
  };

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {ground && <Ground ground={ground} />}
      {objects.map(renderObject)}
    </group>
  );
}

export function JsonSceneRenderer({ config, onRegistryReady }) {
  const normalized = useMemo(() => config, [config]);

  return (
    <SceneRegistryProvider onReady={onRegistryReady}>
      <SceneRoot config={normalized} />
    </SceneRegistryProvider>
  );
}

export { applySceneAnimations };

