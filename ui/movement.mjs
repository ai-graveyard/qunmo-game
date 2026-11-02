// Positions are percentages of the world width. Rendering stays in app.mjs.
export function stepMovement(x, keys, target, dt, active) {
  if (!active) return { x, dir: 0, target, arrived: null };
  let dir =
    Number(keys.has('ArrowRight') || keys.has('d') || keys.has('D')) -
    Number(keys.has('ArrowLeft') || keys.has('a') || keys.has('A'));
  const manual = dir !== 0;
  if (manual) target = null;
  if (!dir && target) {
    const distance = target.x - x;
    if (Math.abs(distance) < 0.55) return { x: target.x, dir: 0, target: null, arrived: target };
    dir = Math.sign(distance);
  }
  let next = x + dir * Math.min(Math.max(dt, 0), 0.25) * (keys.has('Shift') ? 31 : 20);
  if (target && Math.sign(target.x - next) !== Math.sign(target.x - x)) next = target.x;
  return { x: Math.max(6, Math.min(94, next)), dir, target, arrived: null, manual };
}

export function cameraTarget(x, worldWidth, viewWidth) {
  return Math.max(0, Math.min(worldWidth - viewWidth, (x / 100) * worldWidth - viewWidth * 0.4));
}
