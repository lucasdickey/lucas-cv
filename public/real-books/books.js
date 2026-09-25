import { applyCloseups } from './closeups.js?v=5';
// Coordinates reference the user's photographs. Unreadable spines remain visible.
export const books=[];
let unknown=0;
function row(n,bottom,data){for(const line of data.trim().split('\n')){const [x,right,y,title,author='']=line.split('|');books.push({row:n,rect:[+x,+y,right-x,bottom-y],title:title||`Unidentified spine ${++unknown}`,author,unidentified:!title})}}
row(0,393,`
69|97|191|Drown|Junot Díaz
98|129|193|This Is How You Lose Her|Junot Díaz
129|167|194|All Fours|Miranda July
173|213|198||
214|247|194||
251|278|191|The Big Nowhere|James Ellroy
280|306|197|White Jazz|James Ellroy
306|336|218|Perfidia|James Ellroy
337|357|192|The Black Dahlia|James Ellroy
380|405|194|Flowers for Algernon|Daniel Keyes
405|435|186|Catch-22|Joseph Heller
436|453|207|Do Androids Dream of Electric Sheep?|Philip K. Dick
454|473|201||
474|489|215|Annihilation|Jeff VanderMeer
490|512|187|A Sorceress Comes to Call|T. Kingfisher
530|550|194||
551|568|190||
569|584|195||Kazuo Ishiguro
585|604|196|The Vegetarian|Han Kang
605|622|217||
623|651|196||
679|702|224||Philip K. Dick
703|725|197|The Three Stigmata of Palmer Eldritch|Philip K. Dick
726|740|185||
741|754|209||
755|771|194|The Sense of an Ending|Julian Barnes
773|789|219||
792|808|226|Jitterbug Perfume|Tom Robbins
834|850|196|Never Let Me Go|Kazuo Ishiguro
850|869|196|Klara and the Sun|Kazuo Ishiguro
871|889|218|One Hundred Years of Solitude|Gabriel García Márquez
890|905|192|The Buried Giant|Kazuo Ishiguro
906|922|192||
923|947|202|Nineteen Eighty-Four|George Orwell
975|994|192||
995|1013|197|The Circle|Dave Eggers
1015|1033|192|The Naked and the Dead|Norman Mailer
1034|1050|220||
1051|1067|190||
1068|1083|192|Animal Farm|George Orwell
1118|1135|186|Eleanor Rigby|Douglas Coupland
1136|1154|185|The Gum Thief|Douglas Coupland
1155|1178|164|Generation X|Douglas Coupland
1179|1201|187|Microserfs|Douglas Coupland
1202|1220|188|Miss Wyoming|Douglas Coupland
`);
row(1,755,`
99|129|569|The Immortalists|Chloe Benjamin
130|162|568|Stories of Your Life and Others|Ted Chiang
163|185|569|The Golem of Brooklyn|Adam Mansbach
186|219|553|Exhalation|Ted Chiang
220|242|574||
243|269|563||
270|291|561||
292|318|562|Circe|Madeline Miller
319|344|568|The Song of Achilles|Madeline Miller
345|362|564|The Tainted Cup|Robert Jackson Bennett
502|542|532|Katabasis|R. F. Kuang
543|567|525|Unworld|Jayson Greene
568|589|555|Neuromancer|William Gibson
590|605|573|The Lathe of Heaven|Ursula K. Le Guin
606|640|560||
641|661|573|Orbital|Samantha Harvey
682|705|548|Lake of Souls|Ann Leckie
706|725|549|The Left Hand of Darkness|Ursula K. Le Guin
726|753|532|The Hidden Girl and Other Stories|Ken Liu
755|785|552|The Adventures of Amina al-Sirafi|Shannon Chakraborty
787|815|549|The Paper Menagerie and Other Stories|Ken Liu
816|838|529|Axiomatic|Greg Egan
973|996|541|Beautiful World, Where Are You|Sally Rooney
997|1024|529|The Monk of Mokha|Dave Eggers
1025|1056|551|Pachinko|Min Jin Lee
1057|1074|553||
1075|1087|551||
1088|1110|553|Lincoln in the Bardo|George Saunders
1111|1134|544||
1135|1156|542|Stardust|Neil Gaiman
1157|1185|537|Lord of the Flies|William Golding
1186|1210|565||
`);
row(2,447,`
83|137|210|Moonglow|Michael Chabon
137|188|211|Demon Copperhead|Barbara Kingsolver
190|234|209|Swing Time|Zadie Smith
235|272|239|Grand Union|Zadie Smith
273|309|240|The Algebraist|Iain M. Banks
310|339|246|Flights|Olga Tokarczuk
340|369|240|The Lives of Others|Neel Mukherjee
390|426|208|Recursion|Blake Crouch
427|452|216|The Girl on the Train|Paula Hawkins
453|488|214|Anyone|Charles Soule
489|532|212||
534|565|245|Moonbound|Robin Sloan
566|593|211|The Underground Railroad|Colson Whitehead
594|625|211|Underground Airlines|Ben H. Winters
627|666|225|Heroes of the Frontier|Dave Eggers
685|724|232|The Hour I First Believed|Wally Lamb
725|744|257|Foster|Claire Keegan
746|770|216|Ghostways|Robert Macfarlane
772|801|234|Foreskin's Lament|Shalom Auslander
803|829|239|Gould's Book of Fish|Richard Flanagan
831|850|240||
852|874|238|On Earth We're Briefly Gorgeous|Ocean Vuong
875|917|219||
918|948|253|What Is the What|Dave Eggers
980|996|248||David Sedaris
997|1019|255||
1020|1041|252|2666|Roberto Bolaño
1042|1065|252|Amnesia Moon|Jonathan Lethem
1066|1094|244|Pygmy|Chuck Palahniuk
1095|1117|236|Inherent Vice|Thomas Pynchon
1118|1141|243||
1142|1172|218|Chronic City|Jonathan Lethem
1173|1196|248|The Rabbit Hutch|Tess Gunty
1197|1207|248||
1208|1238|258|The War of the Worlds|H. G. Wells
`);
row(3,511,`
45|84|251||
85|130|280|Clockers|Richard Price
363|410|248|Horse|Geraldine Brooks
411|445|249|Little Fires Everywhere|Celeste Ng
446|471|257||
680|701|279|1984|George Orwell
702|723|315||
724|741|310|The Man in the High Castle|Philip K. Dick
743|758|295||
758|778|282|The Wild Robot|Peter Brown
780|796|298|The Hitchhiker's Guide to the Galaxy|Douglas Adams
797|817|282||
818|837|280||
839|860|278|The Smell of Breath|Conor McMillen
861|882|282||
883|920|278|Kockroach|Tyler Knox
921|948|290|Slade House|David Mitchell
949|966|266|Heather, the Totality|Matthew Weiner
1011|1039|262||
1040|1065|307|Foundation|Isaac Asimov
1067|1097|306|Foundation's Edge|Isaac Asimov
1098|1129|306|Foundation and Earth|Isaac Asimov
1130|1161|306|Prelude to Foundation|Isaac Asimov
1162|1193|306|Forward the Foundation|Isaac Asimov
1194|1225|303|Foundation and Empire|Isaac Asimov
1226|1257|303|Second Foundation|Isaac Asimov
`);
row(4,850,`
85|151|647|Shantaram|Gregory David Roberts
152|209|647|The Lincoln Highway|Amor Towles
211|270|627|Freedom|Jonathan Franzen
272|337|631|Purity|Jonathan Franzen
339|374|645|Where the Crawdads Sing|Delia Owens
395|446|653|The Savage Detectives|Roberto Bolaño
447|469|653|Normal People|Sally Rooney
470|489|661|Stories of Your Life and Others|Ted Chiang
490|515|651|Nettle & Bone|T. Kingfisher
516|531|699||
532|570|651|A Brief History of Seven Killings|Marlon James
572|599|628|Educated|Tara Westover
600|616|640|Amsterdam|Ian McEwan
619|647|627|Manhattan Beach|Jennifer Egan
648|667|647||
684|715|651|The Rise and Fall of Great Powers|Tom Rachman
717|742|657|All Involved|Ryan Gattis
744|775|658|Little Failure|Gary Shteyngart
776|806|637|A Dictionary of Modern Legal Usage|Bryan A. Garner
808|848|591|Watchmen|Alan Moore & Dave Gibbons
849|860|604|Preacher: Dixie Fried|Garth Ennis & Steve Dillon
861|872|604|Preacher: Ancient History|Garth Ennis & Steve Dillon
873|884|604|Preacher: Proud Americans|Garth Ennis & Steve Dillon
886|898|605|Preacher: Until the End of the World|Garth Ennis & Steve Dillon
900|913|609|Preacher: Gone to Texas|Garth Ennis & Steve Dillon
915|929|613|Preacher: War in the Sun|Garth Ennis & Steve Dillon
931|944|613|Preacher: Salvation|Garth Ennis & Steve Dillon
946|959|613|Preacher: All Hell's A-Coming|Garth Ennis & Steve Dillon
961|974|617|Preacher: Alamo|Garth Ennis & Steve Dillon
1003|1040|641|Summerland|Michael Chabon
1041|1062|647|Wonder Boys|Michael Chabon
1063|1087|645|The Russian Debutante's Handbook|Gary Shteyngart
1088|1111|649|The Yiddish Policemen's Union|Michael Chabon
1113|1133|649||
1134|1160|643|The Mysteries of Pittsburgh|Michael Chabon
1162|1210|647|Baron Wenckheim's Homecoming|László Krasznahorkai
`);
const stack=[
[251,283,'The Mountain in the Sea','Ray Nayler'],
[285,308,'The State of the Art','Iain M. Banks'],
[309,332,'Use of Weapons','Iain M. Banks'],
[334,358,'Excession','Iain M. Banks'],
[359,386,'The Player of Games','Iain M. Banks'],
[389,424,'Consider Phlebas','Iain M. Banks'],
[426,452,'',''],
[454,484,'The Last Samurai','Helen DeWitt'],
[486,503,'The Imperfectionists','Tom Rachman'],
[505,517,'','']];
stack.forEach(([y,bottom,title,author])=>books.push({row:3,rect:[131,y,195,bottom-y],title:title||`Unidentified spine ${++unknown}`,author,horizontal:true,unidentified:!title}));
applyCloseups(books);
books.sort((a,b)=>a.row-b.row||a.rect[0]-b.rect[0]||a.rect[1]-b.rect[1]);
const known={Drown:['1573226068','https://www.penguinrandomhouse.com/books/348293/drown-by-junot-diaz/'],Katabasis:['0063021471','https://www.publishersweekly.com/9780063021471'],Neuromancer:['0143111604','https://slickdeals.net/f/20017425-prime-11-36-neuromancer-penguin-galaxy-hardcover-at-amazon'],'All Fours':['0593190262','https://openlibrary.org/works/OL37827700W']};
for(const b of books)if(known[b.title]){b.asin=known[b.title][0];b.source=known[b.title][1]}
