import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

const SceneRegistryContext = createContext(null);

export function SceneRegistryProvider({ children, onReady }) {
  const refsMapRef = useRef(new Map());
  const sceneRootRef = useRef(null);

  const register = useCallback((id, ref) => {
    if (!id || !ref) return;
    refsMapRef.current.set(id, ref);
  }, []);

  const setSceneRoot = useCallback((ref) => {
    sceneRootRef.current = ref;
    if (typeof onReady === 'function') {
      onReady({ refs: refsMapRef.current, sceneRoot: sceneRootRef });
    }
  }, [onReady]);

  const value = useMemo(() => ({
    register,
    refs: refsMapRef,
    sceneRoot: sceneRootRef,
    setSceneRoot,
  }), [register, setSceneRoot]);

  return (
    <SceneRegistryContext.Provider value={value}>
      {children}
    </SceneRegistryContext.Provider>
  );
}

export function useSceneRegistry() {
  const ctx = useContext(SceneRegistryContext);
  if (!ctx) throw new Error('useSceneRegistry must be used within SceneRegistryProvider');
  return ctx;
}

