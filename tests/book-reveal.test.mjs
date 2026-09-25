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
