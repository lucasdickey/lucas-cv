import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../public/real-books/assets/three.module.js';
import {selectBookcase} from '../public/real-books/bookcases.js';
import {CanvasGestures} from '../public/real-books/canvas-gestures.js';
import {cabinet,orbitDistance,panBounds} from '../public/real-books/navigation.js';
import {HoverDwell} from '../public/real-books/interaction.js';

// Exercise the real app handlers without loading textures or starting WebGL.
const source=fs.readFileSync(new URL('../public/real-books/app.js',import.meta.url),'utf8');
function app(id){
 const elements=new Map(),windowHandlers={};
 const element=selector=>{
  if(!elements.has(selector))elements.set(selector,{clientWidth:400,clientHeight:500,style:{},handlers:{},setAttribute(){},removeAttribute(){},focus(){},addEventListener(name,fn){this.handlers[name]=fn}});
  return elements.get(selector);
 };
 class Reveal {
  opens=[];clears=0;closes=0;
  open(mesh,book){this.opens.push(book)}
  clear(){this.clears++}
  close(){this.closes++}
  owns(){return true}
  update(){}
 }
 const browser={open(){},close(){},focus(){}};
 const context=vm.createContext({THREE,selectBookcase,CanvasGestures,cabinet,orbitDistance,panBounds,HoverDwell,BookReveal:Reveal,
  location:{search:`?case=${id}`},document:{querySelector:element,querySelectorAll:()=>[]},window:{addEventListener:(name,fn)=>windowHandlers[name]=fn},
  matchMedia:()=>({matches:false,addEventListener(){}}),createMobileBrowser:()=>browser,createDesktopSearch:()=>browser,
  requestAnimationFrame(){},performance});
 vm.runInContext(source.replace(/^import .*;\n/gm,'').replace(/start\(\);\s*$/,''),context);
 const run=script=>vm.runInContext(script,context);
 run(`camera=new THREE.PerspectiveCamera(38,1,.1,150);scene=new THREE.Scene();root=new THREE.Group();renderer={render(){}};clock.getDelta=()=>1/60;
 storage=bookcase.id==='wood'?undefined:{open:false,browseable:false,setOpen(open){this.open=open},update(){}};`);
 const frameStart=source.indexOf(' function frame(){'),frameEnd=source.indexOf(' }frame();',frameStart);
 run(source.slice(frameStart,frameEnd+2));
 return {run,key(key,shiftKey=false){const e={key,shiftKey,preventDefault(){}};element('#scene').handlers.keydown(e);windowHandlers.keydown(e)}};
}

test('a newer drawer selection supersedes an older queued book before the camera settles',()=>{
 const {run}=app('drawer');
 run('displayBook(books[0],true)');
 assert.equal(run('pendingBook'),run('books[0]'));
 run('storage.browseable=true;pitch=0;displayBook(books[1],true)');
 assert.equal(run('reveal.opens.at(-1)'),run('books[1]'));
 run('pitch=goalPitch;frame()');
 assert.equal(run('reveal.opens.length'),1);
 assert.equal(run('selected'),run('books[1]'));
 assert.equal(run('pendingBook'),null);
});

test('host Escape preserves animated returns for wood and glass and cancels queued drawer selection',()=>{
 for(const id of ['wood','glass']){
  const {run,key}=app(id);
  run('displayBook(books[0],true)');key('Escape');
  assert.equal(run('reveal.clears'),0,id);
  assert.ok(run('reveal.closes')>0,id);
  if(id==='glass')assert.equal(run('storage.open'),false);
 }
 const {run,key}=app('drawer');
 run('displayBook(books[0],true)');key('Escape');
 assert.equal(run('pendingBook'),null);
 assert.ok(run('reveal.clears')>0);
 run('storage.browseable=true;pitch=goalPitch;frame()');
 assert.equal(run('reveal.opens.length'),0);
});

test('drawer open and row presets survive frame clamping and share keyboard and gesture pan bounds',()=>{
 const {run,key}=app('drawer');
 run('setStorageOpen(true);frame()');assert.equal(run('goalX'),2.3);
 for(const [row,x] of [['0',2.3],['1',2.8]]){
  run(`setFocus('${row}');frame()`);assert.equal(run('goalX'),x);
 }
 for(let i=0;i<20;i++)key('ArrowRight',true);
 assert.equal(run('goalX'),3.5);
 for(let i=0;i<20;i++)key('ArrowLeft',true);
 assert.equal(run('goalX'),-1.5);
 run('setFocus("1");gestures.down(1,100,100,gestureView(),true);applyGesture(gestures.move(1,-10000,100));frame()');
 assert.equal(run('goalX'),3.5);
});
