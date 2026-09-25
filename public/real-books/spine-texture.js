// Sample a photographed spine's four corners into a rectangular texture.
// This keeps neighboring spines out of the magnifier on angled photographs.
export function spinePoint(quad,u,v) {
 const [tl,tr,br,bl]=quad;
 return [
  (tl[0]*(1-u)+tr[0]*u)*(1-v)+(bl[0]*(1-u)+br[0]*u)*v,
  (tl[1]*(1-u)+tr[1]*u)*(1-v)+(bl[1]*(1-u)+br[1]*u)*v,
 ];
}
export function createSpineCanvas(source,quad) {
 const [tl,tr,br,bl]=quad, distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round((distance(tl,tr)+distance(bl,br))/2));
 canvas.height=Math.max(1,Math.round((distance(tl,bl)+distance(tr,br))/2));
 const context=canvas.getContext('2d'),output=context.createImageData(canvas.width,canvas.height);
 const pixels=source.pixels ||= source.canvas.getContext('2d').getImageData(0,0,source.canvas.width,source.canvas.height);
 for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++) {
  const [sx,sy]=spinePoint(quad,(x+.5)/canvas.width,(y+.5)/canvas.height);
  const px=Math.max(0,Math.min(pixels.width-1,Math.round(sx))),py=Math.max(0,Math.min(pixels.height-1,Math.round(sy)));
  const from=(py*pixels.width+px)*4,to=(y*canvas.width+x)*4;
  for(let c=0;c<4;c++)output.data[to+c]=pixels.data[from+c];
 }
 context.putImageData(output,0,0);
 return canvas;
}
