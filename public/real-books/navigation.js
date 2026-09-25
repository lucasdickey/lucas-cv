// Cabinet proportions are visual estimates from the September 25 video.
// Keep the front plane fixed so the existing photo-based book layout stays aligned.
export const cabinet = Object.freeze({halfWidth:5.3,front:1.02,back:-1.1,depth:2.12,maxYaw:.95});
const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
export const orbitDistance=(distance,yaw)=>distance+Math.abs(Math.sin(yaw))*cabinet.halfWidth;
export function panGeometry(distance,aspect,fov=38){
 const width=2*Math.max(.1,distance-cabinet.front)*Math.tan(fov*Math.PI/360)*aspect;
 return {width,limit:Math.max(0,cabinet.halfWidth-width/2)};
}
export const navigationMode=(zoom,row,canPan=true)=>canPan&&(row!=='all'||zoom>1.12)?'pan':'turn';
export function horizontalDrag({start,delta,pixels,distance,aspect,mode}){
 if(mode==='turn')return clamp(start+delta/Math.max(1,pixels)*1.9,-cabinet.maxYaw,cabinet.maxYaw);
 const {width,limit}=panGeometry(distance,aspect);
 return clamp(start-delta/Math.max(1,pixels)*width,-limit,limit);
}
export function visibleBook(raycaster,targets,occluders){
 // At oblique angles, cabinet sides and dividers must block books behind them.
 return raycaster.intersectObjects([...targets,...occluders],false)[0]?.object.userData.bookMesh||null;
}
