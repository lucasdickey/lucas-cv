import test from 'node:test';
import assert from 'node:assert/strict';
import {CanvasGestures,canvasTapAction} from '../public/real-books/canvas-gestures.js';
const view={yaw:.1,pitch:0,x:0,y:6,zoom:1,width:400,height:500,distance:24,aspect:.8};
test('single finger rotates, a tap selects, and returning a drag to its origin never taps',()=>{
 const g=new CanvasGestures();g.down(1,100,100,view);assert.equal(g.move(1,104,103),null);assert.equal(g.up(1,view),true);
 g.down(2,100,100,view);const next=g.move(2,150,130);assert.ok(next.yaw>view.yaw&&next.pitch>view.pitch);assert.equal(next.x,0);assert.equal(next.zoom,1);
 g.move(2,100,100);assert.equal(g.up(2,view),false);
});
test('two fingers pan and pinch simultaneously without rotating',()=>{
 const g=new CanvasGestures();g.down(1,100,100,view);g.down(2,200,100,view);
 g.move(1,110,140);const next=g.move(2,250,140);
 assert.equal(next.zoom,1.4);assert.ok(next.x<0&&next.y>6);assert.equal(next.yaw,.1);assert.equal(next.pitch,0);
 assert.equal(g.up(1,next),false);assert.equal(g.up(2,next),false);
});
test('pinching contracts and clamps, and finger-count transitions do not jump or tap',()=>{
 const g=new CanvasGestures();g.down(1,100,100,view);g.down(2,200,100,view);
 const small=g.move(2,150,100);assert.equal(small.zoom,.75);
 const large=g.move(2,900,100);assert.equal(large.zoom,4);
 assert.equal(g.up(2,{...view,...large}),false);
 const stationary=g.move(1,100,100);assert.equal(stationary.zoom,large.zoom);assert.equal(stationary.yaw,large.yaw);assert.equal(stationary.x,large.x);
 assert.equal(g.up(1,stationary),false);
});
test('cancelled gestures and three-finger interruptions never produce a selection',()=>{
 const g=new CanvasGestures();g.down(1,0,0,view);g.down(2,50,0,view);g.down(3,100,0,view);
 assert.equal(g.up(1,view),false);assert.equal(g.up(3,view),false);assert.equal(g.up(2,view),false);
 g.down(4,0,0,view);g.cancel();assert.equal(g.active,false);assert.equal(g.up(4,view),false);
 g.down(5,0,0,view);assert.equal(g.up(5,view),true);
});
test('Shift-drag pans on a mouse without rotating',()=>{
 const g=new CanvasGestures();g.down(1,100,100,view,true);const next=g.move(1,140,130);
 assert.ok(next.x<0&&next.y>view.y);assert.equal(next.yaw,view.yaw);assert.equal(next.pitch,view.pitch);
});
test('door taps open; only empty canvas closes; book taps stay separate',()=>{
 assert.equal(canvasTapAction({doorHit:true,shelfHit:true,book:{},canBrowse:true}),'open');
 assert.equal(canvasTapAction({shelfHit:true,book:{},canBrowse:true}),'book');
 assert.equal(canvasTapAction({shelfHit:true,book:{},canBrowse:false}),'none');
 assert.equal(canvasTapAction({shelfHit:true,canBrowse:true}),'none');
 assert.equal(canvasTapAction({shelfHit:false,canBrowse:true}),'close');
});
