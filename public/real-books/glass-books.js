// Physical copies, in photographed order. Coordinates refer to the supplied
// 1280 × 964 photographs; each quad is TL, TR, BR, BL. Duplicate copies stay distinct.
const books=[];
function add(title,author,row,left,right,top,bottom,source,quad,extra={}) {
 const width=(right-left)/1240*10.1,height=(bottom-top)/420*3.1;
 books.push({title,author,row,rect:[left,top,right-left,bottom-top],
  layout:{x:((left+right)/2/1240-.5)*10.1,y:(row===0?4.55:.7)+height/2,width,height},
  spine:{source:`glass/${source}`,quad:quad||[[left,top],[right,top],[right,bottom],[left,bottom]]},...extra});
}
// Top shelf: the additional close-up resolves Adapt and the leftmost spines.
const top=[
 ['The Economic Structure of Corporate Law','Frank H. Easterbrook and Daniel R. Fischel',42,77,74],
 ['HBR Guide to Finance Basics for Managers','Harvard Business Review',78,110,84],
 ['We the Corporations','Adam Winkler',112,150,111],
 ['Adapt: Why Success Always Starts with Failure','Tim Harford',151,195,115],
 ['The Tangled Tree','David Quammen',196,235,86],
 ['Dancing in the Streets','Barbara Ehrenreich',236,279,122],
 ['Behave','Robert Sapolsky',280,345,137],
 ['Making Sense','Sam Harris',346,410,86],
 ['Gödel, Escher, Bach','Douglas R. Hofstadter',411,474,86],
 ['Einstein','Walter Isaacson',475,551,75],
 ['The Monocle Guide to Better Living','Monocle',552,621,31],
 ['Prescription for Nutritional Healing','Phyllis A. Balch and James F. Balch',622,687,24],
 ['Scaling People','Claire Hughes Johnson',688,747,80],
 ["Poor Charlie’s Almanack",'Charles T. Munger; edited by Peter D. Kaufman',748,797,85],
 ['Scientific Freedom: The Elixir of Civilization','Donald W. Braben',798,833,97],
 ['Boom','Byrne Hobart and Tobias Huber',834,878,94],
];
const topQuads=[
 [[100,125],[186,127],[176,850],[52,850]],
 [[188,126],[328,128],[319,850],[179,850]],
 [[337,109],[479,98],[475,850],[346,846]],
 [[490,19],[628,20],[618,857],[490,853]],
 [[642,9],[772,17],[757,861],[634,860]],
 [[780,117],[910,121],[892,867],[771,865]],
 [[919,120],[1015,125],[998,865],[909,868]],
 [[1024,146],[1085,149],[1081,858],[1010,856]],
 [[1093,148],[1172,148],[1159,856],[1085,851]],
];
const upperLeftQuads=[
 [[148,42],[209,47],[207,746],[145,744]],
 [[216,65],[260,94],[258,749],[217,749]],
 [[266,125],[353,125],[346,752],[264,750]],
 [[362,129],[430,132],[432,755],[360,752]],
 [[446,67],[527,68],[522,759],[440,758]],
 [[547,148],[611,151],[602,766],[534,760]],
 [[619,171],[739,174],[724,766],[612,763]],
 [[756,58],[858,55],[839,772],[732,767]],
 [[881,52],[1010,54],[1004,770],[855,772]],
 [[1033,33],[1167,24],[1160,776],[1017,772]],
];
top.forEach(([title,author,l,r,t],i)=>add(title,author,0,l,r,t,414,i<10?'upper-left':'top',i<10?upperLeftQuads[i]:topQuads[i-7]));
add('Student’s Dictionary','',0,990,1235,333,385,'full',[[1008,328],[1239,328],[1241,379],[1007,380]],{horizontal:true,unidentified:true});
// Lower upright books. Layout comes from the overview; textures from close-ups.
const lower=[
 ['The Mind-Gut Connection','Emeran Mayer',51,88,545,'left',[[153,184],[225,182],[207,844],[146,838]]],
 ['Prescription for Nutritional Healing: A-to-Z Guide to Supplements','Phyllis A. Balch',89,126,545,'left',[[232,184],[317,192],[298,844],[215,849]]],
 ['Water, Wind, and Wildwood','Henry David Thoreau',127,143,567,'left',[[311,268],[343,265],[338,839],[316,837]]],
 ['On Tyranny','Timothy Snyder',144,160,577,'left',[[344,345],[376,344],[374,841],[343,838]]],
 ['Fully Automated Luxury Communism','Aaron Bastani',161,189,557,'left',[[381,213],[432,213],[443,840],[384,841]]],
 ['The Anxious Generation','Jonathan Haidt',190,239,495,'left',[[439,62],[541,59],[559,839],[451,849]]],
 ['The Last Lecture','Randy Pausch with Jeffrey Zaslow',240,280,570,'left',[[558,252],[620,253],[644,853],[573,853]]],
 ['On Liberty','John Stuart Mill',281,294,551,'left',[[619,191],[646,197],[685,863],[661,869]]],
 ['The Constitution and the Declaration of Independence','',301,317,567,'left',[[670,213],[693,216],[743,846],[716,853]]],
 ['Get Together','Bailey Richardson, Kevin Huynh and Kai Elmer Sotto',318,352,505,'left',[[687,100],[757,94],[825,850],[749,852]]],
 ['The Problems of Philosophy','Bertrand Russell',353,365,544,'left',[[770,159],[791,160],[844,860],[817,863]]],
 ['The Almanack of Naval Ravikant','Eric Jorgenson',366,394,538,'left',[[796,164],[850,161],[900,862],[848,863]]],
 ['The Coddling of the American Mind','Greg Lukianoff and Jonathan Haidt',395,426,540,'left',[[855,177],[914,173],[973,864],[910,864]]],
 ['This Life','Martin Hägglund',427,468,552,'left',[[945,194],[1018,185],[1068,887],[991,891]]],
 ['The Te of Piglet','Benjamin Hoff',469,493,584,'center',[[138,275],[252,308],[324,839],[211,850]]],
 ['The Tao of Pooh','Benjamin Hoff',494,513,569,'center',[[267,346],[305,346],[350,805],[315,817]]],
 ['Works in Progress — Issue 23','Works in Progress',514,530,503,'center',[[279,99],[318,113],[372,830],[338,834]]],
 ['The Infinity Machine','Sebastian Mallaby',531,575,498,'center',[[330,102],[437,94],[482,826],[382,829]]],
 ['The Visual Display of Quantitative Information','Edward R. Tufte',576,612,467,'center',[[449,6],[503,5],[574,832],[497,837]]],
 ['Holy Bible — King James Version','Thomas Nelson',613,672,525,'center',[[565,151],[668,145],[683,831],[581,841]]],
 ['Pieces of the Action','Vannevar Bush',673,726,513,'center',[[684,128],[777,128],[779,680],[680,717]]],
 ['The Origins of Efficiency','Brian Potter',727,770,518,'center',[[796,130],[876,130],[876,650],[786,652]]],
 ['Deep Utopia','Nick Bostrom',771,811,522,'center',[[889,117],[967,117],[975,845],[906,844]]],
 ['The Rise and Fall of the Artificial State','Jill Lepore',812,852,519,'center',[[983,107],[1057,105],[1054,848],[982,848]]],
];
lower.forEach(([title,author,l,r,t,source,quad])=>add(title,author,1,l,r,t,844,source,quad));
// Stack, bottom to top. Height and elevation preserve the physical ordering.
const stack=[
 ['Wendell Dayton','Wendell Dayton',.22,[[277,746],[1240,705],[1240,763],[276,800]]],
 ['Madeline','Ludwig Bemelmans',.24,[[289,682],[1279,640],[1279,704],[288,741]]],
 ['The Little Prince — Deluxe Pop-Up Book','Antoine de Saint-Exupéry',.62,[[301,540],[1188,478],[1197,623],[287,680]]],
 ['The Big, Fun Kids Cookbook','Food Network Magazine',.35,[[334,428],[1090,394],[1107,481],[335,528]]],
 ['HBR Guide to Finance Basics for Managers','Harvard Business Review',.16,[[336,359],[1041,316],[1043,353],[337,396]]],
 ['A Culture of Growth','Joel Mokyr',.28,[[324,281],[985,236],[994,297],[336,353]]],
 ['The Worldly Philosophers','Robert L. Heilbroner',.34,[[306,183],[970,141],[978,223],[318,278]]],
 ['Works in Progress — Issue 24','Works in Progress',.07,[[300,165],[1157,92],[1149,114],[306,181]]],
 ['Superintelligence','Nick Bostrom',.30,[[271,81],[909,22],[922,109],[294,161]]],
];
let elevation=0;
stack.forEach(([title,author,height,quad])=>{
 add(title,author,1,873,1235,0,40,'stack',quad,{horizontal:true,layout:{x:3.5,y:.7+elevation+height/2,width:3.1,height,depth:1.5}});
 elevation+=height+.018;
});
// The full cabinet photographs reveal the cup compartment below both book rows.
for(const book of books)book.layout.y+=3;
export {books as glassBooks};
