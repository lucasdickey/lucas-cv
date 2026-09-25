// One book-detail view moves into a native dialog on phones, retaining its
// cover-loading state while the dialog provides focus trapping and dismissal.
export function createMobileBrowser(books, onSelect) {
 const mobile=matchMedia('(max-width: 760px), (max-width: 1000px) and (max-height: 500px)'),dialog=document.querySelector('#book-dialog');
 const detail=document.querySelector('#book-detail'),anchor=document.createComment('book detail');
 detail.before(anchor);
 const list=document.querySelector('#mobile-book-list'),search=document.querySelector('#book-search');
 const more=document.querySelector('#more-books');
 document.querySelector('#mobile-book-count').textContent=books.filter(b=>!b.nonBook).length;
 let row='all',limit=24,artwork={};
 function render(){
  if(!mobile.matches)return;
  const query=search.value.trim().toLocaleLowerCase();
  const matches=books.filter(b=>!b.nonBook&&(row==='all'||b.row===Number(row))&&`${b.title} ${b.author}`.toLocaleLowerCase().includes(query));
  document.querySelector('#library-title').textContent=row==='all'?'Browse the books':`Shelf ${Number(row)+1}`;
  document.querySelector('#library-count').textContent=`${matches.length} ${matches.length===1?'book':'books'}`;
  list.replaceChildren();
  for(const book of matches.slice(0,limit)){
   const button=document.createElement('button');button.className='book-row';
   const cover=document.createElement('span');cover.className='list-cover';cover.setAttribute('aria-hidden','true');
   const art=artwork[book.asin];
   if(art){const img=new Image();img.loading='lazy';img.decoding='async';img.alt='';img.src=art.path;img.onerror=()=>img.remove();cover.append(img)}
   const copy=document.createElement('span'),title=document.createElement('strong'),author=document.createElement('small');
   title.textContent=book.unidentified?'Unidentified spine':book.title;
   author.textContent=`${book.author||'Needs identification'} · Shelf ${book.row+1}`;
   copy.append(title,author);
   const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
   button.append(cover,copy,arrow);button.onclick=()=>onSelect(book);list.append(button);
  }
  if(!matches.length){const empty=document.createElement('p');empty.className='empty-books';empty.textContent='No books found. Try another title or author, or choose All shelves.';list.append(empty)}
  more.hidden=matches.length<=limit;
 }
 function restore(){if(dialog.open)return;anchor.after(detail);document.body.classList.remove('book-sheet-open')}
 dialog.addEventListener('close',restore);
 document.querySelector('#book-close').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 search.addEventListener('input',()=>{limit=24;render()});
 more.onclick=()=>{limit+=24;render();list.children[Math.min(limit-24,list.children.length-1)]?.focus()};
 mobile.addEventListener('change',()=>{if(!mobile.matches&&dialog.open){dialog.close();restore()}render()});
 return {
  render(covers){artwork=covers;render()},
  focus(nextRow){row=nextRow;limit=24;render()},
  open(){if(!mobile.matches)return;document.querySelector('#mobile-book-slot').append(detail);if(!dialog.open){document.body.classList.add('book-sheet-open');dialog.showModal()}dialog.scrollTop=0},
 };
}
