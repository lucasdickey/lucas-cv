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

test('second close-up batch replaces reflections and mistaken titles without removing real duplicate copies',()=>{
 const cubbies=closeupCubbies.filter(c=>['shelf-4-cubby-1','shelf-4-cubby-2','shelf-4-cubby-3','shelf-5-cubby-1','shelf-5-cubby-2'].includes(c.source));
 assert.equal(cubbies.reduce((n,c)=>n+c.books.length,0),41);
 assert.ok(cubbies.every(c=>c.books.every(b=>!b[4]?.unidentified)));
 assert.equal(books.filter(b=>b.row===3&&b.rect[0]>=350&&b.rect[0]<680).length,2);
 assert.equal(books.filter(b=>b.row===3&&b.horizontal&&b.rect[0]<350).length,9);
 assert.ok(!books.some(b=>b.row===3&&['The Man in the High Castle',"The Hitchhiker's Guide to the Galaxy",'Unidentified spine 44'].includes(b.title)));
 assert.equal(books.filter(b=>b.title==='Stories of Your Life and Others').length,2);
 assert.equal(books.find(b=>b.title==='The Future of an Illusion').author,'Sigmund Freud');
 assert.equal(books.find(b=>b.title.startsWith("The Peacock's Tales")).author,'Marty Leeds');
});

test('new close-up matches have valid ISBNs and available covers point to real assets',()=>{
 const links=JSON.parse(fs.readFileSync(new URL('../public/real-books/links.json',import.meta.url)));
 const covers=JSON.parse(fs.readFileSync(new URL('../public/real-books/covers.json',import.meta.url)));
 const titles=['The Early Ayn Rand','The Future of an Illusion','Jules Verne: The Man Who Invented the Future','The Unbearable Lightness of Being','The Letter Opener','The Ministry of Time','The Abolition of Man','The Night Watchman',"The Peacock's Tales: The Alchemical Writings of Claudia Pavonis",'Fleishman Is in Trouble','In the Light of What We Know'];
 for(const title of titles){const entry=links[title];assert.ok(entry.source.startsWith('https://'),title);assert.equal([...entry.asin].reduce((sum,c,i)=>sum+(10-i)*(c==='X'?10:Number(c)),0)%11,0,title);const art=covers[entry.asin];if(art)assert.ok(fs.statSync(new URL('../public/real-books/'+art.path,import.meta.url)).size>1000,title);}
});

test('third batch keeps photographed duplicate copies and excludes the notebook from book totals',()=>{
 const cubbies=closeupCubbies.filter(c=>c.source.startsWith('shelf-3-')||c.source==='shelf-2-cubby-4');
 assert.equal(cubbies.reduce((n,c)=>n+c.books.length,0),48);
 for(const title of ['Klara and the Sun','Flowers for Algernon','1984'])assert.equal(books.filter(b=>b.title===title).length,2,title);
 const notebook=books.find(b=>b.title==='Spiral notebook');assert.equal(notebook.nonBook,true);assert.equal(notebook.unidentified,false);assert.equal(notebook.asin,undefined);
 assert.equal(books.filter(b=>!b.nonBook).length,187);
 assert.equal(books.filter(b=>b.unidentified).length,21);
 assert.equal(books.find(b=>b.title==='The Man in the High Castle').row,1);
 for(const title of ['Ghostways',"Foreskin's Lament",'2666','Lincoln in the Bardo'])assert.ok(!books.some(b=>b.title===title),title);
});
test('third batch product matches use valid print ISBNs and include full-cover assets',()=>{
 const links=JSON.parse(fs.readFileSync(new URL('../public/real-books/links.json',import.meta.url)));
 const covers=JSON.parse(fs.readFileSync(new URL('../public/real-books/covers.json',import.meta.url)));
 for(const title of ['The Last Days of Night','A Hundred Thousand Worlds','The Expanding Circle','Cloud Cuckoo Land','When You Are Engulfed in Flames','Barrel Fever','The Informers','The Rules of Attraction','Men and Cartoons','Tell-All',"It Lasts Forever and Then It's Over",'Brave New World','The Great Divorce','Klara and the Sun','Flowers for Algernon','1984']){
  const entry=links[title];assert.ok(entry.source.startsWith('https://'),title);
  assert.equal([...entry.asin].reduce((sum,c,i)=>sum+(10-i)*(c==='X'?10:Number(c)),0)%11,0,title);
  assert.equal([...entry.isbn13].reduce((sum,c,i)=>sum+Number(c)*(i%2?3:1),0)%10,0,title);
  assert.ok(covers[entry.asin],title);assert.ok(fs.statSync(new URL('../public/real-books/'+covers[entry.asin].path,import.meta.url)).size>1000,title);
 }
});
