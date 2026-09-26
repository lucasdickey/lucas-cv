import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';
import ts from 'typescript';
import { books as shelf } from '../../public/real-books/books.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const archivePath = path.join(root, 'app/data/books.ts');
const links = JSON.parse(fs.readFileSync(path.join(root, 'public/real-books/links.json')));
const covers = JSON.parse(fs.readFileSync(path.join(root, 'public/real-books/covers.json')));
const hash = text => createHash('sha256').update(text).digest('hex');
const normalize = s => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const identity = b => normalize(b.title) + ':' + normalize(b.author);
const shortIdentity = b => normalize(b.title.split(':')[0]) + ':' + normalize(b.author);

export function parseArchive(source) {
  const tree = ts.createSourceFile('books.ts', source, ts.ScriptTarget.Latest, true);
  let array;
  for (const statement of tree.statements) if (ts.isVariableStatement(statement)) {
    for (const d of statement.declarationList.declarations) if (d.name.getText(tree) === 'books' && d.initializer && ts.isArrayLiteralExpression(d.initializer)) array = d.initializer;
  }
  if (!array) throw new Error('Cannot locate the books archive. No changes saved.');
  const entries = array.elements.map(node => {
    if (!ts.isObjectLiteralExpression(node)) throw new Error('Unexpected archive format.');
    const book = {}; const fields = {};
    for (const p of node.properties) if (ts.isPropertyAssignment(p)) {
      const key = p.name.getText(tree).replace(/^['"]|['"]$/g, '');
      if (ts.isStringLiteralLike(p.initializer)) book[key] = p.initializer.text;
      fields[key] = p.initializer;
    }
    return { book, node, fields };
  });
  return { tree, array, entries };
}

export function catalog(source) {
  const { entries } = parseArchive(source);
  const unique = new Map();
  for (const b of shelf.filter(b => !b.unidentified && !b.nonBook)) {
    const id = hash(identity(b)).slice(0, 20);
    if (unique.has(id)) { unique.get(id).copies++; continue; }
    const info = links[b.title] || b;
    const matches = entries.filter(e => identity(e.book) === identity(b) || shortIdentity(e.book) === shortIdentity(b) || (info.asin && (e.book.isbn === info.asin || e.book.amazonUrl?.includes('/' + info.asin))));
    if (new Set(matches.map(e => identity(e.book))).size > 1) throw new Error('Ambiguous archive match: ' + b.title);
    const match = (matches.find(e => !e.book.status || e.book.status === 'read') || matches[0])?.book;
    unique.set(id, { id, title: b.title, author: b.author, shelf: b.row + 1, copies: 1, status: match?.status || (match ? 'read' : 'unmarked'), slug: match?.slug, coverUrl: match?.coverUrl || (covers[info.asin]?.path ? '/real-books/' + covers[info.asin].path.replace(/^\.\//, '') : ''), asin: info.asin || '' });
  }
  return [...unique.values()];
}

export function markRead(source, ids) {
  const items = catalog(source); const requested = new Set(ids);
  if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string') || requested.size !== ids.length || ids.some(id => !items.some(b => b.id === id))) throw new Error('Invalid book selection.');
  const { tree, array, entries } = parseArchive(source);
  const edits = []; const additions = []; const slugs = new Set(entries.map(e => e.book.slug));
  for (const b of items.filter(b => requested.has(b.id))) {
    if (b.status === 'read') continue;
    const existing = b.slug && entries.find(e => e.book.slug === b.slug);
    if (existing) {
      const status = existing.fields.status;
      if (status) edits.push({ start: status.getStart(tree), end: status.end, text: '"read"' });
      else edits.push({ start: existing.node.getStart(tree) + 1, end: existing.node.getStart(tree) + 1, text: '\n    status: "read",' });
    } else {
      let slug = (b.title + '-' + b.author).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (slugs.has(slug)) slug += '-' + b.id.slice(0, 6);
      if (slugs.has(slug)) throw new Error('Duplicate archive slug.');
      slugs.add(slug);
      additions.push({ title: b.title, author: b.author, description: '', coverUrl: b.coverUrl || '/real-books/read-placeholder.svg', amazonUrl: b.asin ? 'https://www.amazon.com/dp/' + b.asin + '/' : 'https://www.amazon.com/s?k=' + encodeURIComponent(b.title + ' ' + b.author), slug, status: 'read' });
    }
  }
  if (additions.length) {
    const last = array.elements.at(-1);
    const text = (last && !array.elements.hasTrailingComma ? ',' : '') + '\n' + additions.map(b => '  ' + JSON.stringify(b, null, 2).replace(/\n/g, '\n  ')).join(',\n') + '\n';
    edits.push({ start: array.end - 1, end: array.end - 1, text });
  }
  let output = source;
  for (const e of edits.sort((a,b) => b.start-a.start)) output = output.slice(0,e.start) + e.text + output.slice(e.end);
  parseArchive(output);
  return { output, changed: edits.length ? items.filter(b => requested.has(b.id) && b.status !== 'read').length : 0 };
}

export function startServer(port = 3047) {
  const token = randomBytes(24).toString('hex');
  const origin = `http://127.0.0.1:${port}`;
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, data) => { res.writeHead(status, {'Content-Type':'application/json'}); res.end(JSON.stringify(data)); };
    if (req.headers.host !== `127.0.0.1:${port}`) return send(403, {error:'Use the local checklist address.'});
    const url = new URL(req.url, origin);
    try {
      if (req.method === 'GET' && url.pathname === '/') {
        res.setHeader('Content-Type','text/html; charset=utf-8');
        res.end(fs.readFileSync(new URL('./ui.html', import.meta.url), 'utf8').replace('__TOKEN__',token)); return;
      }
      if (req.method === 'GET' && url.pathname === '/api/books') {
        const source = fs.readFileSync(archivePath,'utf8');
        return send(200,{books:catalog(source),revision:hash(source)});
      }
      if (req.method === 'POST' && url.pathname === '/api/read') {
        if (req.headers.origin !== origin || req.headers['x-checklist-token'] !== token) return send(403,{error:'Reload the checklist before saving.'});
        let body=''; for await (const chunk of req) {body+=chunk; if(body.length>100000) return send(413,{error:'Request too large.'});}
        const input=JSON.parse(body); const source=fs.readFileSync(archivePath,'utf8');
        if (input.revision !== hash(source)) return send(409,{error:'The archive changed. Reload to review the latest status; your selections are kept.'});
        const result=markRead(source,input.ids);
        if (result.changed) {
          const backup=path.join(root,'.git/book-checklist-backups'); fs.mkdirSync(backup,{recursive:true});
          fs.writeFileSync(path.join(backup,`${Date.now()}-${hash(source).slice(0,8)}.ts`),source);
          const temp=archivePath+'.checklist-tmp'; fs.writeFileSync(temp,result.output); fs.renameSync(temp,archivePath);
        }
        return send(200,{changed:result.changed,books:catalog(result.output),revision:hash(result.output)});
      }
      if(req.method==='GET' && (url.pathname.startsWith('/real-books/') || url.pathname.startsWith('/images/books/'))) {
        const file=path.resolve(root,'public','.'+decodeURIComponent(url.pathname));
        if(!file.startsWith(path.join(root,'public')+path.sep) || !/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) return send(404,{});
        res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':file.endsWith('.png')?'image/png':file.endsWith('.webp')?'image/webp':'image/jpeg');
        res.end(fs.readFileSync(file)); return;
      }
      send(404,{error:'Not found'});
    } catch(error) {send(400,{error:error.message});}
  });
  server.listen(port,'127.0.0.1',()=>console.log(`Book checklist: ${origin}`));
  return server;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) startServer(Number(process.env.BOOK_CHECKLIST_PORT || 3047));
