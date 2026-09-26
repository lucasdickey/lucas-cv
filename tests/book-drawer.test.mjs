import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../public/real-books/assets/three.module.js';
import {BookDrawer,addBookDrawer} from '../public/real-books/book-drawer.js';
import {createPickTarget,updatePickTarget} from '../public/real-books/interaction.js';
import {dragView} from '../public/real-books/navigation.js';
import {drawerBooks} from '../public/real-books/drawer-books.js';
import {selectBookcase} from '../public/real-books/bookcases.js';
import fs from 'node:fs';

test('book targets travel with the drawer but ignore hover extraction',()=>{
 const tray=new THREE.Group(),book=new THREE.Mesh(new THREE.BoxGeometry(.2,2,1));tray.add(book);
 book.rotation.x=-Math.PI/2;book.position.set(0,.5,-.8);
 const target=createPickTarget(book);tray.position.z=4.2;book.position.y+=.42;
 updatePickTarget(target);const point=target.getWorldPosition(new THREE.Vector3());
 assert.ok(Math.abs(point.z-3.4)<1e-10);assert.equal(point.y,.5);
 const normal=new THREE.Vector3(0,0,1).transformDirection(target.matrixWorld);
 assert.ok(normal.distanceTo(new THREE.Vector3(0,1,0))<1e-10);
});
test('drawer gestures preserve overhead pitch while other shelves keep existing limits',()=>{
 const view={mode:'turn',yaw:0,pitch:.85,x:2,y:5,dx:10,dy:10,width:390,height:500,distance:20,aspect:.78};
 assert.equal(dragView(view).pitch,.3);
 assert.ok(dragView({...view,maxPitch:1.15}).pitch>.85);
});
test('catalog preserves photographed order and the unidentified Stripe volume',()=>{
 assert.equal(selectBookcase('?case=drawer').books,drawerBooks);
 assert.equal(drawerBooks.length,23);assert.equal(drawerBooks[0].title,'A Light in the Attic');
 assert.equal(drawerBooks[21].title,'Bedtime in the Southwest');
 assert.equal(drawerBooks[22].coverFace,4);
 const unknown=drawerBooks.filter(b=>b.unidentified);assert.equal(unknown.length,1);assert.equal(unknown[0].author,'');
 for(const book of drawerBooks){assert.ok(Math.abs(book.layout.x)+book.layout.width/2<2.45);assert.ok(book.layout.z-book.layout.height/2>-2.02);assert.ok(book.layout.z+book.layout.height/2<2.02)}
});
test('drawer print matches and cover assets have provenance; no invented unknown match',()=>{
 const base=new URL('../public/real-books/',import.meta.url);
 const links=JSON.parse(fs.readFileSync(new URL('drawer-links.json',base))),covers=JSON.parse(fs.readFileSync(new URL('drawer-covers.json',base)));
 for(const b of drawerBooks){
  assert.ok(fs.existsSync(new URL(`assets/${b.spine.source}.jpg`,base)));
  if(b.unidentified){assert.equal(links[b.title],undefined);continue}
  const record=links[b.title];assert.ok(record,b.title);assert.ok(record.source.startsWith('https://')||fs.existsSync(new URL(`../${record.source}`,import.meta.url)));
  assert.equal([...record.isbn13].reduce((sum,n,i)=>sum+Number(n)*(i%2?3:1),0)%10,0,b.title);
  if(record.isbn13.startsWith('979'))assert.equal(record.asin,undefined);
  if(record.asin){assert.equal([...record.asin].reduce((sum,n,i)=>sum+(n==='X'?10:Number(n))*(10-i),0)%11,0,b.title);assert.equal(record.asin.slice(0,9),record.isbn13.slice(3,12))}
  const cover=covers[record.asin];if(cover)assert.ok(fs.statSync(new URL(cover.path,base)).size>3000);
 }
});

test('drawer starts closed, carries its contents, and reverses without jumping',()=>{
 const group=new THREE.Group(),book=new THREE.Object3D();book.position.set(0,4,0);group.add(book);
 const drawer=new BookDrawer(group);
 assert.equal(drawer.open,false);assert.equal(drawer.browseable,false);
 drawer.setOpen(true);drawer.update(.3);group.updateMatrixWorld(true);
 const position=group.position.z;
 assert.ok(position>0);assert.equal(book.getWorldPosition(new THREE.Vector3()).z,position);
 drawer.setOpen(false);assert.equal(group.position.z,position);assert.equal(drawer.browseable,false);
 drawer.update(.1);assert.ok(group.position.z<position);
 for(let i=0;i<120;i++)drawer.update(1/60);
 assert.equal(group.position.z,0);
});
test('drawer motion is frame-rate independent, clamps, and honours reduced motion',()=>{
 const a=new BookDrawer(new THREE.Group()),b=new BookDrawer(new THREE.Group());
 a.setOpen(true);b.setOpen(true);a.update(.25);
 for(let i=0;i<25;i++)b.update(.01);
 assert.ok(Math.abs(a.group.position.z-b.group.position.z)<1e-10);
 a.update(10);assert.equal(a.group.position.z,a.travel);assert.equal(a.browseable,true);
 const reduced=new BookDrawer(new THREE.Group(),true);reduced.setOpen(true);
 assert.equal(reduced.group.position.z,reduced.travel);assert.equal(reduced.browseable,true);
 reduced.setOpen(false);assert.equal(reduced.group.position.z,0);
});
test('drawer interior is open above, closed face blocks picking, and contents can attach to tray',()=>{
 const root=new THREE.Group(),mat=(color,options={})=>new THREE.MeshStandardMaterial({color,...options});
 const box=(w,h,d,x,y,z,material,parent=root)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);parent.add(m);return m};
 const drawer=addBookDrawer({box,mat,root,reduced:true});
 assert.equal(drawer.contents.parent,drawer.group);
 root.updateMatrixWorld(true);
 const ray=new THREE.Raycaster(new THREE.Vector3(2.65,4.7,12),new THREE.Vector3(0,0,-1));
 assert.equal(ray.intersectObject(root,true)[0].object.userData.bookDrawer,true);
 drawer.setOpen(true);root.updateMatrixWorld(true);
 const topRay=new THREE.Raycaster(new THREE.Vector3(2.65,12,6),new THREE.Vector3(0,-1,0));
 const first=topRay.intersectObject(root,true)[0];
 assert.equal(first.object.name,'drawer-floor');
});
