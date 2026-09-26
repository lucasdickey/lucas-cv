import * as THREE from './assets/three.module.js';

// The face, tray and books share one transform; reversing never resets the pose.
export class BookDrawer {
 constructor(group,reduced=false){this.group=group;this.reduced=reduced;this.open=false;this.travel=4.2;this.offset=0;this.apply()}
 setOpen(open){this.open=open;if(this.reduced){this.offset=open?this.travel:0;this.apply()}}
 update(dt){const target=this.open?this.travel:0;this.offset+=(target-this.offset)*(1-Math.exp(-Math.max(0,dt)*7));if(Math.abs(target-this.offset)<.001)this.offset=target;this.apply()}
 apply(){this.group.position.z=this.offset}
 get browseable(){return this.open&&this.offset>this.travel*.9}
}

// Photo-derived proportions, not a measured CAD model. +Z is out of the cabinet.
export function addBookDrawer({box,mat,root,reduced=false,counterTexture}){
 const paint=mat('#e4e3de',{roughness:.55}),inset=mat('#d8d8d2',{roughness:.65});
 const interior=mat('#efeee6',{roughness:.7}),stone=mat('#f0efe7',{roughness:.38});
 const brass=mat('#ad9159',{metalness:.8,roughness:.3});
 const moving=new THREE.Group();moving.name='book-drawer';root.add(moving);
 function face(x,y,parent,active=false){
  const parts=[];
  parts.push(box(5.12,3.42,.15,x,y,2.33,inset,parent));
  for(const dx of [-2.39,2.39])parts.push(box(.34,3.42,.22,x+dx,y,2.40,paint,parent));
  for(const dy of [-1.54,1.54])parts.push(box(4.46,.34,.22,x,y+dy,2.40,paint,parent));
  const handle=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,1.65,20),brass);
  handle.rotation.z=Math.PI/2;handle.position.set(x,y+.12,2.73);parent.add(handle);parts.push(handle);
  for(const dx of [-.83,.83]){
   const mount=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.25,16),brass);
   mount.rotation.x=Math.PI/2;mount.position.set(x+dx,y+.12,2.61);parent.add(mount);parts.push(mount);
  }
  for(const part of parts){part.castShadow=true;part.receiveShadow=true;if(active)part.userData.bookDrawer=true}
 }
 // Adjacent drawers supply context; only the upper-right drawer contains books.
 box(10.7,7.25,.15,0,3.85,-2.1,paint);
 for(const x of [-5.3,0,5.3])box(.16,7.3,4.45,x,3.8,.08,paint);
 box(10.7,.18,4.45,0,.2,.08,paint);
 const stoneTop=counterTexture?mat('#ffffff',{map:counterTexture,roughness:.38}):stone;
 box(10.95,.32,4.8,0,7.6,.16,[stone,stone,stoneTop,stone,stone,stone]);
 box(10.6,.26,.14,0,7.3,2.28,paint);
 box(10.4,.46,.16,0,.2,1.96,mat('#b2b3ae'));
 face(-2.65,5.44,root);face(-2.65,1.94,root);face(2.65,1.94,root);
 face(2.65,5.44,moving,true);
 // Shallow inner tray and rails remain below the upward-facing book spines.
 const floor=box(4.91,.12,4.16,2.65,3.9,.08,interior,moving);floor.name='drawer-floor';
 for(const x of [.23,5.07]){
  box(.12,1.18,4.16,x,4.55,.08,interior,moving);
  box(.08,.12,4.0,x,5.28,.08,mat('#acb0ae',{metalness:.7,roughness:.35}),moving);
 }
 box(4.91,1.18,.12,2.65,4.55,-1.94,interior,moving);
 // The inner drawer above the book row is visible when the large face slides out.
 box(4.96,.82,.13,2.65,6.94,2.21,interior);
 const contents=new THREE.Group();contents.name='drawer-contents';contents.position.set(2.65,3.97,.08);moving.add(contents);
 const drawer=new BookDrawer(moving,reduced);drawer.contents=contents;return drawer;
}
