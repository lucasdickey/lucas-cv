// Quad points are clockwise from the top-left corner in the supplied close-up.
// Layout rectangles stay in the original full-shelf coordinate system.
export const closeupCubbies = [
 {
  row: 4, from: 680, to: 980, source: 'shelf-5-cubby-3',
  books: [
   ['The Rise and Fall of Great Powers','Tom Rachman',[684,628,38,222],[[218,247],[347,244],[412,909],[322,905]]],
   ['All Involved','Ryan Gattis',[723,673,25,177],[[355,375],[427,378],[470,917],[414,906]]],
   ['Little Failure','Gary Shteyngart',[749,673,23,177],[[432,380],[480,365],[526,922],[473,915]]],
   ['A Dictionary of Modern Legal Usage','Bryan A. Garner',[773,644,47,206],[[479,287],[650,303],[653,960],[528,957]]],
   ['Watchmen','Alan Moore & Dave Gibbons',[821,580,43,270],[[658,103],[797,105],[774,963],[658,963]]],
   ['Preacher: Dixie Fried','Garth Ennis & Steve Dillon',[865,600,14,250],[[800,169],[845,168],[813,963],[778,962]]],
   ['Preacher: Ancient History','Garth Ennis',[880,600,14,250],[[849,170],[894,167],[855,963],[819,963]]],
   ['Preacher: Proud Americans','Garth Ennis & Steve Dillon',[895,600,14,250],[[901,168],[947,165],[900,962],[861,963]]],
   ['Preacher: Salvation','Garth Ennis & Steve Dillon',[910,599,17,251],[[958,167],[1017,164],[951,962],[905,962]]],
   ['Preacher: War in the Sun','Garth Ennis',[928,599,14,251],[[1023,164],[1086,160],[1006,962],[960,962]]],
   ['Preacher: Book One','Garth Ennis & Steve Dillon',[943,598,17,252],[[1100,159],[1156,164],[1053,962],[1009,962]]],
   ['Preacher: Until the End of the World','Garth Ennis & Steve Dillon',[961,600,15,250],[[1161,172],[1207,175],[1101,960],[1058,962]]],
   ['I Survived the Black Death, 1348','Lauren Tarshis',[767,560,209,17],[[453,15],[1259,94],[1253,130],[451,58]],{horizontal:true,elevation:2.15}],
  ]
 },
 {
  row: 4, from: 999, to: 1260, source: 'shelf-5-cubby-4',
  books: [
   ['Gentlemen of the Road','Michael Chabon',[1000,651,19,199],[[308,240],[375,235],[454,867],[404,879]]],
   ['Summerland','Michael Chabon',[1020,620,39,230],[[381,205],[521,204],[563,837],[457,851]]],
   ['Wonder Boys','Michael Chabon',[1060,635,24,215],[[526,244],[589,241],[622,829],[568,831]]],
   ['A Model World and Other Stories','Michael Chabon',[1085,635,16,215],[[594,242],[644,239],[660,846],[629,843]]],
   ["The Russian Debutante's Handbook",'Gary Shteyngart',[1102,635,29,215],[[654,243],[753,236],[774,840],[667,835]]],
   ['The Curse of Bigness','Tim Wu',[1132,654,18,196],[[786,274],[827,273],[835,822],[799,828]]],
   ['Werewolves in Their Youth','Michael Chabon',[1151,618,23,232],[[837,202],[895,200],[890,818],[846,816]]],
   ["Baron Wenckheim's Homecoming",'László Krasznahorkai',[1175,624,42,226],[[906,220],[1096,204],[1012,837],[900,825]]],
   ['Night Watch','Jayne Anne Phillips',[1218,599,22,251],[[1151,198],[1198,194],[1117,714],[1086,703]]],
  ]
 },
 {
  row: 3, from: 1000, to: 1260, source: 'shelf-4-cubby-4',
  books: [
   ['Unidentified spine 39','',[1006,254,13,257],[[262,160],[305,161],[386,838],[351,849]],{unidentified:true}],
   ['The Mysteries of Pittsburgh','Michael Chabon',[1020,258,31,253],[[338,118],[431,134],[486,834],[383,842]]],
   ['Life After God','Douglas Coupland',[1052,335,22,176],[[456,334],[553,322],[575,801],[493,808]]],
   ['Bobby Fischer Teaches Chess','Bobby Fischer, Stuart Margulies & Donn Mosenfelder',[1075,311,26,200],[[557,270],[636,269],[645,814],[573,817]]],
   ["Foundation's Edge",'Isaac Asimov',[1102,311,25,200],[[642,269],[729,268],[729,779],[645,781]]],
   ['Foundation and Earth','Isaac Asimov',[1128,310,27,201],[[733,269],[824,267],[816,772],[732,775]]],
   ['Prelude to Foundation','Isaac Asimov',[1156,309,29,202],[[831,265],[935,264],[913,788],[832,786]]],
   ['Forward the Foundation','Isaac Asimov',[1186,308,26,203],[[946,264],[1033,259],[1002,789],[923,790]]],
   ['Foundation and Empire','Isaac Asimov',[1213,307,22,204],[[1042,263],[1135,256],[1055,776],[1009,780]]],
   ['Second Foundation','Isaac Asimov',[1236,306,22,205],[[1148,256],[1198,257],[1098,763],[1066,765]]],
  ]
 }
];

export function applyCloseups(books) {
 for (const cubby of closeupCubbies) {
  for (let i=books.length-1;i>=0;i--) {
   const book=books[i];
   if(book.row===cubby.row && book.rect[0]>=cubby.from && book.rect[0]<cubby.to)books.splice(i,1);
  }
  for (const [title,author,rect,quad,extra={}] of cubby.books) {
   books.push({row:cubby.row,title,author,rect,unidentified:false,spine:{source:cubby.source,quad},...extra});
  }
 }
}
