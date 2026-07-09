export const MEL_LOGO_GRID = 16;
export const MEL_LOGO_CENTER = 7.5;
export const MEL_LOGO_OUTER_RADIUS = 7.5;
export const MEL_LOGO_COLOR = "#34d399";

export function melLogoGlowFilter(color: string): string {
  return `drop-shadow(0 0 2px color-mix(in srgb, ${color} 50%, transparent))`;
}

const CENTER = MEL_LOGO_CENTER;
const OUTER_RADIUS = MEL_LOGO_OUTER_RADIUS;
const INNER_RADIUS = 6.25;

function pixelDistance(x: number, y: number): number {
  const dx = x + 0.5 - CENTER;
  const dy = y + 0.5 - CENTER;
  return Math.hypot(dx, dy);
}

function isOnCircleRing(x: number, y: number): boolean {
  const distance = pixelDistance(x, y);
  return distance <= OUTER_RADIUS && distance >= INNER_RADIUS;
}

/** Four-point pixel star centered in the circular badge. */
const INNER_STAR: ReadonlyArray<readonly [number, number]> = [
  [7, 2],
  [6, 3],
  [7, 3],
  [8, 3],
  [5, 4],
  [6, 4],
  [7, 4],
  [8, 4],
  [9, 4],
  [6, 5],
  [7, 5],
  [8, 5],
  [4, 6],
  [7, 6],
  [10, 6],
  [3, 7],
  [7, 7],
  [11, 7],
  [4, 8],
  [7, 8],
  [10, 8],
  [6, 9],
  [7, 9],
  [8, 9],
  [5, 10],
  [6, 10],
  [7, 10],
  [8, 10],
  [9, 10],
  [7, 11],
] as const;

function buildCircularLogoPixels(): ReadonlyArray<readonly [number, number]> {
  const seen = new Set<string>();
  const pixels: Array<readonly [number, number]> = [];

  const add = (x: number, y: number) => {
    const key = `${x},${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    pixels.push([x, y]);
  };

  for (let y = 0; y < MEL_LOGO_GRID; y++) {
    for (let x = 0; x < MEL_LOGO_GRID; x++) {
      if (isOnCircleRing(x, y)) add(x, y);
    }
  }

  for (const [x, y] of INNER_STAR) {
    if (pixelDistance(x, y) <= INNER_RADIUS) add(x, y);
  }

  return pixels;
}

export const MEL_LOGO_PIXELS = buildCircularLogoPixels();
