// Title-or-author search shared by the phone catalog and the desktop side panel.
export function bookMatches(book,query){
 return !book.nonBook&&`${book.title} ${book.author}`.toLocaleLowerCase().includes(query);
}

// Suggestions favour titles that begin with the query, then titles with a word
// that does, then any other title or author match, keeping shelf order within each.
export function suggestBooks(books,rawQuery,limit=8){
 const query=rawQuery.trim().toLocaleLowerCase();
 if(!query)return [];
 const rank=book=>{const title=book.title.toLocaleLowerCase();return title.startsWith(query)?0:title.split(/[\s:—-]+/).some(w=>w.startsWith(query))?1:2};
 return books.filter(b=>bookMatches(b,query)).map((book,i)=>({book,i,r:rank(book)})).sort((a,b)=>a.r-b.r||a.i-b.i).slice(0,limit).map(x=>x.book);
}

export function createDesktopSearch(books,onSelect){
 const input=document.querySelector('#desktop-search'),list=document.querySelector('#desktop-results');
 let matches=[],active=-1,artwork={};
 function setActive(index){
  active=index;
  [...list.children].forEach((row,i)=>row.setAttribute('aria-selected',String(i===active)));
  if(active>=0){input.setAttribute('aria-activedescendant',`desktop-result-${active}`);list.children[active].scrollIntoView({block:'nearest'})}
  else input.removeAttribute('aria-activedescendant');
 }
 function close(){list.hidden=true;input.setAttribute('aria-expanded','false');setActive(-1)}
 function choose(book){input.value='';close();onSelect(book)}
 function render(){
  matches=suggestBooks(books,input.value);
  list.replaceChildren();active=-1;input.removeAttribute('aria-activedescendant');
  if(!input.value.trim()){close();return}
  matches.forEach((book,i)=>{
   const row=document.createElement('li');row.id=`desktop-result-${i}`;row.className='result-row';row.setAttribute('role','option');row.setAttribute('aria-selected','false');
   const cover=document.createElement('span');cover.className='list-cover';cover.setAttribute('aria-hidden','true');
   const art=artwork[book.asin];
   if(art){const img=new Image();img.decoding='async';img.alt='';img.src=art.path;img.onerror=()=>img.remove();cover.append(img)}
   const copy=document.createElement('span'),title=document.createElement('strong'),author=document.createElement('small');
   title.textContent=book.unidentified?'Unidentified spine':book.title;
   author.textContent=`${book.author||'Needs identification'} · Shelf ${book.row+1}`;
   copy.append(title,author);row.append(cover,copy);
   // mousedown keeps focus in the input so the list is not closed by blur first.
   row.onmousedown=e=>e.preventDefault();row.onclick=()=>choose(book);row.onmousemove=()=>{if(active!==i)setActive(i)};
   list.append(row);
  });
  if(!matches.length){const empty=document.createElement('li');empty.className='empty-books';empty.textContent='No books found. Try another title or author.';list.append(empty)}
  list.hidden=false;input.setAttribute('aria-expanded','true');
 }
 input.addEventListener('input',render);
 input.addEventListener('focus',()=>{if(input.value.trim())render()});
 input.addEventListener('blur',close);
 input.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   if(list.hidden)render();
   if(!matches.length)return;
   e.preventDefault();
   const step=e.key==='ArrowDown'?1:-1;setActive((active+step+matches.length+(active<0&&step<0?1:0))%matches.length);
  }else if(e.key==='Enter'){
   const book=matches[active>=0?active:0];if(book&&!list.hidden){e.preventDefault();choose(book)}
  }else if(e.key==='Escape'){
   // Stop the page-level Escape handler from also returning the current book.
   if(!list.hidden||input.value){e.preventDefault();e.stopPropagation();input.value='';close()}
  }
 });
 return {render(covers){artwork=covers;if(!list.hidden)render()}};
}
