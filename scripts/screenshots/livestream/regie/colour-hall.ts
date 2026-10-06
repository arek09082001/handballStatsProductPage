/**
 * The app's synthetic test hall (`lib/testing/synthetic-hall.ts`) in colour.
 *
 * Same hall, same rig and the same fisheye camera model the panorama stitch
 * assumes — only `paint` is new: the court in the board's blue, white lines
 * with goal areas and dashed 9 m arcs, coloured advertising boards, a crowd
 * on the stands and lamps on the ceiling. The geometry stays the app's, so
 * "Automatisch ausrichten" in the real dialog finds the seam on its own.
 */
import { hallRig, pixelRay, type HallCamera, type Vec3 } from '@/lib/testing/synthetic-hall';

type Rgb = [number, number, number];

const HALL = { minX: -22, maxX: 22, nearZ: -2, farZ: 24, ceiling: 10 };
const COURT = { minX: -20, maxX: 20, nearZ: 1, farZ: 21 };
const MID_Z = 11;
const LINE = 0.09;

function hash(i: number, j: number, seed: number): number {
  let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ Math.imul(seed, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function blotches(p: number, q: number, cell: number, seed: number): number {
  const x = p / cell;
  const y = q / cell;
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(i, j, seed);
  const b = hash(i + 1, j, seed);
  const c = hash(i, j + 1, seed);
  const d = hash(i + 1, j + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const shade = (c: Rgb, f: number): Rgb => [c[0] * f, c[1] * f, c[2] * f];

/** Distance from the goal-area "D": the segment between the posts, grown by r. */
function goalDistance(x: number, z: number, goalX: number): { d: number; angle: number } {
  const zc = Math.min(Math.max(z, MID_Z - 1.5), MID_Z + 1.5);
  const d = Math.hypot(x - goalX, z - zc);
  return { d, angle: Math.atan2(z - zc, Math.abs(x - goalX)) };
}

const BOARD_COLOURS: Rgb[] = [
  [0.96, 0.45, 0.11],
  [0.95, 0.95, 0.93],
  [0.15, 0.39, 0.92],
  [0.1, 0.12, 0.16],
  [0.98, 0.75, 0.15],
  [0.12, 0.55, 0.35],
];

function paintFloor(x: number, z: number): Rgb {
  const inCourt = x >= COURT.minX && x <= COURT.maxX && z >= COURT.nearZ && z <= COURT.farZ;
  const grain = 0.04 * Math.sin(x * 9.1 + Math.sin(z * 1.7) * 2.2) + 0.03 * Math.sin(z * 23 + x * 0.4);
  let base: Rgb = inCourt ? [0.13, 0.4, 0.48] : [0.1, 0.27, 0.33];
  const white: Rgb = [0.96, 0.96, 0.93];
  let line = false;
  if (inCourt) {
    if (
      Math.abs(x - COURT.minX) < LINE * 1.4 ||
      Math.abs(x - COURT.maxX) < LINE * 1.4 ||
      Math.abs(x) < LINE ||
      Math.abs(z - COURT.nearZ) < LINE ||
      Math.abs(z - COURT.farZ) < LINE
    ) {
      line = true;
    }
    for (const goalX of [COURT.minX, COURT.maxX]) {
      const { d, angle } = goalDistance(x, z, goalX);
      if (d < 6) base = [0.16, 0.48, 0.57];
      if (Math.abs(d - 6) < LINE) line = true;
      // 9 m: dashed, 15 cm dashes in the board's rhythm.
      if (Math.abs(d - 9) < LINE && Math.sin(angle * 9 * 6) > 0) line = true;
      // 7 m mark and 4 m keeper line.
      if (Math.abs(Math.abs(x - goalX) - 7) < LINE && Math.abs(z - MID_Z) < 0.5) line = true;
      if (Math.abs(Math.abs(x - goalX) - 4) < LINE && Math.abs(z - MID_Z) < 0.075) line = true;
    }
  }
  if (line) return white;
  // A few blotches like players and marks on the floor — texture the seam search can hold on to.
  const spots = blotches(x, z, 0.9, 11) > 0.85 ? -0.05 : 0;
  return shade(base, 1 + grain + spots);
}

function paintWall(along: number, height: number, seed: number): Rgb {
  const wall: Rgb = [0.11, 0.17, 0.22];
  // Pillars every 4 m — the strong verticals the image is levelled on.
  if (Math.abs((((along % 4) + 4) % 4) - 2) < 0.2) return [0.06, 0.09, 0.12];
  if (height > 0.25 && height < 1.25) {
    const slot = Math.floor((along + 100) / 3);
    const colour = BOARD_COLOURS[Math.floor(hash(slot, 3, seed) * BOARD_COLOURS.length)];
    const ink = blotches(along, height, 0.16, seed) > 0.66 && height > 0.45 && height < 1.05;
    return ink ? mix(colour, [1, 1, 1], colour[0] + colour[1] + colour[2] > 2 ? -0.6 : 0.7) : colour;
  }
  if (height > 2.6 && height < 6.2) {
    // The stands: people in every colour on a dark tribune.
    const n = blotches(along, height, 0.26, seed + 1);
    const pick = hash(Math.floor(along / 0.3), Math.floor(height / 0.35), seed + 2);
    const shirts: Rgb[] = [[0.9, 0.38, 0.12], [0.22, 0.45, 0.9], [0.92, 0.9, 0.86], [0.95, 0.75, 0.2], [0.75, 0.2, 0.22], [0.3, 0.6, 0.45]];
    const person = shirts[Math.floor(pick * shirts.length)];
    return n > 0.48 ? shade(person, 0.6 + 0.5 * (n - 0.48)) : [0.13, 0.15, 0.19];
  }
  return shade(wall, 1 + 0.08 * Math.sin(along * 0.7 + height));
}

function paintCeiling(x: number, z: number): Rgb {
  const lamp =
    Math.abs((((x % 4) + 4) % 4) - 2) < 0.4 && Math.abs((((z % 6) + 6) % 6) - 3) < 1.2;
  return lamp ? [1, 0.98, 0.9] : [0.07, 0.09, 0.12];
}

export function traceColourHall(origin: Vec3, ray: Vec3): Rgb {
  let best = Infinity;
  let colour: Rgb = [0, 0, 0];
  const hit = (t: number, surface: 'floor' | 'wall-x' | 'wall-z' | 'ceiling') => {
    if (!(t > 1e-6) || t >= best) return;
    const p: Vec3 = [origin[0] + ray[0] * t, origin[1] + ray[1] * t, origin[2] + ray[2] * t];
    const inside =
      p[0] >= HALL.minX - 1e-6 && p[0] <= HALL.maxX + 1e-6 &&
      p[2] >= HALL.nearZ - 1e-6 && p[2] <= HALL.farZ + 1e-6 &&
      p[1] >= -1e-6 && p[1] <= HALL.ceiling + 1e-6;
    if (!inside) return;
    best = t;
    if (surface === 'floor') colour = paintFloor(p[0], p[2]);
    else if (surface === 'ceiling') colour = paintCeiling(p[0], p[2]);
    else if (surface === 'wall-z') colour = paintWall(p[0], p[1], 5);
    else colour = paintWall(p[2], p[1], 7);
  };
  if (ray[1] < 0) hit(-origin[1] / ray[1], 'floor');
  if (ray[1] > 0) hit((HALL.ceiling - origin[1]) / ray[1], 'ceiling');
  if (ray[0] > 0) hit((HALL.maxX - origin[0]) / ray[0], 'wall-x');
  if (ray[0] < 0) hit((HALL.minX - origin[0]) / ray[0], 'wall-x');
  if (ray[2] > 0) hit((HALL.farZ - origin[2]) / ray[2], 'wall-z');
  if (ray[2] < 0) hit((HALL.nearZ - origin[2]) / ray[2], 'wall-z');
  return colour;
}

/** One camera's picture on a canvas, 2 × 2 supersampled. */
export function renderColourHall(camera: HallCamera): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = camera.width;
  canvas.height = camera.height;
  const ctx = canvas.getContext('2d')!;
  const image = ctx.createImageData(camera.width, camera.height);
  const offsets = [0.25, 0.75];
  for (let row = 0; row < camera.height; row += 1) {
    for (let col = 0; col < camera.width; col += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (const oy of offsets) {
        for (const ox of offsets) {
          const ray = pixelRay(camera, (col + ox) / camera.width, (row + oy) / camera.height);
          const c = traceColourHall(camera.position, ray);
          r += c[0];
          g += c[1];
          b += c[2];
        }
      }
      const i = (row * camera.width + col) * 4;
      image.data[i] = Math.min(255, (r / 4) * 255);
      image.data[i + 1] = Math.min(255, (g / 4) * 255);
      image.data[i + 2] = Math.min(255, (b / 4) * 255);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

/** Both halves as the rig on the tripod sees them, at the calibration size. */
export async function colourHallPair(width = 1280, height = 720) {
  const rig = hallRig({ width, height });
  const left = renderColourHall(rig.left);
  const right = renderColourHall(rig.right);
  const url = (canvas: HTMLCanvasElement) =>
    new Promise<string>((resolve) =>
      canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), 'image/jpeg', 0.92),
    );
  return { left: await url(left), right: await url(right), canvases: { left, right } };
}
