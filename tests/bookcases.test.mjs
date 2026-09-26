import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectBookcase,bookcases} from '../public/real-books/bookcases.js';
import {glassBooks} from '../public/real-books/glass-books.js';
import {bookMatches} from '../public/real-books/search.js';
const base=new URL('../public/real-books/',import.meta.url);
const links=JSON.parse(fs.readFileSync(new URL('glass-links.json',base)));
const covers=JSON.parse(fs.readFileSync(new URL('covers.json',base)));

test('bookcase links select separate catalogs and unknown values retain the original collection',()=>{
 assert.equal(selectBookcase('').id,'wood');
 assert.equal(selectBookcase('?case=glass').books,glassBooks);
 assert.equal(selectBookcase('?case=toString').id,'wood');
 assert.equal(selectBookcase('?case=missing').id,'wood');
 assert.equal(bookcases.wood.books.length,192);
 assert.equal(glassBooks.length,50);
 assert.equal(glassBooks.filter(b=>b.title==='HBR Guide to Finance Basics for Managers').length,2);
 assert.equal(glassBooks.filter(b=>b.title.startsWith('Prescription for Nutritional Healing')).length,2);
 assert.equal(glassBooks.some(b=>bookMatches(b,'katabasis')),false);
 assert.equal(glassBooks.filter(b=>bookMatches(b,'bostrom')).length,2);
});
test('every new spine samples a supplied photo and fits inside the two-row cabinet',()=>{
 for(const b of glassBooks){
  assert.ok(fs.existsSync(new URL(`assets/${b.spine.source}.jpg`,base)),b.title);
  assert.ok(b.row===0||b.row===1);
  assert.equal(b.spine.quad.length,4);
  for(const [x,y] of b.spine.quad)assert.ok(x>=0&&x<1280&&y>=0&&y<964,b.title);
  const {x,y,width,height}=b.layout;
  assert.ok(width>0&&height>0,b.title);
  assert.ok(Math.abs(x)+width/2<5.14,b.title);
  const bottom=bookcases.glass.yBase[b.row];
  assert.ok(y-height/2>=bottom-.001&&y+height/2<(b.row===0?8.22:4.4),b.title);
 }
 const stack=glassBooks.filter(b=>b.row===1&&b.horizontal);
 for(let i=1;i<stack.length;i++)assert.ok(stack[i].layout.y-stack[i].layout.height/2>stack[i-1].layout.y+stack[i-1].layout.height/2);
 assert.equal(stack[0].title,'Wendell Dayton');assert.equal(stack.at(-1).title,'Superintelligence');
});
test('product editions carry valid ISBNs and unknown spines never receive a guessed match',()=>{
 for(const b of glassBooks){
  if(b.unidentified)assert.equal(links[b.title],undefined);
  const record=links[b.title];if(!record)continue;
  assert.ok(record.source);
  assert.equal([...record.isbn13].reduce((sum,n,i)=>sum+Number(n)*(i%2?3:1),0)%10,0,b.title);
  assert.equal([...record.asin].reduce((sum,n,i)=>sum+(n==='X'?10:Number(n))*(10-i),0)%11,0,b.title);
  assert.equal(record.isbn13.slice(3,12),record.asin.slice(0,9));
  const cover=covers[record.asin];
  if(cover)assert.ok(fs.statSync(new URL(cover.path,base)).size>3000,b.title);
 }
});
