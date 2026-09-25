import test from 'node:test';
import assert from 'node:assert/strict';
import { books } from '../public/real-books/books.js';
import { suggestBooks } from '../public/real-books/search.js';

test('title suggestions rank titles starting with the query first and skip non-books',()=>{
 assert.deepEqual(suggestBooks(books,'   '),[]);
 const results=suggestBooks(books,'the');
 assert.ok(results.length>0&&results.length<=8);
 assert.ok(results[0].title.toLowerCase().startsWith('the'));
 assert.ok(!suggestBooks(books,'spiral').some(b=>b.nonBook));
 assert.equal(suggestBooks(books,'jayne anne')[0].title,'Night Watch');
});
