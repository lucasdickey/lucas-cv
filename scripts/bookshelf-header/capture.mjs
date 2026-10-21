// Renders depth plates of a real-books bookcase, straight on, with transparent background.
// usage: node capture.mjs <outDir> <caseId> [pxPerUnit]
// Serve public/ first (e.g. `python3 -m http.server 8077` from public/). BASE_URL and
// PLAYWRIGHT_MODULE override the server address and where Playwright is installed.
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8077';

const [outRoot, caseId = 'wood', pxArg = '150'] = process.argv.slice(2);
const P = Number(pxArg);
const out = path.join(outRoot, caseId);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
page.on('pageerror', e => console.log('pageerror:', e.message));

await page.route(/\/real-books\/app\.js/, async route => {
  const res = await route.fetch();
  let body = await res.text();
  body = body.replace('renderer.render(scene,camera);', 'if(!window.__hold)renderer.render(scene,camera);');
  body = body.replace('}frame();', '}frame();window.__rb={THREE,scene,camera,renderer,root,bookMeshes,occluders,host};');
  await route.fulfill({ response: res, body, headers: { ...res.headers(), 'content-type': 'text/javascript' } });
});

await page.goto(`${BASE_URL}/real-books/index.html?case=${caseId}`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__rb, null, { timeout: 90000 });
await page.waitForTimeout(3000);

const result = await page.evaluate(async ({ P }) => {
  const { THREE, scene, camera, renderer, root, bookMeshes, occluders } = window.__rb;
  window.__hold = true;
  root.updateMatrixWorld(true);

  const meshes = [];
  root.traverse(o => { if (o.isMesh) meshes.push(o); });
  const floor = scene.children.find(o => o.isMesh && o.material?.isShadowMaterial);
  const lineObjs = [];
  root.traverse(o => { if (o.isLine || o.isPoints) lineObjs.push(o); });

  const boxOf = o => new THREE.Box3().setFromObject(o);
  const frameBox = new THREE.Box3();
  occluders.forEach(o => frameBox.union(boxOf(o)));
  const all = new THREE.Box3().setFromObject(root);

  // Back panels: occluders that sit at the very back and are thin in depth.
  const bookSet = new Set(bookMeshes);
  const occSet = new Set(occluders);
  const category = new Map();
  for (const m of meshes) {
    const b = boxOf(m);
    if (bookSet.has(m)) category.set(m, 'books');
    else if (occSet.has(m)) {
      const thin = (b.max.z - b.min.z) < 0.35;
      const atBack = b.max.z < frameBox.min.z + 0.45;
      const big = (b.max.x - b.min.x) * (b.max.y - b.min.y) > 4;
      category.set(m, thin && atBack && big ? 'back' : 'frame');
    } else {
      category.set(m, b.max.y > frameBox.max.y + 0.05 ? 'top' : 'books');
    }
  }

  // Straight-on camera, fixed distance so every case shares the same perspective strength.
  const zFront = frameBox.max.z;
  const D = 46;
  const pad = 0.6;
  const cx = (all.min.x + all.max.x) / 2;
  const minY = Math.min(all.min.y, frameBox.min.y) - pad;
  const maxY = all.max.y + pad;
  const cy = (minY + maxY) / 2;
  const hUnits = maxY - minY;
  const wUnits = (all.max.x - all.min.x) + pad * 2 + 1.5;
  const W = Math.round(wUnits * P), H = Math.round(hUnits * P);
  camera.fov = 2 * Math.atan((hUnits / 2) / D) * 180 / Math.PI;
  camera.aspect = W / H;
  camera.near = 1; camera.far = 200;
  camera.position.set(cx, cy, zFront + D);
  camera.lookAt(cx, cy, zFront);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  scene.background = null;

  const originals = new Map(meshes.map(m => [m, m.material]));
  const hidden = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  const grab = () => { renderer.render(scene, camera); return renderer.domElement.toDataURL('image/png'); };
  const restore = () => { for (const [m, mat] of originals) m.material = mat; if (floor) floor.visible = true; lineObjs.forEach(o => o.visible = true); };

  const shots = {};
  shots.beauty = grab();
  for (const cat of ['back', 'frame', 'books', 'top']) {
    for (const m of meshes) m.material = category.get(m) === cat ? originals.get(m) : hidden;
    if (floor) floor.visible = cat === 'back';
    lineObjs.forEach(o => o.visible = cat === 'top');
    shots[cat] = grab();
    restore();
  }

  // Surface direction pass, for contour lines and hatch direction.
  const tm = renderer.toneMapping, cs = renderer.outputColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  if (floor) floor.visible = false;
  const normalMat = new THREE.MeshNormalMaterial();
  // Object ID: each mesh a unique flat color; the blue channel carries the category.
  const catCode = { back: 40, frame: 100, books: 170, top: 230 };
  const idMats = new Map(meshes.map((m, i) => {
    const id = i + 1;
    const c = new THREE.Color().setRGB((id % 256) / 255, (Math.floor(id / 256) % 256) / 255, catCode[category.get(m)] / 255, THREE.LinearSRGBColorSpace);
    return [m, new THREE.MeshBasicMaterial({ color: c })];
  }));
  for (const cat of [null, 'back', 'frame', 'books', 'top']) {
    const sfx = cat ? `_${cat}` : '';
    lineObjs.forEach(o => o.visible = !cat || cat === 'top');
    for (const m of meshes) m.material = !cat || category.get(m) === cat ? normalMat : hidden;
    shots[`normal${sfx}`] = grab();
    for (const m of meshes) m.material = !cat || category.get(m) === cat ? idMats.get(m) : hidden;
    shots[`id${sfx}`] = grab();
  }
  restore();
  renderer.toneMapping = tm; renderer.outputColorSpace = cs;

  const counts = {};
  for (const c of category.values()) counts[c] = (counts[c] || 0) + 1;
  return { shots, meta: { W, H, P, D, cx, cy, zFront, fov: camera.fov, minY, maxY, frameBox: [frameBox.min.toArray(), frameBox.max.toArray()], all: [all.min.toArray(), all.max.toArray()], counts, books: bookMeshes.length } };
}, { P });

for (const [name, url] of Object.entries(result.shots)) {
  fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(url.split(',')[1], 'base64'));
}
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(result.meta, null, 2));
console.log(caseId, JSON.stringify(result.meta));
await browser.close();
