// Proportions estimated from the overview photographs; books retain individual
// photo textures and real depth rather than a single bookshelf image plane.
export function addStudyBookcase({box,mat,bookcase}){
 if(bookcase.shape==='tower'){
  const steel=mat('#087c9c',{metalness:.55,roughness:.3});
  box(4.1,.16,3.2,0,.07,-.45,steel);
  box(.72,bookcase.height,.3,0,bookcase.height/2,-1.18,steel);
  for(const y of bookcase.yBase)if(y>.3){
   box(3.15,.065,2.15,0,y-.033,-.23,steel);
   box(.66,.2,1.7,0,y-.16,-.38,steel);
  }
  return;
 }
 const cream=bookcase.shape==='cream',paint=mat(cream?'#d4d0b7':'#171b1c'),back=mat(cream?'#bcb8a2':'#101314');
 const height=13.75,depth=2.12;
 box(6.85,height,.11,0,height/2,-1.2,back);
 for(const x of [-3.48,3.48])box(.22,height,depth,x,height/2,-.2,paint);
 for(const y of [.5,3.15,5.8,8.45,11.1,13.75])box(6.85,.18,depth,0,y-.09,-.2,paint);
 box(6.85,.32,.16,0,.18,.78,paint);
 // Recessed shelf-pin holes on the inner walls make the plain frames less flat.
 const holes=mat(cream?'#7f7b67':'#393b33');
 for(const x of [-3.362,3.362])for(const z of [-.82,.58])for(let y=.85;y<13.4;y+=.43)box(.012,.026,.026,x,y,z,holes);
}
