import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { catalog, markRead, parseArchive } from '../scripts/book-checklist/server.mjs';
const source = fs.readFileSync(new URL('../app/data/books.ts', import.meta.url), 'utf8');

test('catalog merges physical copies and excludes unidentified spines', () => {
  const list = catalog(source);
  assert.equal(new Set(list.map(b => b.id)).size, list.length);
  assert.ok(list.every(b => !b.title.startsWith('Unidentified')));
  assert.ok(list.some(b => b.status === 'read'));
});
test('marking an existing queued book changes only its status', () => {
  const book = catalog(source).find(b => b.slug && b.status === 'pending');
  assert.ok(book);
  const result = markRead(source, [book.id]);
  const before = parseArchive(source).entries.map(e => e.book);
  const after = parseArchive(result.output).entries.map(e => e.book);
  assert.deepEqual(after, before.map(b => b.slug === book.slug ? {...b, status:'read'} : b));
  assert.equal(result.changed, 1);
});
test('new read entries retain known facts, preserve the archive, and are idempotent', () => {
  const selected = catalog(source).filter(b => !b.slug).slice(0, 3);
  const result = markRead(source, selected.map(b => b.id));
  const before = parseArchive(source).entries.map(e => e.book);
  const after = parseArchive(result.output).entries.map(e => e.book);
  assert.deepEqual(after.slice(0, before.length), before);
  assert.equal(after.length, before.length + 3);
  for (const b of after.slice(before.length)) {assert.equal(b.status,'read');assert.equal(b.description,'');assert.ok(b.slug);}
  assert.equal(markRead(result.output,selected.map(b=>b.id)).output,result.output);
  const tree=ts.createSourceFile('books.ts',result.output,ts.ScriptTarget.Latest,true);
  assert.deepEqual(tree.parseDiagnostics, []);
});
test('empty submissions and already-read books leave bytes unchanged', () => {
  assert.equal(markRead(source,[]).output,source);
  assert.equal(markRead(source,catalog(source).filter(b=>b.status==='read').map(b=>b.id)).output,source);
});
test('unknown and duplicate selection IDs fail closed', () => {
  assert.throws(()=>markRead(source,['made-up']));
  const id=catalog(source)[0].id;
  assert.throws(()=>markRead(source,[id,id]));
});
