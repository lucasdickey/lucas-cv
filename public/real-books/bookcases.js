import {books as woodenBooks} from './books.js?v=closeups-5';
import {glassBooks} from './glass-books.js';

export const bookcases={
 wood:{id:'wood',name:'The wooden bookcase',books:woodenBooks,rows:5,centerY:7.05,minDistance:24,yBase:[10.7,8.25,5.8,3.35,.9],photo:'full',assets:['top','middle','bottom','full','surfaces/left-side','surfaces/right-side']},
 glass:{id:'glass',name:'The glass bookcase',books:glassBooks,rows:2,centerY:4.3,minDistance:16,yBase:[4.55,.7],photo:'glass/full',assets:['glass/full']},
};
export function selectBookcase(search){const id=new URLSearchParams(search).get('case');return Object.hasOwn(bookcases,id)?bookcases[id]:bookcases.wood}
