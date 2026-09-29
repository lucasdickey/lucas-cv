import {books as woodenBooks} from './books.js?v=closeups-5';
import {glassBooks} from './glass-books.js';
import {drawerBooks} from './drawer-books.js?v=lenny-notebook-1';

import {studyBooks,studyBases,towerBases,towerHeight} from './study-books.js';

export const bookcases={
 wood:{id:'wood',name:'The wooden bookcase',books:woodenBooks,rows:5,centerY:7.05,minDistance:24,yBase:[10.7,8.25,5.8,3.35,.9],photo:'full',assets:['top','middle','bottom','full','surfaces/left-side','surfaces/right-side']},
 glass:{id:'glass',name:'The glass bookcase',books:glassBooks,rows:2,centerX:-1.15,centerY:5.7,minDistance:24,framingWidth:22,yBase:[7.55,3.7],photo:'glass/cabinet-open',assets:['glass/full']},
 drawer:{id:'drawer',name:'The book drawer',books:drawerBooks,rows:2,views:['Book row','Calvin & Hobbes'],centerY:4,minDistance:22,framingWidth:17,yBase:[5.5,4],maxPitch:1.4,panRange:[-1.5,3.5],photo:'drawer/kitchen',assets:['drawer/closed']},
 'study-left':{id:'study-left',name:'The left bookcase',shape:'black',books:studyBooks.left,rows:6,views:['On top','Strategy & leadership','Economics','Technology & mathematics','Lives & business','Philosophy'],centerY:7.8,minDistance:29,framingWidth:12,yBase:studyBases,photo:'study/01',assets:[]},
 'study-cream':{id:'study-cream',name:'The cream bookcase',shape:'cream',books:studyBooks.cream,rows:5,views:['Biography','History & happiness','Mind & behavior','Product & management','Building companies'],centerY:6.8,minDistance:26,framingWidth:12,yBase:studyBases.slice(1),photo:'study/02',assets:[]},
 'study-right':{id:'study-right',name:'The right bookcase',shape:'black',books:studyBooks.right,rows:6,views:['On top','Politics & history','Climate & society','Wellbeing','Business & investing','Music & culture'],centerY:7.8,minDistance:29,framingWidth:12,yBase:studyBases,photo:'study/03',assets:[]},
 tower:{id:'tower',name:'The blue book tower',shape:'tower',books:studyBooks.tower,rows:towerBases.length,views:['Lenny & growth','Invention','Engineering','Mental models','Building software','Systems & AI','Progress','Management','Ideas & institutions','Society','Economics & product','Foundations'],centerY:towerHeight/2,minDistance:(towerHeight+3)/.688,framingWidth:9,yBase:towerBases,height:towerHeight,photo:'study/21',assets:[]},
};
export function selectBookcase(search){const id=new URLSearchParams(search).get('case');return Object.hasOwn(bookcases,id)?bookcases[id]:bookcases.wood}
