import test from 'node:test';
import assert from 'node:assert/strict';
import { RevealMotion, revealPhases, isProjectedSourceVisible } from '../public/real-books/book-reveal.js';

test('selection preserves the current hover pull and returns to the shelf endpoint',()=>{
 for(const initialPull of [0,.42/1.35,.8,1]){
  const motion=new RevealMotion(false,initialPull);
  assert.ok(Math.abs(revealPhases(motion.progress).pull-initialPull)<1e-12);
  assert.equal(revealPhases(motion.progress).fly,0);
  motion.close();motion.advance(2);
  assert.equal(motion.returned,true);
  assert.deepEqual(revealPhases(motion.progress),{pull:0,fly:0});
 }
});

test('source visibility uses viewport pixels within a partly scrolled stage',()=>{
 const stage={left:100,top:-400,width:500,height:500};
 assert.equal(isProjectedSourceVisible({x:0,y:0,z:0},stage,800,600),false);
 assert.equal(isProjectedSourceVisible({x:0,y:-.8,z:0},stage,800,600),true);
 assert.equal(isProjectedSourceVisible({x:0,y:-1.1,z:0},stage,800,600),false);
 assert.equal(isProjectedSourceVisible({x:0,y:-.8,z:1.1},stage,800,600),false);
 assert.equal(isProjectedSourceVisible({x:0,y:-.8,z:-1.1},stage,800,600),false);
 assert.equal(isProjectedSourceVisible({x:0,y:-.8,z:0},{...stage,left:-400},800,600),false);
 assert.equal(isProjectedSourceVisible({x:0,y:-.8,z:0},{...stage,left:700},800,600),false);
});

test('closing during extraction or flight reverses from the current pose',()=>{
 for(const elapsed of [.1,.4,.7]){
  const motion=new RevealMotion();motion.advance(elapsed);
  const before=motion.progress;motion.close();assert.equal(motion.progress,before);
  motion.advance(.04);assert.ok(motion.progress<before);
  motion.advance(2);assert.equal(motion.progress,0);assert.equal(motion.returned,true);
 }
});
test('book clears the shelf before turning, and arrives fully in the card',()=>{
 assert.deepEqual(revealPhases(0),{pull:0,fly:0});
 assert.equal(revealPhases(.2).fly,0);
 assert.equal(revealPhases(.3).pull,1);
 assert.deepEqual(revealPhases(1),{pull:1,fly:1});
 const motion=new RevealMotion();motion.advance(2);assert.equal(motion.progress,1);
 motion.advance(2);assert.equal(motion.progress,1);
});
test('reduced motion reaches either endpoint immediately',()=>{
 const motion=new RevealMotion(true);motion.advance(0);assert.equal(motion.progress,1);
 motion.close();motion.advance(0);assert.equal(motion.returned,true);
});

test('reduced-motion selection restores slots when interrupted or closed',async()=>{
 const {BookReveal}=await import('../public/real-books/book-reveal.js');
 const {Mesh,BoxGeometry,PerspectiveCamera,MeshBasicMaterial}=await import('../public/real-books/assets/three.module.js');
 const classes={add(){},remove(){},toggle(){}};
 const camera=new PerspectiveCamera(38,1,.1,100);camera.position.z=24;camera.updateMatrixWorld();
 const host={classList:classes,getBoundingClientRect:()=>({left:0,top:0,width:500,height:500})};
 const detail={classList:classes},dialog={classList:classes};
 const previousHeight=globalThis.innerHeight,previousWidth=globalThis.innerWidth;globalThis.innerHeight=800;globalThis.innerWidth=800;
 let returns=0;
 const reveal=new BookReveal({host,detail,dialog,getCamera:()=>camera,onReturned:()=>returns++,reduced:true});
 const makeBook=()=>{const mesh=new Mesh(new BoxGeometry(.2,2,1),new MeshBasicMaterial());mesh.userData.restZ=0;return mesh};
 const a=makeBook(),b=makeBook();
 try{
  a.position.z=.42;
  reveal.open(a,{title:'A'});
  assert.ok(Math.abs(revealPhases(reveal.active.motion.progress).pull-.42/1.35)<1e-12);
  assert.equal(reveal.active.rest.z,0);
  reveal.update(0);assert.equal(a.visible,false);
  reveal.open(b,{title:'B'});assert.equal(a.visible,true);assert.equal(a.position.z,0);
  reveal.update(0);assert.equal(b.visible,false);
  reveal.close();reveal.update(0);assert.equal(b.visible,true);assert.equal(b.position.z,0);assert.equal(returns,1);
  reveal.open(a,{title:'A'});reveal.update(0);reveal.open(null,{title:'No mesh'});assert.equal(a.visible,true);assert.equal(reveal.active,null);
 }finally{globalThis.innerHeight=previousHeight;globalThis.innerWidth=previousWidth}
});

test('offscreen source skips flight while part of the host remains visible',async()=>{
 const {BookReveal}=await import('../public/real-books/book-reveal.js');
 const {Mesh,BoxGeometry,PerspectiveCamera,MeshBasicMaterial}=await import('../public/real-books/assets/three.module.js');
 const classes={add(){},remove(){},toggle(){}};
 const camera=new PerspectiveCamera(38,1,.1,100);camera.position.z=24;camera.updateMatrixWorld();
 const host={classList:classes,getBoundingClientRect:()=>({left:0,top:-400,width:500,height:500,bottom:100})};
 const reveal=new BookReveal({host,detail:{classList:classes},dialog:{classList:classes},getCamera:()=>camera,onReturned(){}});
 let rendererAttempted=false;reveal.initRenderer=()=>{rendererAttempted=true;throw new Error('Unexpected renderer initialization')};
 const source=new Mesh(new BoxGeometry(.2,2,1),new MeshBasicMaterial());source.userData.restZ=0;
 const previousHeight=globalThis.innerHeight,previousWidth=globalThis.innerWidth;globalThis.innerHeight=800;globalThis.innerWidth=800;
 try{
  reveal.open(source,{title:'Offscreen'});
  assert.equal(rendererAttempted,false);
  assert.equal(reveal.active.motion.reduced,true);
  reveal.update(0);assert.equal(reveal.active.motion.progress,1);assert.equal(source.visible,false);
  reveal.close();reveal.update(0);assert.equal(source.position.z,0);assert.equal(source.visible,true);
 }finally{globalThis.innerHeight=previousHeight;globalThis.innerWidth=previousWidth}
});

test('drawer selection lifts on its extraction axis and returns to the moving parent',async()=>{
 const {BookReveal}=await import('../public/real-books/book-reveal.js');
 const {Mesh,Group,Vector3,BoxGeometry,PerspectiveCamera,MeshBasicMaterial}=await import('../public/real-books/assets/three.module.js');
 const classes={add(){},remove(){},toggle(){}},camera=new PerspectiveCamera(38,1,.1,100);
 camera.position.z=24;camera.updateMatrixWorld();
 const host={classList:classes,getBoundingClientRect:()=>({left:0,top:0,width:500,height:500})};
 const reveal=new BookReveal({host,detail:{classList:classes},dialog:{classList:classes},getCamera:()=>camera,onReturned(){},reduced:true});
 const tray=new Group(),source=new Mesh(new BoxGeometry(.2,2,1),new MeshBasicMaterial());
 tray.position.z=4.2;tray.add(source);source.position.set(.3,.5,-.8);source.rotation.x=-Math.PI/2;
 source.userData.restPosition=source.position.clone();source.userData.pullAxis=new Vector3(0,1,0);source.userData.pullDistance=2;
 const h=globalThis.innerHeight,w=globalThis.innerWidth;globalThis.innerHeight=800;globalThis.innerWidth=800;
 try{
  source.position.y+=.42;reveal.open(source,{title:'Drawer book'});reveal.update(0);
  assert.equal(source.position.y,2.5);assert.equal(source.position.z,-.8);
  reveal.close();reveal.update(0);assert.equal(source.position.y,.5);assert.equal(source.position.z,-.8);
  assert.ok(Math.abs(source.getWorldPosition(new Vector3()).z-3.4)<1e-10);
 }finally{globalThis.innerHeight=h;globalThis.innerWidth=w}
});

test('horizontal books turn their spine upright and align the cover with the card',async()=>{
 const THREE=await import('../public/real-books/assets/three.module.js');
 const {BookReveal}=await import('../public/real-books/book-reveal.js');
 const previous={document:globalThis.document,innerWidth:globalThis.innerWidth,innerHeight:globalThis.innerHeight};
 const classes={add(){},remove(){},toggle(){}};
 const context={fillRect(){},strokeRect(){},fillText(){},measureText:()=>({width:0})};
 globalThis.document={createElement:()=>({getContext:()=>context}),body:{append(){}}};
 globalThis.innerWidth=1000;globalThis.innerHeight=800;
 const rect={left:100,top:50,width:600,height:600};
 const card={left:740,top:150,width:180,height:300};
 const camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(3,2,24);camera.lookAt(0,0,0);camera.updateMatrixWorld();
 const reveal=new BookReveal({host:{classList:classes,getBoundingClientRect:()=>rect},detail:{classList:classes,querySelector:()=>({hidden:false,getBoundingClientRect:()=>card})},dialog:{classList:classes},getCamera:()=>camera,onReturned(){}});
 reveal.initRenderer=()=>{
  reveal.scene=new THREE.Scene();reveal.camera=new THREE.PerspectiveCamera();
  reveal.renderer={domElement:{remove(){}},setSize(){},render(){}};
 };
 const source=new THREE.Mesh(new THREE.BoxGeometry(3,.2,1.8),Array.from({length:6},()=>new THREE.MeshStandardMaterial()));
 source.rotation.z=.08;source.userData.restZ=0;
 const sourceUV=Array.from(source.geometry.attributes.uv.array);
 try{
  reveal.open(source,{title:'A horizontal tower book',horizontal:true});
  const record=reveal.active;
  const frame=progress=>{record.motion.progress=progress;record.settled=false;reveal.update(0);return record.clone};
  const start=frame(.300001);
  assert.ok(start.quaternion.angleTo(source.quaternion)<1e-8,'flight starts at the exact shelf orientation');
  assert.ok(start.position.distanceTo(source.position)<1e-8,'flight starts at the fully extracted position');
  const middle=frame(.65),outbound=middle.quaternion.clone();
  reveal.close();frame(.65);
  assert.ok(middle.quaternion.angleTo(outbound)<1e-7,'return retraces the same rotation');
  const end=frame(.999999),cameraInverse=camera.quaternion.clone().invert();
  const inView=axis=>axis.applyQuaternion(end.quaternion).applyQuaternion(cameraInverse);
  assert.ok(inView(new THREE.Vector3(1,0,0)).distanceTo(new THREE.Vector3(0,-1,0))<1e-7,'long spine is vertical, not sideways');
  assert.ok(inView(new THREE.Vector3(0,1,0)).distanceTo(new THREE.Vector3(0,0,1))<1e-7,'top cover faces the viewer');
  const ppu=rect.height/(2*Math.tan(camera.fov*Math.PI/360)*6);
  assert.ok(Math.abs(3*end.scale.x*ppu-card.height)<1e-5,'spine fits the card height');
  assert.ok(Math.abs(1.8*end.scale.z*ppu-card.width)<1e-5,'cover width fits the card width');
  // Top-face vertices are indexed 8–11: the spine at +z becomes the left edge.
  const uv=end.geometry.attributes.uv;
  assert.deepEqual([uv.getX(8),uv.getY(8)],[1,1]);
  assert.deepEqual([uv.getX(9),uv.getY(9)],[1,0]);
  assert.deepEqual([uv.getX(10),uv.getY(10)],[0,1]);
  assert.deepEqual([uv.getX(11),uv.getY(11)],[0,0]);
  assert.deepEqual(Array.from(source.geometry.attributes.uv.array),sourceUV,'shelf texture coordinates stay unchanged');
  let disposed=false;end.geometry.addEventListener('dispose',()=>{disposed=true});
  frame(0);assert.equal(source.visible,true);assert.equal(source.position.z,0);assert.ok(disposed,'flight geometry is released on return');
 }finally{
  reveal.clear();source.geometry.dispose();source.material.forEach(m=>m.dispose());
  Object.assign(globalThis,previous);
 }
});
