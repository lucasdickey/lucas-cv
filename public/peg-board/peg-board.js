// The peg board above the reading list: a three.js light box of glowing pegs.
// Mounted by app/components/PegBoard.tsx. Plays on its own until someone taps it;
// then it becomes paint by numbers, and each tap or drag drops a clump of pegs.
import * as THREE from '../real-books/assets/three.module.js';
import { PEG_COLORS, WIDE_MIN, layoutBoard, clumpAt, fillDelays, mulberry32 } from './logic.js?v=1';

const POP = 0.26;        // a peg's pop when it goes in
const FADE = 0.25;       // and its fade when it comes out
const FILL = 2.4;        // one cover filling itself in
const HOLD = { wide: 4.5, narrow: 3.0 };
const CLEAR = 0.9;
const CLUMP = 2.5;       // reach of one tap, in hole widths
const PAD = 1.2;         // black border around the holes
const TILT = 0.07;       // most the board leans toward the pointer, in radians

function canvasTexture(size, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// The face of a lit peg: brightest in the middle, with a small highlight.
const capTexture = () => canvasTexture(128, (g, s) => {
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.55, '#e4e4e4');
  grad.addColorStop(1, '#a8a8a8');
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  const hl = g.createRadialGradient(s * 0.36, s * 0.34, 0, s * 0.36, s * 0.34, s * 0.16);
  hl.addColorStop(0, 'rgba(255,255,255,0.9)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hl;
  g.fillRect(0, 0, s, s);
});

// The light a peg throws onto the board around it.
const haloTexture = () => canvasTexture(128, (g, s) => {
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, 'rgba(255,255,255,0.85)');
  grad.addColorStop(0.22, 'rgba(255,255,255,0.32)');
  grad.addColorStop(0.55, 'rgba(255,255,255,0.08)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
});

// Paint-by-numbers marks: the colour's code letter in a faint ring, like the toy's template sheets.
const hintTexture = (code) => canvasTexture(128, (g, s) => {
  g.strokeStyle = 'rgba(255,255,255,0.45)';
  g.lineWidth = 6;
  g.beginPath();
  g.arc(s / 2, s / 2, s * 0.4, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#ffffff';
  g.font = `bold ${Math.round(s * 0.5)}px ui-monospace, Menlo, Consolas, monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(code, s / 2, s / 2 + s * 0.03);
});

function setInstance(mesh, slot, x, y, z, scale) {
  const m = mesh.instanceMatrix.array;
  const o = slot * 16;
  m[o] = scale; m[o + 1] = 0; m[o + 2] = 0; m[o + 3] = 0;
  m[o + 4] = 0; m[o + 5] = scale; m[o + 6] = 0; m[o + 7] = 0;
  m[o + 8] = 0; m[o + 9] = 0; m[o + 10] = scale; m[o + 11] = 0;
  m[o + 12] = x; m[o + 13] = y; m[o + 14] = z; m[o + 15] = 1;
}

function setColor(mesh, slot, color, k) {
  const c = mesh.instanceColor.array;
  c[slot * 3] = color.r * k;
  c[slot * 3 + 1] = color.g * k;
  c[slot * 3 + 2] = color.b * k;
}

function instanced(geometry, material, count) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3).fill(1), 3);
  mesh.frustumCulled = false;
  return mesh;
}

export function mountPegBoard(host, { books, reducedMotion = false, onState = () => {} }) {
  const templates = books.map((b) => b.template);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x0a0a0c);
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:pointer';
  host.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
  const rig = new THREE.Group();
  scene.add(rig);
  const textures = { cap: capTexture(), halo: haloTexture(), hints: {} };
  const colors = Object.fromEntries(Object.entries(PEG_COLORS).map(([k, v]) => [k, new THREE.Color(v)]));

  const rand = mulberry32(42);
  const filledByCell = new Map();   // paint progress, kept across layout changes
  const now = () => performance.now() / 1000;

  let board, pegs, onAt, offAt, fadeAt, filled, phase, hintOf, centres, meshes = [];
  let wide = null;
  let mode = 'auto';
  let index = 0;
  let nextCycle = 0;
  let celebrate = [];
  let tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  let visible = false;
  let frame = 0;
  let painting = null;

  const cellKey = (p) => `${p.book}:${p.tr}:${p.tc}`;
  const shown = (p) => p.kind === 'header' || wide || p.book === index;

  function report() {
    const done = books.map((_, b) => pegs.every((p, i) => p.book !== b || filled[i]));
    canvas.style.cursor = mode === 'paint' ? 'crosshair' : 'pointer';
    onState({ mode, wide, index, done });
  }

  // Schedule a peg to come out. Its fade keeps its own start time, so a new fill
  // scheduled meanwhile doesn't cut the fade short.
  function goOut(i, at) {
    offAt[i] = at;
    fadeAt[i] = at;
  }

  function build() {
    for (const mesh of meshes) {
      rig.remove(mesh);
      mesh.geometry.dispose();
      (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
    }
    meshes = [];
    board = layoutBoard(templates, wide);
    pegs = board.pegs;
    const n = pegs.length;
    onAt = new Float64Array(n).fill(Infinity);
    offAt = new Float64Array(n).fill(Infinity);
    fadeAt = new Float64Array(n).fill(-Infinity);
    filled = new Uint8Array(n);
    phase = Float32Array.from(pegs, () => rand() * Math.PI * 2);
    pegs.forEach((p, i) => {
      if (p.kind === 'cover' && filledByCell.get(cellKey(p))) {
        filled[i] = 1;
        onAt[i] = -Infinity;
      }
    });

    const backing = new THREE.Mesh(
      new THREE.PlaneGeometry(board.width + PAD * 2, board.height + PAD * 2),
      new THREE.MeshBasicMaterial({ color: 0x0c0c10 }),
    );
    backing.position.z = -0.01;
    const holes = instanced(new THREE.CircleGeometry(0.16, 14), new THREE.MeshBasicMaterial({ color: 0x020203 }), board.holes.length);
    const rims = instanced(new THREE.RingGeometry(0.16, 0.215, 20), new THREE.MeshBasicMaterial({ color: 0x26262c }), board.holes.length);
    board.holes.forEach((h, k) => {
      setInstance(holes, k, h.x, h.y, 0, 1);
      setInstance(rims, k, h.x, h.y, 0.001, 1);
    });

    const pegGeometry = new THREE.CylinderGeometry(0.4, 0.45, 0.34, 28, 1);
    pegGeometry.rotateX(Math.PI / 2);
    pegGeometry.translate(0, 0, 0.17);
    const side = new THREE.MeshBasicMaterial({ color: 0x6f6f6f });
    const top = new THREE.MeshBasicMaterial({ map: textures.cap });
    const pegMesh = instanced(pegGeometry, [side, top, side], n);
    const haloMesh = instanced(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({ map: textures.halo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      n,
    );

    // One set of hint marks per peg colour.
    hintOf = new Array(n);
    const byCode = {};
    pegs.forEach((p, i) => p.kind === 'cover' && (byCode[p.code] ||= []).push(i));
    const hintMeshes = Object.entries(byCode).map(([code, list]) => {
      textures.hints[code] ||= hintTexture(code);
      const mesh = new THREE.InstancedMesh(
        new THREE.PlaneGeometry(0.74, 0.74),
        new THREE.MeshBasicMaterial({ map: textures.hints[code], color: colors[code], transparent: true, opacity: 0.8, depthWrite: false }),
        list.length,
      );
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      list.forEach((i, slot) => (hintOf[i] = { mesh, slot }));
      return mesh;
    });

    meshes = [backing, holes, rims, haloMesh, pegMesh, ...hintMeshes];
    meshes.forEach((m) => rig.add(m));
    meshes.peg = pegMesh;
    meshes.halo = haloMesh;
    meshes.hints = hintMeshes;
    celebrate = books.map(() => Infinity);
    centres = books.map((_, b) => {
      const list = pegs.filter((p) => p.book === b);
      return { x: list.reduce((s, p) => s + p.x, 0) / list.length, y: list.reduce((s, p) => s + p.y, 0) / list.length };
    });
    host.style.aspectRatio = `${board.width + PAD * 2} / ${board.height + PAD * 2}`;
  }

  function fit() {
    const w = host.clientWidth;
    const h = w * (board.height + PAD * 2) / (board.width + PAD * 2);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    camera.position.set(0, 0, ((board.height + PAD * 2) / 2) / Math.tan(fov / 2));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  function startAuto(t) {
    const header = pegs.map((p, i) => (p.kind === 'header' ? i : -1)).filter((i) => i >= 0);
    for (const i of header) if (onAt[i] === Infinity) onAt[i] = reducedMotion ? -Infinity : t + 0.1 + pegs[i].letter * 0.08 + rand() * 0.06;
    const order = wide ? books.map((_, b) => b) : [index];
    let at = t + (reducedMotion ? 0 : 0.6);
    for (const b of order) {
      const list = pegs.map((p, i) => (p.book === b ? i : -1)).filter((i) => i >= 0);
      const delays = fillDelays(pegs, list, FILL, 11 + b);
      for (const i of list) {
        onAt[i] = reducedMotion ? -Infinity : at + delays.get(i);
        offAt[i] = Infinity;
      }
      at += FILL + 0.25;
    }
    if (reducedMotion) {
      nextCycle = Infinity;
      return;
    }
    const clearAt = at + HOLD[wide ? 'wide' : 'narrow'];
    pegs.forEach((p, i) => {
      if (p.kind === 'cover' && order.includes(p.book)) {
        goOut(i, clearAt + ((p.x + board.width / 2) / board.width) * 0.6 + rand() * 0.15);
      }
    });
    nextCycle = clearAt + CLEAR + 0.4;
  }

  function clearCovers(t, spread = 0.35) {
    pegs.forEach((p, i) => {
      if (p.kind !== 'cover') return;
      filled[i] = 0;
      if (onAt[i] <= t && offAt[i] > t) goOut(i, reducedMotion ? t : t + rand() * spread);
      else if (onAt[i] > t) onAt[i] = Infinity;
    });
    filledByCell.clear();
    celebrate = books.map(() => Infinity);
  }

  function paint(t = now()) {
    if (mode === 'paint') return;
    mode = 'paint';
    nextCycle = Infinity;
    clearCovers(t, 0.25);
    report();
  }

  function markDone(t) {
    books.forEach((_, b) => {
      const list = pegs.filter((p) => p.book === b);
      if (celebrate[b] === Infinity && list.every((p) => filledByCell.get(cellKey(p)))) {
        celebrate[b] = reducedMotion ? Infinity : t;
      }
    });
    report();
  }

  function drop(x, y, t = now()) {
    const hits = clumpAt(pegs, x, y, CLUMP, (p, i) => p.kind === 'cover' && !filled[i] && shown(p));
    for (const { i, d } of hits) {
      filled[i] = 1;
      filledByCell.set(cellKey(pegs[i]), true);
      onAt[i] = reducedMotion ? t : t + d * 0.05 + rand() * 0.04;
      offAt[i] = Infinity;
    }
    if (hits.length) markDone(t + 0.3);
    wake();
  }

  function fillIn(t = now()) {
    paint(t);
    const list = pegs.map((p, i) => (p.kind === 'cover' && !filled[i] && shown(p) ? i : -1)).filter((i) => i >= 0);
    const delays = fillDelays(pegs, list, 1.6, 5);
    for (const i of list) {
      filled[i] = 1;
      filledByCell.set(cellKey(pegs[i]), true);
      onAt[i] = reducedMotion ? t : t + delays.get(i);
      offAt[i] = Infinity;
    }
    markDone(t + 1.7);
    wake();
  }

  function clear(t = now()) {
    paint(t);
    clearCovers(t);
    report();
    wake();
  }

  function play(t = now()) {
    mode = 'auto';
    clearCovers(t);
    startAuto(t + (reducedMotion ? 0 : 0.5));
    report();
    wake();
  }

  function step(delta, t = now()) {
    index = (index + delta + books.length) % books.length;
    if (mode === 'auto') {
      clearCovers(t, 0.2);
      startAuto(t + 0.3);
    }
    report();
    wake();
  }

  // ---------------------------------------------------------------- drawing

  function draw(t) {
    if (mode === 'auto' && t >= nextCycle) {
      if (!wide) index = (index + 1) % books.length;
      startAuto(t);
      report();
    }
    const pegMesh = meshes.peg;
    const haloMesh = meshes.halo;
    for (let i = 0; i < pegs.length; i++) {
      const p = pegs[i];
      let scale = 0;
      let bright = 0;
      if (shown(p)) {
        if (t >= onAt[i] && t < offAt[i]) {
          const a = t - onAt[i];
          if (!reducedMotion && a < POP) {
            const k = a / POP;
            scale = k < 0.55 ? 0.4 + (1.15 - 0.4) * (k / 0.55) : 1.15 - 0.15 * ((k - 0.55) / 0.45);
          } else scale = 1;
          bright = 1;
          if (!reducedMotion) {
            bright += 0.9 * Math.exp(-a / 0.12);
            bright *= 1 + 0.05 * Math.sin(t * 3.1 + phase[i]) + 0.3 * Math.max(0, Math.sin(t * 0.9 + phase[i] * 7)) ** 40;
            if (p.book >= 0 && t >= celebrate[p.book]) {
              const c = centres[p.book];
              const dist = Math.hypot(p.x - c.x, p.y - c.y);
              const bump = Math.exp(-((dist - (t - celebrate[p.book]) * 14) ** 2) / 5);
              bright += bump * 1.1;
              scale += bump * 0.15;
            }
          }
        } else if (t >= fadeAt[i] && t < fadeAt[i] + FADE) {
          const f = (t - fadeAt[i]) / FADE;
          scale = 1 - 0.35 * f;
          bright = (1 - f) ** 2;
        }
      }
      setInstance(pegMesh, i, p.x, p.y, 0, scale);
      setInstance(haloMesh, i, p.x, p.y, 0.06, scale);
      setColor(pegMesh, i, colors[p.code], Math.min(bright, 1.6));
      setColor(haloMesh, i, colors[p.code], 0.5 * bright);
      const hint = hintOf[i];
      if (hint) {
        const show = mode === 'paint' && shown(p) && !(filled[i] && t >= onAt[i]);
        setInstance(hint.mesh, hint.slot, p.x, p.y, 0.004, show ? 1 : 0);
      }
    }
    pegMesh.instanceMatrix.needsUpdate = pegMesh.instanceColor.needsUpdate = true;
    haloMesh.instanceMatrix.needsUpdate = haloMesh.instanceColor.needsUpdate = true;
    for (const mesh of meshes.hints) mesh.instanceMatrix.needsUpdate = true;
    tilt.x += (tilt.tx - tilt.x) * 0.08;
    tilt.y += (tilt.ty - tilt.y) * 0.08;
    rig.rotation.set(tilt.x, tilt.y, 0);
    renderer.render(scene, camera);
  }

  function loop() {
    frame = 0;
    draw(now());
    if (visible && !reducedMotion) frame = requestAnimationFrame(loop);
  }

  // In reduced motion nothing animates, so draw once whenever something changes.
  function wake() {
    if (!visible) return;
    if (reducedMotion) draw(now());
    else if (!frame) frame = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------------- input

  const raycaster = new THREE.Raycaster();
  const boardPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  function boardPoint(e) {
    const r = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    rig.updateMatrixWorld();
    const ray = raycaster.ray.clone().applyMatrix4(rig.matrixWorld.clone().invert());
    const hit = ray.intersectPlane(boardPlane, new THREE.Vector3());
    return hit && { x: hit.x, y: hit.y };
  }

  // Mouse and pen paint from the first press. A touch waits: a clean tap or a
  // sideways drag paints, while a vertical swipe stays a page scroll (the
  // canvas allows vertical panning, so the browser takes those over).
  const onDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const point = boardPoint(e);
    if (!point) return;
    painting = { id: e.pointerId, touch: e.pointerType === 'touch', moved: false, cx: e.clientX, cy: e.clientY, ...point };
    if (!painting.touch) {
      if (mode === 'auto') paint();
      drop(point.x, point.y);
    }
  };
  const onMove = (e) => {
    if (painting && e.pointerId === painting.id) {
      if (painting.touch && !painting.moved) {
        if (Math.hypot(e.clientX - painting.cx, e.clientY - painting.cy) < 8) return;
        painting.moved = true;
        if (mode === 'auto') paint();
        drop(painting.x, painting.y);
      }
      const point = boardPoint(e);
      if (point && Math.hypot(point.x - painting.x, point.y - painting.y) >= 1.2) {
        drop(point.x, point.y);
        Object.assign(painting, point);
      }
    } else if (e.pointerType === 'mouse' && !reducedMotion) {
      const r = canvas.getBoundingClientRect();
      tilt.ty = (((e.clientX - r.left) / r.width) - 0.5) * 2 * TILT;
      tilt.tx = (((e.clientY - r.top) / r.height) - 0.5) * 2 * TILT;
      wake();
    }
  };
  const onUp = (e) => {
    if (painting && painting.touch && !painting.moved && e.type === 'pointerup') {
      if (mode === 'auto') paint();
      drop(painting.x, painting.y);
    }
    painting = null;
  };
  const onLeave = () => {
    painting = null;
    tilt.tx = tilt.ty = 0;
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('pointerleave', onLeave);

  function relayout() {
    const isWide = host.clientWidth >= WIDE_MIN;
    if (isWide !== wide) {
      wide = isWide;
      build();
      if (mode === 'auto') startAuto(now());
      report();
    }
    fit();
    wake();
  }
  const resizer = new ResizeObserver(relayout);
  resizer.observe(host);
  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
  });
  watcher.observe(host);
  relayout();

  return {
    paint: () => {
      paint();
      wake();
    },
    fillIn: () => fillIn(),
    clear: () => clear(),
    play: () => play(),
    next: () => step(1),
    prev: () => step(-1),
    destroy() {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      meshes.forEach((m) => {
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat.dispose());
      });
      Object.values(textures.hints).forEach((tex) => tex.dispose());
      textures.cap.dispose();
      textures.halo.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
