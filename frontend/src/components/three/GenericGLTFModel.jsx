import React, { useMemo, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

export const GenericGLTFModel = forwardRef(function GenericGLTFModel(
  { path, scale = 1, ...groupProps },
  ref
) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <group ref={ref} {...groupProps} dispose={null}>
      <primitive object={clonedScene} scale={scale} />
    </group>
  );
});

