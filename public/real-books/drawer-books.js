// Photo order, left to right. Quads map texture TL, TR, BR, BL into the source photo.
// right-closeup is photographed sideways; its corner order rotates the spines upright.
const row=[
 ['A Light in the Attic','Shel Silverstein',.39,2.05,1.85,'left',[[112,90],[177,94],[159,820],[76,822]]],
 ['L’enfant, la taupe, le renard et le cheval','Charlie Mackesy',.37,2.0,1.82,'left',[[210,109],[274,105],[270,787],[173,803]]],
 ['The Scaling Era: An Oral History of AI, 2019–2025','Dwarkesh Patel with Gavin Leech',.40,2.0,1.76,'left',[[302,118],[374,149],[355,833],[277,822]]],
 ['Unidentified Stripe volume','',.13,1.68,1.5,'left',[[387,158],[421,165],[421,727],[385,731]]],
 ['The Glass Castle','Jeannette Walls',.22,1.65,1.52,'left',[[434,169],[469,173],[468,722],[430,728]]],
 ['I Who Have Never Known Men','Jacqueline Harpman',.17,1.65,1.5,'left',[[483,161],[516,159],[520,710],[480,715]]],
 ['The Pig That Wants to Be Eaten','Julian Baggini',.25,1.65,1.5,'left',[[539,155],[573,163],[575,707],[527,711]]],
 ['Plato and a Platypus Walk into a Bar…','Thomas Cathcart and Daniel Klein',.18,1.5,1.42,'left',[[588,203],[617,198],[632,692],[587,696]]],
 ['Foundation','Isaac Asimov',.21,1.42,1.35,'left',[[626,250],[658,252],[677,692],[635,698]]],
 ['Fifty Things That Made the Modern Economy','Tim Harford',.25,1.6,1.48,'left',[[670,179],[715,176],[746,681],[687,682]]],
 ['Taiwan Travelogue','Yang Shuang-zi',.27,1.68,1.53,'right',[[225,150],[279,147],[277,727],[198,726]]],
 ['Never Let Me Go','Kazuo Ishiguro',.22,1.65,1.5,'right',[[293,160],[329,160],[328,711],[289,717]]],
 ['In the Distance','Hernan Diaz',.20,1.65,1.5,'right-closeup',[[239,934],[240,884],[1017,869],[1032,927]]],
 ['Waking Up','Sam Harris',.22,1.65,1.5,'right-closeup',[[228,872],[240,806],[1011,783],[1033,859]]],
 ['The Righteous Mind','Jonathan Haidt',.34,1.65,1.51,'right-closeup',[[246,791],[245,673],[974,648],[987,778]]],
 ['The Conquest of Happiness','Bertrand Russell',.18,1.65,1.47,'right-closeup',[[241,654],[243,597],[995,577],[1008,635]]],
 ['The Square and the Tower','Niall Ferguson',.30,1.65,1.53,'right-closeup',[[251,582],[263,483],[971,458],[975,560]]],
 ['Amusing Ourselves to Death','Neil Postman',.21,1.65,1.5,'right-closeup',[[259,470],[265,406],[979,380],[977,451]]],
 ['Motherless Brooklyn / The Fortress of Solitude','Jonathan Lethem',.49,1.7,1.58,'right-closeup',[[227,403],[219,244],[984,199],[1000,371]]],
 ['The Tusks of Extinction','Ray Nayler',.16,1.64,1.5,'right-closeup',[[222,237],[217,191],[978,143],[981,194]]],
 ['Wolf Hall','Hilary Mantel',.40,1.7,1.58,'right-closeup',[[217,184],[210,57],[962,4],[977,125]]],
 ['Bedtime in the Southwest','Mona Hodgson',.29,1.75,1.61,'right',[[1013,171],[1072,160],[1133,680],[1058,684]]],
];
const span=row.reduce((n,b)=>n+b[2],0),scale=4.65/span;
let x=-2.325;
export const drawerBooks=row.map(([title,author,weight,height,depth,source,quad])=>{
 const width=weight*scale;
 const book={title,author,row:0,layout:{x:x+width/2,y:depth/2,z:-.83,width:width-.008,height,depth},spine:{source:`drawer/${source}`,quad}};
 if(title==='Unidentified Stripe volume')book.unidentified=true;
 x+=width;return book;
});
// The visible Calvin and Hobbes volume lies face-up in front of the upright row.
drawerBooks.push({title:'Homicidal Psycho Jungle Cat',author:'Bill Watterson',row:1,layout:{x:.45,y:.055,z:1.07,width:1.7,height:1.55,depth:.09},coverFace:4,spine:{source:'drawer/open',quad:[[651,585],[1008,558],[1041,771],[660,802]]}});
