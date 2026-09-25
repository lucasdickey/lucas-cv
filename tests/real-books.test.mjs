import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { books } from '../public/real-books/books.js';
import { closeupCubbies } from '../public/real-books/closeups.js';
import { spinePoint } from '../public/real-books/spine-texture.js';

test('close-up catalog preserves physical order and does not duplicate moved books',()=>{
 assert.equal(books.filter(b=>b.title==='The Mysteries of Pittsburgh').length,1);
 assert.equal(books.find(b=>b.title==='The Mysteries of Pittsburgh').row,3);
 assert.deepEqual(books.filter(b=>b.title.startsWith('Preacher:')).map(b=>b.title),[
  'Preacher: Dixie Fried','Preacher: Ancient History','Preacher: Proud Americans','Preacher: Salvation','Preacher: War in the Sun','Preacher: Book One','Preacher: Until the End of the World'
 ]);
 assert.ok(books.find(b=>b.title==='I Survived the Black Death, 1348').elevation>2);
 assert.equal(books.find(b=>b.title==='Night Watch').author,'Jayne Anne Phillips');
 assert.equal(books.filter(b=>b.title==='Foundation').length,0);
});
test('spine sampling follows each photographed corner, including a tilted horizontal book',()=>{
 for(const {books:items} of closeupCubbies)for(const [title,author,rect,q] of items){
  for(const [u,v,i] of [[0,0,0],[1,0,1],[1,1,2],[0,1,3]])assert.deepEqual(spinePoint(q,u,v),q[i],title);
  for(const [x,y] of q){assert.ok(x>=0&&x<1280,title);assert.ok(y>=0&&y<964,title)}
  assert.ok(rect[2]>0&&rect[3]>0,title);
 }
});
test('every newly identified book has a sourced, valid ISBN and unknowns have no product assignment',()=>{
 const links=JSON.parse(fs.readFileSync(new URL('../public/real-books/links.json',import.meta.url)));
 for(const title of ['Gentlemen of the Road','A Model World and Other Stories','The Curse of Bigness','Werewolves in Their Youth','Night Watch','Life After God','Bobby Fischer Teaches Chess','Preacher: Book One','I Survived the Black Death, 1348']){
  const entry=links[title];assert.ok(entry.source.startsWith('https://'),title);
  assert.match(entry.asin,/^[0-9]{9}[0-9X]$/);
  assert.equal([...entry.asin].reduce((sum,c,i)=>sum+(10-i)*(c==='X'?10:Number(c)),0)%11,0,title);
 }
 for(const book of books.filter(b=>b.unidentified))assert.equal(book.asin,undefined);
});
