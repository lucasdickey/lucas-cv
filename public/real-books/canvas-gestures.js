import {dragView} from './navigation.js?v=controls-2';
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
function measure(points){
 const [a,b]=points.values();
 return b?{x:(a.x+b.x)/2,y:(a.y+b.y)/2,span:Math.hypot(b.x-a.x,b.y-a.y)}:{...a,span:0};
}
// Pointer-count transitions rebase the gesture; a multi-touch sequence can never tap.
export class CanvasGestures {
 constructor(){this.points=new Map();this.moved=false;this.pan=false}
 get active(){return this.points.size>0}
 rebase(view){if(this.active){this.origin=measure(this.points);this.view={...view};this.mode=this.points.size>1||this.pan?'pan':'turn'}}
 down(id,x,y,view,pan=false){
  if(!this.active){this.moved=false;this.pan=pan}
  this.points.set(id,{x,y});if(this.points.size>1)this.moved=true;
  this.rebase(view);
 }
 move(id,x,y){
  if(!this.points.has(id))return null;
  this.points.set(id,{x,y});const point=measure(this.points),dx=point.x-this.origin.x,dy=point.y-this.origin.y;
  if(Math.hypot(dx,dy)>8)this.moved=true;
  if(!this.moved)return null;
  const ratio=this.points.size>1&&this.origin.span>1?point.span/this.origin.span:1;
  return {...dragView({...this.view,mode:this.mode,dx,dy}),zoom:clamp(this.view.zoom*ratio,.75,4)};
 }
 up(id,view){
  if(!this.points.has(id))return false;
  const tap=this.points.size===1&&!this.moved;
  this.points.delete(id);if(this.active){this.moved=true;this.rebase(view)}
  return tap;
 }
 cancel(){this.points.clear();this.moved=true}
}
export function canvasTapAction({doorHit,shelfHit,book,canBrowse}){
 if(doorHit)return 'open';
 if(canBrowse&&book)return 'book';
 return shelfHit?'none':'close';
}
