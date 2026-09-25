import { Mesh } from './assets/three.module.js';

// Picking stays at the book's resting pose, independent of its visual animation.
export function createPickTarget(mesh) {
 const target = new Mesh(mesh.geometry, mesh.material);
 mesh.updateWorldMatrix(true, false);
 target.matrixAutoUpdate = false;
 target.matrix.copy(mesh.matrixWorld);
 target.updateMatrixWorld(true);
 target.userData.bookMesh = mesh;
 return target;
}

export class HoverDwell {
 constructor() { this.clear(); }
 clear() { this.target = null; this.since = Infinity; }
 update(target, now, x, y) {
  if (!target) { this.clear(); return; }
  if (target !== this.target || Math.hypot(x-this.x, y-this.y) > 5) {
   this.target = target;
   this.since = now;
   this.x = x;
   this.y = y;
  }
 }
 ready(now) { return this.target !== null && now-this.since >= 500; }
}
export const zoomFactor = base => Math.pow(base, 1.1);
