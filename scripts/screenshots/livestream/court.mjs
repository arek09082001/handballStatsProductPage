// Draws a handball court in perspective as SVG, tactic-board style.
// usage: node court.mjs <out.svg> <view>  view: tv | left | right
import fs from 'node:fs';
const [out, view = 'tv', W0, H0] = process.argv.slice(2);
const W = Number(W0 || 1280), H = Number(H0 || 720);
const cams = {
  tv:    { pos: [29, -9, 12],  at: [31, 9.5, 0],  fov: 66 },
  left:  { pos: [20, -12, 10], at: [10, 9, 0], fov: 72 },
  right: { pos: [20, -12, 10], at: [30, 9, 0], fov: 72 },
};
const cam = cams[view];
const sub = (a, b) => a.map((v, i) => v - b[i]);
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const norm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
const fwd = norm(sub(cam.at, cam.pos));
const right = norm(cross(fwd, [0, 0, 1]));
const up = cross(right, fwd);
const f = (W / 2) / Math.tan((cam.fov * Math.PI / 180) / 2);
function P(x, y, z = 0) {
  const d = sub([x, y, z], cam.pos);
  const cz = dot(d, fwd);
  return [W / 2 + f * dot(d, right) / cz, H / 2 - f * dot(d, up) / cz, cz];
}
const pts = (arr) => arr.map(([x, y, z]) => P(x, y, z).slice(0, 2).map((v) => v.toFixed(1)).join(',')).join(' ');
const line = (a, b, extra = '') => `<polyline points="${pts([a, b])}" ${extra}/>`;
const poly = (arr, extra = '') => `<polyline points="${pts(arr)}" ${extra}/>`;
function arc(cx, r, dir, n = 60) {
  // goal-area line: quarter circles around posts (y=8.5, y=11.5) + straight between
  const a = [];
  for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 + (i / n) * (Math.PI / 2); a.push([cx + dir * r * Math.cos(t), 8.5 + r * Math.sin(t), 0]); }
  for (let i = 0; i <= n; i++) { const t = (i / n) * (Math.PI / 2); a.push([cx + dir * r * Math.cos(t), 11.5 + r * Math.sin(t), 0]); }
  return a.filter(([, y]) => y >= 0 && y <= 20);
}
const chalk = 'fill="none" stroke="#f4f1ea" stroke-linecap="round" stroke-linejoin="round"';
let s = '';
// hall: wall + floor
const farL = P(-6, 20, 0), farR = P(46, 20, 0);
const horizonY = Math.min(farL[1], farR[1]);
s += `<rect width="${W}" height="${H}" fill="#16242c"/>`;
// wall band with panels
const wallTop = [P(-10, 22, 7), P(50, 22, 7)];
const wallBot = [P(-10, 22, 0), P(50, 22, 0)];
s += `<polygon points="${pts([[-10,22,7],[50,22,7],[50,22,0],[-10,22,0]])}" fill="#1d3340"/>`;
for (let x = -10; x <= 50; x += 2.5) s += line([x, 22, 0], [x, 22, 7], 'stroke="#284454" stroke-width="2"');
// advertising band
s += `<polygon points="${pts([[-10,21.6,1.0],[50,21.6,1.0],[50,21.6,0],[-10,21.6,0]])}" fill="#21404f"/>`;
for (let x = -8; x < 50; x += 8) s += `<polygon points="${pts([[x,21.55,0.85],[x+6,21.55,0.85],[x+6,21.55,0.15],[x,21.55,0.15]])}" fill="#2b5163"/>`;
// floor beyond court
s += `<polygon points="${pts([[-10,-3,0],[50,-3,0],[50,22,0],[-10,22,0]])}" fill="#1a4a5c"/>`;
// court playing surface
s += `<polygon points="${pts([[0,0,0],[40,0,0],[40,20,0],[0,20,0]])}" fill="#1f5a6e"/>`;
// goal areas tinted
for (const [cx, dir] of [[0, 1], [40, -1]]) {
  const a = arc(cx, 6, dir); s += `<polygon points="${pts([[cx,0,0],...a,[cx,20,0]])}" fill="#246a80"/>`;
}
const sw = 4;
s += poly([[0,0,0],[40,0,0],[40,20,0],[0,20,0],[0,0,0]], `${chalk} stroke-width="${sw}"`);
s += line([20,0,0],[20,20,0], `${chalk} stroke-width="${sw}"`);
for (const [cx, dir] of [[0, 1], [40, -1]]) {
  s += poly(arc(cx, 6, dir), `${chalk} stroke-width="${sw}"`);
  s += poly(arc(cx, 9, dir), `${chalk} stroke-width="${sw * 0.8}" stroke-dasharray="14 12"`);
  s += line([cx + dir * 7, 9.5, 0], [cx + dir * 7, 10.5, 0], `${chalk} stroke-width="${sw}"`);
  s += line([cx + dir * 4, 9.85, 0], [cx + dir * 4, 10.15, 0], `${chalk} stroke-width="${sw}"`);
  // goal
  const g = (y, z) => [cx - dir * 0.0, y, z];
  const back = (y, z) => [cx - dir * 1.0, y, z];
  s += `<polygon points="${pts([back(8.5,0),back(11.5,0),back(11.5,1.6),back(8.5,1.6)])}" fill="rgba(255,255,255,0.12)"/>`;
  s += poly([g(8.5,0),g(8.5,2),g(11.5,2),g(11.5,0)], `fill="none" stroke="#ef4444" stroke-width="7" stroke-linejoin="round"`);
  s += poly([g(8.5,0),g(8.5,2),g(11.5,2),g(11.5,0)], `fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="10 10" stroke-linejoin="round"`);
}
// players as magnets: us orange attacking right goal, them blue 6:0
// a point at distance r from the right goal's area line, angle a (0 = straight out, ±90° = goal line)
function around(r, a) {
  const t = a * Math.PI / 180;
  const post = t < 0 ? 8.5 : 11.5;
  return [40 - r * Math.cos(t), post + r * Math.sin(t)];
}
const us = [[7,...around(9.6,-48)],[3,...around(10.4,-8)],[9,...around(10.8,10)],[11,...around(9.4,46)],
  [5,38.6,1.2],[13,...around(6.4,4)]];
const them = [[12,...around(6.6,-75)],[4,...around(6.7,-40)],[17,...around(6.7,-12)],[8,...around(6.7,14)],
  [21,...around(6.8,42)],[2,...around(6.6,76)],[1,39.0,10.1]];
const people = [...us.map((p) => ['#f26b1d', '#ffb37f', ...p]), ...them.map((p) => ['#2563eb', '#8fb2ff', ...p])]
  .map(([c, rim, n, x, y]) => ({ c, rim, n, x, y, d: P(x, y)[2] }))
  .sort((a, b) => b.d - a.d);
for (const p of people) {
  const base = P(p.x, p.y, 0), top = P(p.x, p.y, 1.75);
  const h = base[1] - top[1];
  const r = h * 0.3;
  const cx = base[0], cy = base[1] - r * 0.95;
  s += `<ellipse cx="${cx}" cy="${base[1]}" rx="${r*1.05}" ry="${r*0.32}" fill="rgba(0,0,0,0.35)"/>`;
  s += `<circle cx="${cx+1.5}" cy="${cy+2.5}" r="${r}" fill="rgba(0,0,0,0.35)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.c}" stroke="${p.rim}" stroke-width="${Math.max(1.5, r*0.08)}"/>`;
  s += `<text x="${cx}" y="${cy + r*0.36}" font-family="Archivo, 'Arial Black', Arial, sans-serif" font-weight="800" font-size="${r*1.0}" text-anchor="middle" fill="#fff">${p.n}</text>`;
}
// ball near #13 (pivot) — pass in flight from #11
const BX = around(10.8,10)[0]+0.5, BY = around(10.8,10)[1]-0.6; const b = P(BX, BY, 2.05); const bs = P(BX, BY, 0);
s += `<ellipse cx="${bs[0]}" cy="${bs[1]}" rx="${(P(BX,BY,0.11)[1]-P(BX,BY,0.33)[1])*1.5}" ry="3" fill="rgba(0,0,0,0.3)"/>`;
s += `<circle cx="${b[0]}" cy="${b[1]}" r="${Math.max(5,(P(BX,BY,0)[1]-P(BX,BY,0.19)[1]))}" fill="#fbbf24" stroke="#7c4a03" stroke-width="2"/>`;
fs.writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`);
