import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bookcases,selectBookcase} from '../public/real-books/bookcases.js';
import {studyBooks} from '../public/real-books/study-books.js';
import {addStudyBookcase} from '../public/real-books/study-bookcases.js';
import {dragView} from '../public/real-books/navigation.js';
const base=new URL('../public/real-books/',import.meta.url);
const additions=Object.values(bookcases).filter(c=>c.shape);

test('all four Drive collections have distinct routes, populated views, and real photo sources',()=>{
 assert.deepEqual(Object.values(studyBooks).map(books=>books.length),[95,92,103,41]);
 const html=fs.readFileSync(new URL('index.html',base),'utf8');
 for(const c of additions){
  assert.equal(selectBookcase(`?case=${c.id}`),c);
  assert.ok(html.includes(`value="${c.id}"`));
  assert.equal(c.views.length,c.rows);assert.equal(c.yBase.length,c.rows);
  assert.ok(fs.existsSync(new URL(`assets/${c.photo}.jpg`,base)));
  for(let row=0;row<c.rows;row++)assert.ok(c.books.some(b=>b.row===row));
  for(const b of c.books){
   assert.ok(b.title);assert.ok(b.row>=0&&b.row<c.rows);
   for(const surface of [b.spine,b.top].filter(Boolean)){
    assert.ok(fs.existsSync(new URL(`assets/${surface.source}.jpg`,base)),b.title);
    const index=Number(surface.source.split('/')[1]),portrait=index<=3||index>=21;
    for(const [x,y] of surface.quad)assert.ok(x>=0&&y>=0&&x<(portrait?964:1280)&&y<(portrait?1280:964),b.title);
   }
  }
 }
});
test('each book clears its supporting shelf, neighboring books, and the cabinet frame',()=>{
 for(const c of additions){
  for(const b of c.books){
   const p=b.layout;assert.ok(p.width>0&&p.height>0&&p.depth>0,b.title);
   assert.ok(p.y-p.height/2>=c.yBase[b.row]-.001,b.title);
   if(b.row>0)assert.ok(p.y+p.height/2<c.yBase[b.row-1]-(c.shape==='tower'?.07:.18)+.001,b.title);
   if(c.shape!=='tower')assert.ok(Math.abs(p.x)+p.width/2<3.365,b.title);
  }
  for(let i=0;i<c.books.length;i++)for(let j=i+1;j<c.books.length;j++){
   const a=c.books[i],b=c.books[j],p=a.layout,q=b.layout;
   if(a.row!==b.row||Math.abs((p.z??(.8-p.depth/2))-(q.z??(.8-q.depth/2)))>=(p.depth+q.depth)/2)continue;
   const overlapX=(p.width+q.width)/2-Math.abs(p.x-q.x),overlapY=(p.height+q.height)/2-Math.abs(p.y-q.y);
   assert.ok(overlapX<.025||overlapY<.025,`${a.title} intersects ${b.title}`);
  }
 }
});
test('tower piles are individually supported and tall-case gestures reach the top',()=>{
 const c=bookcases.tower,boxes=[];
 addStudyBookcase({bookcase:c,mat:()=>({}),box:(...args)=>boxes.push(args)});
 for(const y of c.yBase.filter(y=>y>.3))assert.ok(boxes.some(b=>b[1]===.065&&Math.abs(b[4]+.033-y)<.001));
 const p=dragView({mode:'pan',yaw:0,pitch:0,x:0,y:14,dx:0,dy:500,width:390,height:500,distance:20,aspect:.78,maxY:16});
 assert.equal(p.y,16);
});
test('visible duplicates remain separate and unreadable volumes never get guessed product links',()=>{
 assert.equal(studyBooks.cream.filter(b=>b.title==='The Lean Startup').length,2);
 assert.equal([...studyBooks.left,...studyBooks.tower].filter(b=>b.title==='High Growth Handbook').length,2);
 const links=JSON.parse(fs.readFileSync(new URL('study-links.json',base)));
 const covers=JSON.parse(fs.readFileSync(new URL('study-covers.json',base)));
 for(const b of Object.values(studyBooks).flat()){
  if(b.unidentified)assert.equal(links[b.title],undefined);
  const link=links[b.title];if(!link)continue;
  assert.ok(link.source.startsWith('https://openlibrary.org/works/'));
  assert.equal([...link.asin].reduce((sum,n,i)=>sum+(n==='X'?10:Number(n))*(10-i),0)%11,0,b.title);
  const cover=covers[link.asin];
  if(cover)assert.ok(fs.statSync(new URL(cover.path,base)).size>2000,b.title);
 }
});
