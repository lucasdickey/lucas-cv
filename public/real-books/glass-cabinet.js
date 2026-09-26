import * as THREE from './assets/three.module.js';

// Reversible, frame-rate-independent hinges. Reduced motion changes state instantly.
export class CabinetDoors {
 constructor(hinges,reduced=false){this.hinges=hinges;this.reduced=reduced;this.open=false;this.angle=0;this.apply()}
 setOpen(open){this.open=open;if(this.reduced){this.angle=open?Math.PI/2:0;this.apply()}}
 update(dt){const target=this.open?Math.PI/2:0;this.angle+=(target-this.angle)*(1-Math.exp(-Math.max(0,dt)*7));if(Math.abs(target-this.angle)<.001)this.angle=target;this.apply()}
 apply(){this.hinges.forEach((hinge,i)=>{hinge.rotation.y=(i===0?-1:1)*this.angle})}
 get browseable(){return this.open&&this.angle>1.35}
}

export function addGlassCabinet({box,mat,root,reduced=false}){
 const white=mat('#e2e2d8'),gray=mat('#898d98'),edge=mat('#527c72',{metalness:.35,roughness:.24});
 const glass=mat('#b4d2c7',{transparent:true,opacity:.16,roughness:.16,metalness:.15,depthWrite:false});
 box(10.55,11.2,.15,0,5.7,-1.12,white);
 for(const x of [-5.22,5.22]){
  box(.17,11.4,2.65,x,5.7,.13,white);
  for(let y=.9;y<11;y+=.33){
   const hole=new THREE.Mesh(new THREE.CircleGeometry(.021,8),mat('#888e84'));
   hole.rotation.y=x<0?Math.PI/2:-Math.PI/2;hole.position.set(x+(x<0?.09:-.09),y,.85);root.add(hole);
  }
 }
 for(const y of [.08,11.36])box(10.6,.16,2.65,0,y,.13,white);
 for(const y of [3.64,7.49]){
  const shelf=box(10.4,.075,2.65,0,y,.13,glass);shelf.castShadow=false;
  box(10.4,.055,.035,0,y,1.46,edge);
  for(const x of [-5.08,5.08])box(.12,.12,.3,x,y-.1,.72,mat('#a6aaa5',{metalness:.8}));
 }
 // Narrow six-level wine rack beside the glazed cabinet.
 box(2.25,11.4,.15,-6.45,5.7,-1.12,gray);
 box(.16,11.4,2.65,-7.6,5.7,.13,gray);
 for(let i=0;i<=6;i++)box(2.3,.13,2.65,-6.45,.08+i*1.88,.13,gray);
 const bottleGreen=mat('#273833',{roughness:.25,metalness:.15}),bottleBlue=mat('#233b52',{roughness:.25});
 for(let row=0;row<6;row++){
  const bottle=new THREE.Group();bottle.position.set(-6.45,.52+row*1.88,.0);bottle.rotation.x=Math.PI/2;root.add(bottle);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,1.25,20),row===0?bottleBlue:bottleGreen);bottle.add(body);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.12,.28,.36,20),bottleGreen);neck.position.y=.79;bottle.add(neck);
  const foil=new THREE.Mesh(new THREE.CylinderGeometry(.125,.125,.33,16),mat(row%2?'#ccb980':'#d8ddd2'));foil.position.y=1.09;bottle.add(foil);
 }
 // Each door has two columns and four rows of glass, as in the closed reference.
 const hinges=[];
 for(const side of [-1,1]){
  const hinge=new THREE.Group();hinge.position.set(side*5.2,0,1.6);root.add(hinge);hinges.push(hinge);
  const direction=-side,w=5.15,h=11.3;
  for(const x of [0,w/2,w])box(.16,h,.17,direction*x,5.7,0,gray,hinge);
  for(const y of [.13,2.95,5.77,8.59,11.35])box(w,.17,.17,direction*w/2,y,0,gray,hinge);
  const pane=box(w-.16,h-.18,.025,direction*w/2,5.7,-.02,glass,hinge);pane.castShadow=false;
  const knob=new THREE.Mesh(new THREE.SphereGeometry(.105,16,12),mat('#b8a370',{metalness:.8,roughness:.3}));knob.position.set(direction*(w-.3),1.0,.19);hinge.add(knob);
 }
 return new CabinetDoors(hinges,reduced);
}

// Open ceramic vessels keep the lower compartment recognisable from every angle.
export function addCupShelf({box,mat,root}){
 const ceramic=mat('#dad9cc'),blue=mat('#24416c'),copper=mat('#b98965',{metalness:.8,roughness:.24});
 function cup(x,y,z,r,h,material){
  const shape=new THREE.LatheGeometry([new THREE.Vector2(0,0),new THREE.Vector2(r*.8,0),new THREE.Vector2(r,h),new THREE.Vector2(r-.035,h),new THREE.Vector2(r*.8-.035,.07),new THREE.Vector2(0,.07)],24);
  const mug=new THREE.Mesh(shape,material);mug.position.set(x,y,z);root.add(mug);
  const handle=new THREE.Mesh(new THREE.TorusGeometry(r*.64,.055,10,24),material);handle.position.set(x+r,y+h*.55,z);root.add(handle);
 }
 cup(-3.9,.17,.3,.39,1.04,blue);cup(-2.8,.17,.9,.34,.74,copper);cup(-1.7,.17,.35,.40,.78,ceramic);
 cup(-3.4,.17,-.55,.36,.76,ceramic);cup(-2.3,.17,-.55,.35,.88,ceramic);cup(-.55,.17,-.3,.36,.88,mat('#85866b'));
 const black=mat('#202725',{metalness:.45,roughness:.28}),steel=mat('#b1b9b7',{metalness:.85,roughness:.22});
 const jar=new THREE.Mesh(new THREE.CylinderGeometry(.58,.58,1.66,32),black);jar.position.set(1.45,1.0,.2);root.add(jar);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(.63,.63,.09,32),steel);lid.position.set(1.45,1.87,.2);root.add(lid);
 box(.17,.48,.05,1.45,1.03,.78,steel);
 cup(2.9,.17,.35,.39,.94,ceramic);cup(4.05,.17,.6,.34,.74,mat('#a57c51'));
 const tin=new THREE.Mesh(new THREE.CylinderGeometry(.36,.48,1.9,24),mat('#3d3025'));tin.position.set(4.25,1.12,-.5);root.add(tin);
}

export function addGlassDecor({box,mat,root}){
 const cabinetRoot=root;root=new THREE.Group();root.position.y=3;cabinetRoot.add(root);
 const addBox=box;box=(...args)=>addBox(...args,root);
 // Panama hat and two handheld devices, on the top shelf beside the books.
 const straw=mat('#b9ac86');
 const brim=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.055,40),straw);brim.scale.z=.68;brim.position.set(3.18,5.08,-.15);root.add(brim);
 const crown=new THREE.Mesh(new THREE.CylinderGeometry(.40,.53,.54,32),straw);crown.position.set(3.18,5.35,-.15);root.add(crown);
 const band=new THREE.Mesh(new THREE.CylinderGeometry(.49,.52,.12,32),mat('#262823'));band.position.set(3.18,5.14,-.15);root.add(band);
 box(1.48,.15,.52,4.08,5.04,.6,mat('#716288'));
 box(.56,.12,.2,4.08,5.13,.7,mat('#272c35'));
 box(.84,.92,.25,2.52,5.04,.86,mat('#ca623e'));
 box(.66,.54,.03,2.52,5.16,1.005,mat('#263c42',{roughness:.24}));
 for(const x of [2.34,2.7])box(.11,.12,.035,x,4.75,1.01,mat('#784b42'));
 // Miniature blue and white sneaker on its shoebox, in front of the lower row.
 box(.8,.28,.6,1.06,.87,1.08,mat('#202224'));
 box(.83,.045,.62,1.06,1.03,1.08,mat('#23282a'));
 const sole=box(.95,.095,.39,1.03,1.12,1.12,mat('#e7e3d7'));
 sole.rotation.z=.05;
 box(.73,.18,.36,1.08,1.24,1.12,mat('#316ca3'));
 box(.30,.32,.34,1.32,1.43,1.12,mat('#245989'));
 box(.5,.11,.015,.99,1.27,1.31,mat('#e8e7da'));
 box(.23,.045,.018,1.10,1.29,1.33,mat('#202629'));
}
