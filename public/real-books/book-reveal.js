import * as THREE from './assets/three.module.js';

const clamp=t=>Math.max(0,Math.min(1,t));
export const revealPhases=progress=>({pull:THREE.MathUtils.smoothstep(progress/.3,0,1),fly:THREE.MathUtils.smoothstep((progress-.3)/.7,0,1)});
export const isProjectedSourceVisible=(projected,stage,width,height)=>{
 const x=stage.left+(projected.x+1)*stage.width/2,y=stage.top+(1-projected.y)*stage.height/2;
 return projected.z>=-1&&projected.z<=1&&x>=0&&x<=width&&y>=0&&y<=height&&x>=stage.left&&x<=stage.left+stage.width&&y>=stage.top&&y<=stage.top+stage.height;
};

// A reversible playhead avoids snapping when Escape interrupts a selection.
export class RevealMotion {
 constructor(reduced=false,initialPull=0){this.progress=.3*(.5-Math.sin(Math.asin(1-2*clamp(initialPull))/3));this.direction=1;this.reduced=reduced}
 close(){this.direction=-1}
 advance(dt){this.progress=this.reduced?(this.direction===1?1:0):clamp(this.progress+this.direction*dt/.8)}
 get returned(){return this.direction===-1&&this.progress===0}
}

function pageEdges(){
 const canvas=document.createElement('canvas');canvas.width=32;canvas.height=256;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#ede5ce';ctx.fillRect(0,0,32,256);
 ctx.fillStyle='#c9c0a8';for(let y=0;y<256;y+=4)ctx.fillRect(0,y,32,1);
 return new THREE.CanvasTexture(canvas);
}

function fallbackCover(book){
 const canvas=document.createElement('canvas');canvas.width=400;canvas.height=600;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#294236';ctx.fillRect(0,0,400,600);
 ctx.strokeStyle='#c6aa70';ctx.strokeRect(22,22,356,556);ctx.fillStyle='#eeeade';ctx.font='32px Georgia';
 let line='',y=130;
 for(const word of book.title.split(' ')){
  if(ctx.measureText(line+word).width>310){ctx.fillText(line,44,y);line='';y+=42}
  line+=word+' ';
 }
 ctx.fillText(line,44,y);ctx.font='20px Georgia';ctx.fillText(book.author||'From the collection',44,520,310);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

export class BookReveal {
 constructor({host,detail,dialog,getCamera,onReturned,reduced=false}){
  Object.assign(this,{host,detail,dialog,getCamera,onReturned,reduced});this.active=null;
 }
 owns(mesh){return this.active?.source===mesh}
 initRenderer(){
  if(this.renderer)return;
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.domElement.className='book-flight';this.renderer.domElement.setAttribute('aria-hidden','true');
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera();
  this.scene.add(new THREE.HemisphereLight('#fff8e8','#756955',3));
  const light=new THREE.DirectionalLight('#ffffff',2);light.position.set(-3,6,10);this.scene.add(light);
 }
 open(source,book,art){
  this.clear();
  if(!source)return;
  const rest=source.position.clone();rest.z=source.userData.restZ;
  const pull=source.geometry.parameters.depth+.35,motion=new RevealMotion(this.reduced,(source.position.z-rest.z)/pull);
  const record={source,book,motion,rest,pull};
  this.active=record;
  this.detail.classList.add('book-in-transit');
  const r=this.host.getBoundingClientRect(),camera=this.getCamera();
  const projected=source.getWorldPosition(new THREE.Vector3()).project(camera);
  // Catalog selections made below the stage still get an immediate, accessible card.
  const onScreen=isProjectedSourceVisible(projected,r,innerWidth,innerHeight);
  if(this.reduced||!onScreen){motion.reduced=true;return}
  try{
   this.initRenderer();
   (this.dialog.open?this.dialog:document.body).append(this.renderer.domElement);
   const materials=source.material.map(m=>m.clone());
   materials.forEach(m=>{m.emissive?.setHex(0)});
   record.materials=materials;record.texture=fallbackCover(book);
   const face=book.horizontal?2:0;
   materials[face].dispose();
   materials[face]=new THREE.MeshStandardMaterial({map:record.texture,roughness:.72});
   record.pages=pageEdges();
   for(const index of (book.horizontal?[3,5]:[1,2,3])){materials[index].color.set('#ffffff');materials[index].map=record.pages}
   record.clone=new THREE.Mesh(source.geometry,materials);this.scene.add(record.clone);
   if(art){
    const image=new Image();image.onload=()=>{
     if(this.active!==record)return;
     record.texture.dispose();record.texture=new THREE.Texture(image);record.texture.colorSpace=THREE.SRGBColorSpace;record.texture.needsUpdate=true;
     materials[face].map=record.texture;materials[face].needsUpdate=true;
    };image.src=art.path;
   }
  }catch(error){
   console.warn('Book reveal unavailable; showing the cover card.',error);
   motion.reduced=true;
  }
 }
 close(){if(!this.active){this.onReturned();return}this.active.motion.close()}
 clear(){
  const record=this.active;if(!record)return;
  record.source.visible=true;record.source.position.copy(record.rest);record.source.scale.setScalar(1);
  if(record.clone)this.scene.remove(record.clone);
  record.materials?.forEach(m=>m.dispose());record.texture?.dispose();record.pages?.dispose();
  this.active=null;this.renderer?.domElement.remove();
  this.detail.classList.remove('book-in-transit','book-returning');
  this.host.classList.remove('book-selected');this.dialog.classList.remove('reveal-running');
 }
 update(dt){
  const record=this.active;if(!record)return;
  const {source,motion,rest}=record;
  if(record.settled&&motion.direction===1)return;
  motion.advance(dt);record.settled=motion.progress===1;
  if(motion.returned){this.clear();this.onReturned();return}
  const {pull,fly}=revealPhases(motion.progress);
  this.detail.classList.toggle('book-in-transit',motion.progress<1);
  this.detail.classList.toggle('book-returning',motion.direction<0);
  this.dialog.classList.toggle('reveal-running',motion.progress<.88||motion.direction<0);
  this.host.classList.toggle('book-selected',motion.progress>.3);
  source.scale.setScalar(1);source.position.copy(rest);source.position.z+=pull*record.pull;
  source.visible=motion.progress<=.3;
  if(!record.clone)return;
  const canvas=this.renderer.domElement;
  canvas.hidden=motion.progress<=.3||motion.progress===1;
  if(canvas.hidden)return;
  const r=this.host.getBoundingClientRect(),view=this.getCamera();
  this.camera.copy(view);
  // Extend the stage projection across the viewport: the first overlay frame
  // exactly matches the book's original perspective, even after pan or tilt.
  this.camera.setViewOffset(r.width,r.height,-r.left,-r.top,innerWidth,innerHeight);
  this.camera.updateMatrixWorld();
  if(this.width!==innerWidth||this.height!==innerHeight){this.width=innerWidth;this.height=innerHeight;this.renderer.setSize(innerWidth,innerHeight)}
  const art=this.detail.querySelector('#book-cover'),target=art.hidden?this.detail.querySelector('.cover-display'):art;
  const end=target.getBoundingClientRect();
  if(!end.width||!end.height){motion.reduced=true;return}
  const distance=6,pixelsPerUnit=r.height/(2*Math.tan(view.fov*Math.PI/360)*distance);
  const center=new THREE.Vector3((end.left+end.width/2)/innerWidth*2-1,1-(end.top+end.height/2)/innerHeight*2,.5).unproject(this.camera);
  const direction=center.sub(this.camera.position).normalize();
  const forward=new THREE.Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
  const destination=this.camera.position.clone().addScaledVector(direction,distance/direction.dot(forward));
  const start=rest.clone();start.z+=record.pull;
  record.clone.position.lerpVectors(start,destination,fly);
  const turn=new THREE.Quaternion().setFromEuler(new THREE.Euler(record.book.horizontal?Math.PI/2:0,record.book.horizontal?0:-Math.PI/2,0));
  const orientation=this.camera.quaternion.clone().multiply(turn);
  record.clone.quaternion.copy(source.quaternion).slerp(orientation,fly);
  const {width,height,depth}=source.geometry.parameters;
  const size=record.book.horizontal?new THREE.Vector3(end.width/pixelsPerUnit/width,1,end.height/pixelsPerUnit/depth):new THREE.Vector3(1,end.height/pixelsPerUnit/height,end.width/pixelsPerUnit/depth);
  record.clone.scale.lerpVectors(new THREE.Vector3(1,1,1),size,fly);
  this.renderer.render(this.scene,this.camera);
 }
}
