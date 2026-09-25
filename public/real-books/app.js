import * as THREE from './assets/three.module.js';
import { books } from './books.js?v=closeups-5';
import { createSpineCanvas } from './spine-texture.js';
import { cabinet, orbitDistance, panGeometry, dragView, visibleBook } from './navigation.js?v=controls-2';
import { createMobileBrowser } from './mobile.js?v=reveal-1';
import { BookReveal } from './book-reveal.js?v=reveal-1';
import { createPickTarget, HoverDwell, zoomFactor } from './interaction.js';
const $=s=>document.querySelector(s), host=$('#scene');
const mobile=matchMedia('(max-width: 760px), (max-width: 1000px) and (max-height: 500px)');
books.forEach((book,id)=>{book.id=id});
const mobileBrowser=createMobileBrowser(books,book=>displayBook(book,true),closeBook);
let focusedRow='all',navigationTool='turn',targetX=0,goalX=0;
const sourceFiles=['top','top','middle','bottom','bottom'];
const sources={};
let covers={},pickTargets=[],occluders=[];
const dwell=new HoverDwell(),mouse={x:0,y:0};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const yBase=[10.7,8.25,5.8,3.35,.9], photoBounds=[[62,1240],[62,1240],[70,1245],[50,1258],[50,1258]];
let renderer,scene,camera,root,bookMeshes=[],selected=null,hovered=null,drag=null,pointer=new THREE.Vector2(9,9),needsPick=false;
let yaw=mobile.matches?0:.13,pitch=mobile.matches?0:.015,goalYaw=yaw,goalPitch=pitch,zoom=1,targetY=7.05,goalY=7.05,goalZoom=1,baseDistance=24;
const raycaster=new THREE.Raycaster(), clock=new THREE.Clock();
const reveal=new BookReveal({host,detail:$('#book-detail'),dialog:$('#book-dialog'),getCamera:()=>camera,reduced,onReturned:()=>{mobileBrowser.close();resetDetail()}});
const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.8,...extra});
function box(w,h,d,x,y,z,material,parent=root){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
function cropMaterial(name,rect){const tex=sources[name].texture;const material=new THREE.MeshStandardMaterial({map:tex,roughness:.87});material.userData.crop=rect;return material}
function applyCrop(geometry,rect,name,frontOnly=true){const uv=geometry.attributes.uv;const image=sources[name].image;const [x,y,w,h]=rect;for(let i=frontOnly?16:0;i<(frontOnly?20:uv.count);i++){const u=uv.getX(i),v=uv.getY(i);uv.setXY(i,(x+u*w)/image.width,1-(y+(1-v)*h)/image.height)}uv.needsUpdate=true}
function photoBox(w,h,d,x,y,z,name,rect,side){const m=cropMaterial(name,rect);const mesh=box(w,h,d,x,y,z,[side,side,mat('#ddd7bb'),side,m,side]);applyCrop(mesh.geometry,rect,name);return mesh}
function sampleColor(name,r){const c=sources[name].canvas.getContext('2d').getImageData(Math.min(r[0]+Math.floor(r[2]/2),sources[name].canvas.width-1),Math.min(r[1]+Math.floor(r[3]/2),sources[name].canvas.height-1),1,1).data;return new THREE.Color(`rgb(${c[0]},${c[1]},${c[2]})`)}
function addShelf(){
 const frame=mat('#241c17'),wood=mat('#4b2319'),leftSide=mat('#ffffff',{map:sources['surfaces/left-side'].texture}),rightSide=mat('#ffffff',{map:sources['surfaces/right-side'].texture}),gold=mat('#998157',{metalness:.55,roughness:.5});
 box(10.35,13.2,.16,0,6.65,cabinet.back,wood);
 box(.2,13.3,cabinet.depth,-5.2,6.65,-.04,[frame,leftSide,frame,frame,frame,frame]);
 box(.2,13.3,cabinet.depth,5.2,6.65,-.04,[rightSide,frame,frame,frame,frame,frame]);
 box(10.6,.2,cabinet.depth+.1,0,13.3,-.04,frame);
 for(let r=0;r<5;r++){
  const y=yBase[r]-.13;box(10.5,.2,cabinet.depth,0,y,-.04,wood);
  const rail=[['top',[40,400,1217,45]],['top',[50,784,1210,43]],['middle',[50,456,1210,42]],['bottom',[25,521,1230,39]],['bottom',[37,886,1216,38]]][r];photoBox(10.66,.38,.17,0,y-.12,1.02,rail[0],rail[1],mat('#654522'));
  const cols=r===0?8:4;
  for(let j=1;j<cols;j++)box(.105,r===0?2.5:2.26,cabinet.depth-.06,-5.1+j*10.2/cols,y+(r===0?1.29:1.15),-.04,frame);
 }
 for(let j of [-1,1]){photoBox(5.02,.59,.25,j*2.58,.3,.96,'full',j===-1?[199,1182,272,46]:[485,1184,274,40],mat('#785727'));for(let k of [-.95,.95]){const knob=new THREE.Mesh(new THREE.SphereGeometry(.065,12,10),gold);knob.position.set(j*2.58+k,.33,1.15);root.add(knob)}}
 box(10.55,.16,cabinet.depth,0,-.1,-.04,frame);for(let x of [-5.1,5.1])box(.22,.45,1.6,x,-.31,0,frame);
}
function addBooks(){books.forEach((b,i)=>{b.id=i;const name=b.textureSource||sourceFiles[b.row],r=b.rect,[left,right]=photoBounds[b.row];let w=r[2]/(right-left)*10.1,h=r[3]/(b.row===0?212:b.row===1?232:250)*(b.row===0?1.9:1.98);const x=((r[0]+r[2]/2-left)/(right-left)-.5)*10.1;let y=yBase[b.row]+h/2;
 if(b.horizontal){h=r[3]/250*1.98;y=yBase[b.row]+(515-r[1]-r[3]/2)/250*1.98}
 if(b.elevation!==undefined)y=yBase[b.row]+b.elevation+h/2;
 const textureRect=b.textureRect||r;
 const depth=b.horizontal?1.35:THREE.MathUtils.clamp(h*.7,.85,1.65),restZ=.8-depth/2,side=mat(sampleColor(name,textureRect));const mesh=photoBox(Math.max(.045,w-.012),h,depth,x,y,restZ,name,textureRect,side);mesh.userData.book=b;mesh.userData.restZ=restZ;mesh.userData.baseEmissive=0;bookMeshes.push(mesh);pickTargets.push(createPickTarget(mesh));
 });$('#book-count').textContent=books.filter(b=>!b.nonBook).length;
 const select=$('#book-select');for(let row=0;row<5;row++){const group=document.createElement('optgroup');group.label=`Shelf ${row+1}`;books.filter(b=>b.row===row).forEach(b=>{const o=document.createElement('option');o.value=b.id;o.textContent=b.title+(b.author?' — '+b.author:'');group.append(o)});select.append(group)}
}
function decor(){
 const pot=new THREE.Mesh(new THREE.CylinderGeometry(.58,.44,.60,28),mat('#a89d71'));pot.position.set(-4,13.71,0);pot.castShadow=true;root.add(pot);
 const stemMat=mat('#497035'),leafMat=mat('#648a36',{side:THREE.DoubleSide});
 for(let k=0;k<13;k++){const points=[];const a=k*2.4,L=1.1+(k%4)*.27;for(let j=0;j<=12;j++){const t=j/12;points.push(new THREE.Vector3(-4+Math.cos(a)*L*t,14+Math.sin(t*2.8)*.72-t*t*(k%3===0?1.5:.22),Math.sin(a)*L*t))}const curve=new THREE.CatmullRomCurve3(points);const stem=new THREE.Mesh(new THREE.TubeGeometry(curve,18,.012,4,false),stemMat);root.add(stem);for(let j=1;j<12;j++){const t=j/12,p=curve.getPoint(t);for(let s of [-1,1]){const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,8,4),leafMat);leaf.scale.set(.10*(1-t*.5),.025,.26*(1-t*.65));leaf.position.copy(p);leaf.position.x+=s*.1;leaf.rotation.y=a+s*.7;leaf.rotation.z=s*.4;root.add(leaf)}}}
 for(let i=0;i<3;i++){const capMat=mat(i===1?'#111e1c':'#b8bfba');const cap=new THREE.Mesh(new THREE.SphereGeometry(.48,22,12,0,Math.PI*2,0,Math.PI/2),capMat);cap.position.set(.7+i*1.55,13.42,0);root.add(cap);const bill=new THREE.Mesh(new THREE.SphereGeometry(1,20,8),capMat);bill.scale.set(.48,.025,.4);bill.position.set(.7+i*1.55,13.43,.43);root.add(bill);if(i!==1)box(.18,.2,.025,.7+i*1.55,13.63,.425,mat('#257493'))}
 for(let x of [-1.65,1.75]){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.52,1),mat('#baae8b'));rock.scale.set(1,1.15,.7);rock.position.set(x,8.55,.33);rock.castShadow=true;root.add(rock)}
 const wire=mat('#181918',{metalness:.65});for(let y of [3.5,3.7,3.9,4.1,4.3]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.48+(y-3.5)*.17,.014,6,40),wire);ring.rotation.x=Math.PI/2;ring.position.set(-1.32,y,.2);root.add(ring)}for(let k=0;k<14;k++){let a=k/14*Math.PI*2;const line=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,.9,5),wire);line.position.set(-1.32+Math.cos(a)*.56,3.9,.2+Math.sin(a)*.56);root.add(line)}const stone=new THREE.Mesh(new THREE.IcosahedronGeometry(.34,0),mat('#b87647'));stone.position.set(-1.32,3.62,.2);root.add(stone);
 const car=box(.55,.13,.25,3.8,3.52,.65,mat('#dddeda'));box(.28,.11,.22,3.78,3.63,.65,mat('#8b9999'));for(let x of [3.64,3.98])for(let z of [.49,.79]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.03,12),mat('#111511'));wheel.rotation.x=Math.PI/2;wheel.position.set(x,3.46,z);root.add(wheel)}
}
function displayBook(book,open=false) {
 if (!book) return;
 if(open){mobileBrowser.open();if(!mobile.matches)$('aside').scrollTop=0}
 if(open){clearHover();reveal.open(bookMeshes.find(m=>m.userData.book===book),book,covers[book.asin]);$('#return-book').hidden=false}
 if (selected === book) return;
 selected=book;
 const cover=$('#book-cover'),fallback=$('#cover-fallback'),art=book.nonBook?null:covers[book.asin];
 cover.hidden=true;
 fallback.hidden=false;
 fallback.textContent=book.nonBook?'Personal notebook':art?'Loading cover…':book.unidentified?'Choose an identified book to see its cover.':'Cover artwork unavailable for this edition.';
 cover.onload=()=>{if(selected!==book)return;cover.hidden=false;fallback.hidden=true};
 cover.onerror=()=>{if(selected!==book)return;cover.hidden=true;fallback.hidden=false;fallback.textContent='Cover artwork unavailable for this edition.'};
 cover.alt=`${book.title} — full cover from Amazon`;
 if(art)cover.src=art.path;else cover.removeAttribute('src');
 $('#shelf-label').textContent=`SHELF ${String(book.row+1).padStart(2,'0')} / THE COLLECTION`;
 $('#book-title').textContent=book.title;
 $('#book-author').textContent=book.nonBook?'From the physical shelf':book.author||'Title not fully legible in the photograph';
 const link=$('#amazon-link');link.hidden=!!(book.unidentified||book.nonBook);
 link.href=book.asin?`https://www.amazon.com/dp/${book.asin}`:`https://www.amazon.com/s?k=${encodeURIComponent(book.title+' '+book.author)}`;
 link.innerHTML=book.asin?'View on Amazon <span>↗</span>':'Find on Amazon <span>↗</span>';
 $('#link-note').textContent=book.nonBook?'A spiral notebook from the shelf. No retail listing.':book.unidentified?'This spine needs a closer photograph before it can be matched.':book.asin?(art?'Amazon cover artwork. The edition may differ from the copy on this shelf.':'Opens the Amazon product page. Cover artwork is unavailable for this edition.'):'A direct product match is not yet confirmed. Opens an Amazon title-and-author search.';
 $('#book-select').value=book.id;
}
function resetDetail(){if(document.activeElement===$('#return-book'))host.focus({preventScroll:true});selected=null;$('#return-book').hidden=true;$('#book-cover').hidden=true;$('#cover-fallback').hidden=false;$('#cover-fallback').textContent='Choose a book to take it off the shelf.';$('#book-title').textContent='Every spine has a story.';$('#book-author').textContent='';$('#shelf-label').textContent='FROM THE SHELF';$('#amazon-link').hidden=true;$('#link-note').textContent='Pause over a spine to pull it forward. Pick a book to see its cover.';$('#book-select').value=''}
function closeBook(immediate=false){clearHover();if(immediate){reveal.clear();resetDetail()}else reveal.close()}
$('#return-book').onclick=()=>closeBook();
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#book-dialog').open&&!$('#photo-dialog').open)closeBook()});
function clearHover(){hovered=null;needsPick=false;dwell.clear();host.style.cursor=drag?'grabbing':'grab'}
function pick() {
 raycaster.setFromCamera(pointer,camera);
 hovered=visibleBook(raycaster,pickTargets,occluders);
 host.style.cursor=hovered?'pointer':drag?'grabbing':'grab';
 dwell.update(hovered,performance.now(),mouse.x,mouse.y);
}
function panLimit(){return panGeometry(baseDistance/goalZoom,camera?.aspect||1).limit}
function chooseNavigation(tool){clearHover();navigationTool=tool;document.querySelectorAll('[data-navigation]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.navigation===tool)));updateHint()}
function updateHint(){
 const pan=navigationTool==='pan';
 $('.gesture-hint').textContent=mobile.matches?`${pan?'Drag to move':'Drag to turn & tilt'} · Tap a book`:`${pan?'Drag to move':'Drag to turn & tilt'} · Scroll to zoom`;
 host.setAttribute('aria-label',`3D bookshelf. ${pan?'Drag to move left, right, up or down.':'Drag to turn and tilt.'} Use Rotate or Pan to change controls. Use arrow keys to adjust the view. Select a book to see its cover.`);
}
function setFocus(row){
 clearHover();focusedRow=row;goalX=0;
 if(row==='all'){goalY=7.05;goalZoom=1}else{goalY=yBase[Number(row)]+1;goalZoom=mobile.matches?1.8:Math.min(2.65,Math.max(1,baseDistance*(camera?.aspect||1)/17))}
 document.querySelectorAll('[data-shelf]').forEach(b=>{const active=b.dataset.shelf===row;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 updateHint();
 mobileBrowser.focus(row);
}
mobile.addEventListener('change',()=>setFocus(focusedRow));
setFocus('all');
async function start(){
 try{
 const [coverData,links]=await Promise.all(['covers','links'].map(name=>fetch(`./${name}.json`).then(r=>r.ok?r.json():{}).catch(()=>({}))));
 covers=coverData;for(const b of books)if(!b.unidentified&&!b.nonBook&&links[b.title])Object.assign(b,links[b.title]);
 mobileBrowser.render(covers);
 if(selected){const book=selected;selected=null;displayBook(book)}
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;host.append(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,150);root=new THREE.Group();scene.add(root);
 for(const name of new Set(['top','middle','bottom','full','surfaces/left-side','surfaces/right-side',...books.filter(b=>b.spine).map(b=>b.spine.source)])){const image=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=`./assets/${name}.jpg`});const texture=new THREE.Texture(image);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();texture.needsUpdate=true;const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;canvas.getContext('2d').drawImage(image,0,0);sources[name]={image,texture,canvas}}
 for(const [i,book] of books.entries())if(book.spine){
  const canvas=createSpineCanvas(sources[book.spine.source],book.spine.quad),texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  book.textureSource=`spine-${i}`;book.textureRect=[0,0,canvas.width,canvas.height];
  sources[book.textureSource]={image:canvas,canvas,texture};
 }
 scene.add(new THREE.HemisphereLight('#f4ebd5','#455740',2.6));const sun=new THREE.DirectionalLight('#ffe5bd',4);sun.position.set(-8,18,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:17,bottom:-8,far:55});sun.shadow.bias=-.001;scene.add(sun);const rim=new THREE.DirectionalLight('#b8d4d0',2);rim.position.set(9,9,-3);scene.add(rim);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.30}));floor.rotation.x=-Math.PI/2;floor.position.y=-.56;floor.receiveShadow=true;scene.add(floor);addShelf();occluders=[...root.children];addBooks();decor();if(!selected)displayBook(books.find(b=>b.title==='Katabasis')||books[0]);$('#loading').hidden=true;
 const resize=()=>{clearHover();const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();baseDistance=Math.max(24,(mobile.matches?16.5:17)/camera.aspect);updateHint()};new ResizeObserver(resize).observe(host);resize();
 function frame(){
  requestAnimationFrame(frame);
  const dt=Math.min(clock.getDelta(),.05),s=reduced?1:1-Math.exp(-dt*8.8);
  goalX=THREE.MathUtils.clamp(goalX,-panLimit(),panLimit());
  zoom+=(goalZoom-zoom)*s;targetY+=(goalY-targetY)*s;targetX+=(goalX-targetX)*s;yaw+=(goalYaw-yaw)*s;pitch+=(goalPitch-pitch)*s;
  const d=orbitDistance(baseDistance/zoom,yaw);
  camera.position.set(targetX+Math.sin(yaw)*d,targetY+Math.sin(pitch)*d,Math.cos(yaw)*d);camera.lookAt(targetX,targetY,0);camera.updateMatrixWorld();
  if(needsPick&&!drag){pick();needsPick=false}
  const magnified=hovered&&dwell.ready(performance.now());
  for(const m of bookMeshes){
   if(reveal.owns(m))continue;
   const active=m===hovered,z=m.userData.restZ+(active&&magnified?.42:0),scale=1;
   m.position.z+=(z-m.position.z)*s;
   if(m.scale.x!==scale)m.scale.setScalar(m.scale.x+(scale-m.scale.x)*s);
   m.material[4].emissive.setHex(active?0x443620:0);m.material[4].emissiveIntensity=.16;
  }
  reveal.update(dt);
  renderer.render(scene,camera);
 }frame();
 }catch(e){$('#loading').innerHTML='3D is unavailable here. Use the book selector to browse.';$('#loading').style.cssText='inset:auto 20px 90px;padding:12px;background:#14221ee8;';console.error(e);const img=document.createElement('img');img.src='./assets/full.jpg';img.alt='Original bookshelf';img.style='position:absolute;inset:0;width:100%;height:100%;object-fit:contain';host.append(img);$('#book-count').textContent=books.filter(b=>!b.nonBook).length;if(!$('#book-select').options.length||$('#book-select').options.length===1){books.forEach((b,i)=>{b.id=i;const o=new Option(b.title,i);$('#book-select').add(o)})}}
}
function updatePointer(e){const r=host.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;pointer.set(mouse.x/r.width*2-1,-mouse.y/r.height*2+1)}
host.addEventListener('pointerdown',e=>{
 if(e.button!==0||!e.isPrimary||!camera)return;
 clearHover();drag={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:goalYaw,pitch:goalPitch,panX:goalX,panY:goalY,mode:navigationTool,distance:baseDistance/goalZoom,moved:false};host.setPointerCapture(e.pointerId);
});
host.addEventListener('pointermove',e=>{
 updatePointer(e);
 if(drag&&drag.id===e.pointerId){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>8)drag.moved=true;if(drag.moved){
  const next=dragView({mode:drag.mode,yaw:drag.yaw,pitch:drag.pitch,x:drag.panX,y:drag.panY,dx,dy,width:host.clientWidth,height:host.clientHeight,distance:drag.distance,aspect:camera.aspect});
  goalYaw=next.yaw;goalPitch=next.pitch;goalX=next.x;goalY=next.y;
 }}
 else if(e.pointerType!=='touch')needsPick=true;
});
host.addEventListener('pointerup',e=>{
 if(drag&&drag.id!==e.pointerId)return;
 const click=drag&&!drag.moved;drag=null;
 if(click&&camera){updatePointer(e);pick();if(hovered)displayBook(hovered.userData.book,true)}
 if(host.hasPointerCapture(e.pointerId))host.releasePointerCapture(e.pointerId);
 clearHover();
});
host.addEventListener('pointercancel',()=>{drag=null;clearHover()});
host.addEventListener('pointerleave',()=>{if(!drag){clearHover();pointer.set(9,9)}});
host.addEventListener('lostpointercapture',()=>{drag=null;clearHover()});
window.addEventListener('blur',()=>{drag=null;clearHover()});
function changeZoom(factor){clearHover();goalZoom=Math.max(.75,Math.min(4,goalZoom*factor));updateHint()}
host.addEventListener('wheel',e=>{e.preventDefault();changeZoom(Math.exp(-e.deltaY*.0011))},{passive:false});
host.addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(e.key))return;
 e.preventDefault();clearHover();
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){const step=e.key==='ArrowLeft'?-1:1;if(navigationTool==='pan')goalX=THREE.MathUtils.clamp(goalX+step*.45,-panLimit(),panLimit());else goalYaw=THREE.MathUtils.clamp(goalYaw+step*.08,-cabinet.maxYaw,cabinet.maxYaw)}
 if(e.key==='ArrowUp'){if(navigationTool==='pan')goalY=Math.min(14.3,goalY+.4);else goalPitch=Math.min(.3,goalPitch+.04)}
 if(e.key==='ArrowDown'){if(navigationTool==='pan')goalY=Math.max(0,goalY-.4);else goalPitch=Math.max(-.23,goalPitch-.04)}
 if(e.key==='+')changeZoom(zoomFactor(1.15));
 if(e.key==='-')changeZoom(zoomFactor(1/1.15));
 if(e.key==='Home')reset();
});
function reset(){chooseNavigation('turn');goalYaw=mobile.matches?0:.13;goalPitch=mobile.matches?0:.015;setFocus('all')}
document.querySelectorAll('[data-navigation]').forEach(button=>button.onclick=()=>chooseNavigation(button.dataset.navigation));
$('#reset').onclick=reset;
$('#zoom-in').onclick=()=>changeZoom(zoomFactor(1.2));
$('#zoom-out').onclick=()=>changeZoom(zoomFactor(1/1.2));
document.querySelectorAll('[data-shelf]').forEach(b=>b.onclick=()=>setFocus(b.dataset.shelf));
$('#book-select').onchange=e=>{if(e.target.value==='')return;const b=books[Number(e.target.value)];displayBook(b,true)};
$('#photo-open').onclick=()=>$('#photo-dialog').showModal();
$('.photo-close').onclick=()=>$('#photo-dialog').close();
$('#photo-dialog').onclick=e=>{if(e.target===$('#photo-dialog'))$('#photo-dialog').close()};
start();
