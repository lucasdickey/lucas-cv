import test from 'node:test';
import assert from 'node:assert/strict';
import { cabinet, orbitDistance, panGeometry, horizontalDrag, dragView, visibleBook } from '../public/real-books/navigation.js';
import { Mesh, BoxGeometry, MeshBasicMaterial, Raycaster, Vector3 } from '../public/real-books/assets/three.module.js';
import { createPickTarget } from '../public/real-books/interaction.js';

test('rotate preserves translation and changes yaw and tilt at mobile and desktop sizes at any zoom',()=>{
 for(const [width,height] of [[390,420],[960,749]])for(const distance of [8,15,24,40]){
  const view={mode:'turn',yaw:.1,pitch:0,x:1,y:7,dx:width*.1,dy:height*.1,width,height,distance,aspect:width/height};
  const next=dragView(view);
  assert.ok(next.yaw>view.yaw);assert.ok(next.pitch>view.pitch);
  assert.equal(next.x,view.x);assert.equal(next.y,view.y);
 }
});
test('pan moves both axes without resetting orientation, even when the whole shelf fits',()=>{
 for(const distance of [8,15,24,40]){
  const next=dragView({mode:'pan',yaw:.4,pitch:.2,x:0,y:7,dx:40,dy:40,width:390,height:420,distance,aspect:390/420});
  assert.ok(next.x<0);assert.ok(next.y>7);
  assert.equal(next.yaw,.4);assert.equal(next.pitch,.2);
 }
});
test('drag distance scales with viewport size and pan travel remains bounded',()=>{
 for(const mode of ['pan','turn']){
  const common={start:0,distance:15,aspect:.7,mode};
  assert.equal(horizontalDrag({...common,delta:36,pixels:360}),horizontalDrag({...common,delta:120,pixels:1200}));
 }
 for(const distance of [8,12,24,40])for(const aspect of [.45,.8,1.5,2.1]){
  const {limit}=panGeometry(distance,aspect);
  for(const delta of [-10000,10000]){
   const x=horizontalDrag({start:0,delta,pixels:390,distance,aspect,mode:'pan'});
   assert.ok(Math.abs(x)>0&&Math.abs(x)<=limit);
  }
 }
});
test('turning stops within the supported oblique views',()=>{
 for(const delta of [-10000,10000])assert.equal(Math.abs(horizontalDrag({start:0,delta,pixels:390,mode:'turn'})),cabinet.maxYaw);
});
test('side panels block book selection while visible front spines still select',()=>{
 const material=new MeshBasicMaterial();
 const book=new Mesh(new BoxGeometry(1,2,1),material),target=createPickTarget(book);
 const panel=new Mesh(new BoxGeometry(.2,3,3),material);panel.position.x=2;panel.updateMatrixWorld();
 const ray=new Raycaster(new Vector3(5,0,0),new Vector3(-1,0,0));
 assert.equal(visibleBook(ray,[target],[panel]),null);
 ray.set(new Vector3(0,0,5),new Vector3(0,0,-1));
 assert.equal(visibleBook(ray,[target],[panel]),book);
 // Visual pull-out must not move the stable picking surface.
 book.position.z=2;book.updateMatrixWorld();
 assert.equal(visibleBook(ray,[target],[panel]),book);
});

test('orbiting preserves clearance to the nearest cabinet corner so the full view stays framed',()=>{
 for(const yaw of [-cabinet.maxYaw,-.3,0,.3,cabinet.maxYaw])assert.ok(Math.abs(orbitDistance(24,yaw)-Math.abs(Math.sin(yaw))*cabinet.halfWidth-24)<1e-9);
});
