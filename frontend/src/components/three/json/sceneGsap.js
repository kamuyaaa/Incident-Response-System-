import gsap from 'gsap';

function getRef(refs, id) {
  if (!id) return null;
  return refs?.get(id) || null;
}

function applyFloatToObject({ obj, y, duration, repeat, yoyo, ease }) {
  if (!obj) return;
  gsap.to(obj.position, {
    y: obj.position.y + (y ?? 0.08),
    duration: duration ?? 3.8,
    repeat: repeat ?? -1,
    yoyo: yoyo ?? true,
    ease: ease ?? 'sine.inOut',
  });
}

function applyBeaconPulse({ refs, target, scale, duration, repeat, ease }) {
  const ref = getRef(refs, target);
  const obj = ref?.current || null;
  if (!obj) return;
  const seq = Array.isArray(scale) ? scale : [1, 1.12, 1];
  gsap.to(obj.scale, {
    x: seq[1],
    y: seq[1],
    z: seq[1],
    duration: duration ?? 1.2,
    repeat: repeat ?? -1,
    yoyo: true,
    ease: ease ?? 'power1.inOut',
  });
}

function applyVehicleBob({ refs, targets, y, duration, stagger, repeat, yoyo }) {
  const ids = Array.isArray(targets) ? targets : [];
  const objs = ids
    .map((id) => getRef(refs, id)?.current)
    .filter(Boolean);
  if (objs.length === 0) return;
  gsap.to(
    objs.map((o) => o.position),
    { y: `+=${y ?? 0.04}`, duration: duration ?? 2.4, stagger: stagger ?? 0.2, repeat: repeat ?? -1, yoyo: yoyo ?? true, ease: 'sine.inOut' }
  );
}

function applyMarkerPulse({ refs, target, scale, duration, repeat, yoyo }) {
  const ref = getRef(refs, target);
  const obj = ref?.current || null;
  if (!obj) return;
  const seq = Array.isArray(scale) ? scale : [1, 1.16, 1];
  gsap.to(obj.scale, { x: seq[1], y: seq[1], z: seq[1], duration: duration ?? 1, repeat: repeat ?? -1, yoyo: yoyo ?? true, ease: 'sine.inOut' });
}

function applyMultiPulse({ refs, targets, scale, duration, repeat, yoyo, stagger }) {
  const ids = Array.isArray(targets) ? targets : [];
  const objs = ids.map((id) => getRef(refs, id)?.current).filter(Boolean);
  if (objs.length === 0) return;
  const seq = Array.isArray(scale) ? scale : [1, 1.14, 1];
  gsap.to(objs.map((o) => o.scale), {
    x: seq[1],
    y: seq[1],
    z: seq[1],
    duration: duration ?? 1.15,
    repeat: repeat ?? -1,
    yoyo: yoyo ?? true,
    stagger: stagger ?? 0.16,
    ease: 'sine.inOut',
  });
}

function applyMoveHint({ refs, target, x, duration, repeat, yoyo }) {
  const ref = getRef(refs, target);
  const obj = ref?.current || null;
  if (!obj) return;
  gsap.to(obj.position, { x: `+=${x ?? 0.12}`, duration: duration ?? 1.8, repeat: repeat ?? -1, yoyo: yoyo ?? true, ease: 'sine.inOut' });
}

export function applySceneAnimations(config, registry) {
  const refs = registry?.refs;
  const sceneRootRef = registry?.sceneRoot;
  const sceneRoot = sceneRootRef?.current || null;
  if (!refs) return () => {};

  const animations = config?.animations || {};
  const ctx = gsap.context(() => {
    if (sceneRoot) {
      const floatKey = animations.floatGroup || animations.sceneFloat || animations.clusterFloat;
      if (floatKey) applyFloatToObject({ obj: sceneRoot, ...floatKey });
    }
    if (animations.beaconPulse) applyBeaconPulse({ refs, ...animations.beaconPulse });
    if (animations.vehicleBob) applyVehicleBob({ refs, ...animations.vehicleBob });
    if (animations.vehiclesBob) applyVehicleBob({ refs, ...animations.vehiclesBob });
    if (animations.ambulanceBob) applyVehicleBob({ refs, ...animations.ambulanceBob });
    if (animations.markerPulse) applyMarkerPulse({ refs, ...animations.markerPulse });
    if (animations.pinsPulse) applyMultiPulse({ refs, ...animations.pinsPulse });
    if (animations.responderMoveHint) applyMoveHint({ refs, ...animations.responderMoveHint });
  });

  return () => ctx.revert();
}

