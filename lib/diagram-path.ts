type Position = { x: number; y: number };

/** Connect the facing ports, including a right-to-left return/delivery path. */
export function edgePath(from: Position, to: Position) {
  const dx = to.x - from.x,
    dy = to.y - from.y;
  if (Math.abs(dy) < 45) {
    const direction = dx < 0 ? -1 : 1;
    return `M${from.x + direction * 70} ${from.y}L${to.x - direction * 70} ${to.y}`;
  }
  const direction = dy > 0 ? 1 : -1;
  return `M${from.x} ${from.y + direction * 34}V${from.y + dy * 0.45}Q${from.x} ${from.y + dy * 0.6} ${from.x + dx * 0.3} ${from.y + dy * 0.6}H${to.x - dx * 0.2}Q${to.x} ${from.y + dy * 0.6} ${to.x} ${from.y + dy * 0.8}V${to.y - direction * 34}`;
}
