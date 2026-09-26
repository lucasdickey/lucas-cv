import {books as woodenBooks} from './books.js?v=closeups-5';
import {glassBooks} from './glass-books.js';

export const bookcases={
 wood:{id:'wood',name:'The wooden bookcase',books:woodenBooks,rows:5,centerY:7.05,minDistance:24,yBase:[10.7,8.25,5.8,3.35,.9],photo:'full',assets:['top','middle','bottom','full','surfaces/left-side','surfaces/right-side']},
 glass:{id:'glass',name:'The glass bookcase',books:glassBooks,rows:2,centerX:-1.15,centerY:5.7,minDistance:24,framingWidth:22,yBase:[7.55,3.7],photo:'glass/cabinet-open',assets:['glass/full']},
};
export function selectBookcase(search){const id=new URLSearchParams(search).get('case');return Object.hasOwn(bookcases,id)?bookcases[id]:bookcases.wood}
