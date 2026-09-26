import * as THREE from './assets/three.module.js';

// Real geometry for the white cabinet and green-edged glass shelves. Objects
// remain in the scene when the viewer turns, rather than moving with a photograph.
export function addGlassCabinet({box,mat,root}){
 const white=mat('#e2e2d8'),edge=mat('#527c72',{metalness:.35,roughness:.24});
 const glass=mat('#b4d2c7',{transparent:true,opacity:.24,roughness:.16,metalness:.15,depthWrite:false});
 box(10.55,8,.15,0,4.15,-1.12,white);
 for(const x of [-5.22,5.22]){
  box(.17,8.2,2.65,x,4.2,.13,white);
  for(let y=.9;y<8;y+=.33){
   const hole=new THREE.Mesh(new THREE.CircleGeometry(.021,8),mat('#888e84'));
   hole.rotation.y=x<0?Math.PI/2:-Math.PI/2;hole.position.set(x+(x<0?.09:-.09),y,.85);root.add(hole);
  }
 }
 box(10.6,.16,2.65,0,8.3,.13,white);
 for(const y of [.64,4.49]){
  const shelf=box(10.4,.075,2.65,0,y,.13,glass);shelf.castShadow=false;
  box(10.4,.055,.035,0,y,1.46,edge);
  for(const x of [-5.08,5.08])box(.12,.12,.3,x,y-.1,.72,mat('#a6aaa5',{metalness:.8}));
 }
}
export function addGlassDecor({box,mat,root}){
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
