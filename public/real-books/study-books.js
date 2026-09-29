// Hand-checked against the September 28 Drive photos. Pixel coordinates refer
// to the orientation-corrected 1280px web copies in assets/study.
export const studyBooks={left:[],cream:[],right:[],tower:[]};
export const studyBases=[13.75,11.1,8.45,5.8,3.15,.5];
function row(collection,source,shelf,bounds,top,bottom,text){
 const [left,right]=bounds,sx=6.6/(right-left),sy=2.3/(bottom-top);
 for(const line of text.trim().split('\n')){
  const [title,author,l,r,t,b,kind]=line.split('|');
  const x1=+l,x2=+r,y1=t?+t:top,y2=b?+b:bottom,h=(y2-y1)*sy,w=(x2-x1)*sx;
  const horizontal=kind==='h';
  studyBooks[collection].push({title,author,row:shelf,rect:[x1,y1,x2-x1,y2-y1],layout:{x:((x1+x2)/2-(left+right)/2)*sx,y:studyBases[shelf]+h/2+(horizontal?(bottom-y2)*sy:0),width:Math.max(.035,w-.012),height:h,depth:horizontal?1.4:Math.min(1.6,Math.max(.85,h*.65))},horizontal,spine:{source:`study/${source}`,quad:[[x1,y1],[x2,y1],[x2,y2],[x1,y2]]},...(!title||title.startsWith('Unidentified')?{unidentified:true}:{})});
 }
}
row('cream','09',1,[140,1210],245,681,`
Joe Biden|Evan Osnos|145|190|326|680
Andrew Carnegie|David Nasaw|226|301|297|666
Steve Jobs|Walter Isaacson|309|380|249|669
A Promised Land|Barack Obama|393|459|250|669
Elon Musk|Walter Isaacson|467|538|256|672
The Price of Peace|Zachary D. Carter|550|616|250|674
Keynes Hayek|Nicholas Wapshott|623|673|252|676
John Adams|David McCullough|681|738|257|676
Louis D. Brandeis|Melvin I. Urofsky|749|830|251|679
Catching the Wind|Neal Gabler|851|909|254|681
Mellon|David Cannadine|930|1010|253|680
Team of Rivals|Doris Kearns Goodwin|1034|1108|248|679
The Code Breaker|Walter Isaacson|1127|1191|248|678
`);
row('cream','11',2,[130,1210],210,643,`
Betraying the Nobel|Unni Turrettini|147|210|228|634
Enlightenment Now|Steven Pinker|205|292|218|633
The Dawn of Everything|David Graeber and David Wengrow|287|386|231|638
The Ministry for the Future|Kim Stanley Robinson|404|761|349|414|h
Guns, Germs, and Steel|Jared Diamond|388|789|422|480|h
Sapiens|Yuval Noah Harari|391|790|493|533|h
Homo Deus|Yuval Noah Harari|394|773|545|583|h
21 Lessons for the 21st Century|Yuval Noah Harari|399|798|590|640|h
One Small Step Can Change Your Life|Robert Maurer|790|817|400|626
Dopamine Nation|Anna Lembke|836|877|297|639
Building a Non-Anxious Life|John Delony|895|941|254|638
Emotional Agility|Susan David|951|993|230|640
The Extended Mind|Annie Murphy Paul|1003|1054|226|642
Joyful|Ingrid Fetell Lee|1081|1126|214|641
Wanting|Luke Burgis|1137|1182|209|642
`);
row('cream','12',3,[115,1230],218,643,`
When|Daniel H. Pink|135|225|246|637
Numbers Don't Lie|Vaclav Smil|190|272|282|639
Messy|Tim Harford|234|306|282|638
Applied Empathy|Michael Ventura|280|341|281|638
A Brief History of Intelligence|Max Bennett|320|407|228|640
Noise|Daniel Kahneman, Olivier Sibony and Cass R. Sunstein|396|478|220|642
The Quantum Labyrinth|Paul Halpern|483|521|292|637
Impromptu|Reid Hoffman with GPT-4|529|556|281|638
Social Chemistry|Marissa King|564|593|293|638
Stumbling on Happiness|Daniel Gilbert|602|630|305|638
More Human|Steve Hilton|637|693|226|648
Flow|Mihaly Csikszentmihalyi|703|731|307|638
Originals|Adam Grant|741|775|288|638
Give and Take|Adam Grant|783|809|290|638
Think Again|Adam Grant|824|868|245|641
No Hard Feelings|Liz Fosslien and Mollie West Duffy|882|916|280|640
Thinking, Fast and Slow|Daniel Kahneman|932|971|296|635
Judgment under Uncertainty: Heuristics and Biases|Daniel Kahneman, Paul Slovic and Amos Tversky|992|1030|270|642
Why Zebras Don't Get Ulcers|Robert M. Sapolsky|1043|1082|260|642
On the Edge|Nate Silver|1106|1179|231|646
`);
row('cream','13',4,[140,1120],280,687,`
You Are a Badass|Jen Sincero|149|206|347|686
Obsessed|Emily Heyward|184|248|337|686
The Making of a Manager|Julie Zhuo|235|293|337|686
You're Not Listening|Kate Murphy|283|338|337|686
Measure What Matters|John Doerr|335|375|337|686
The Long Game|Dorie Clark|380|419|337|686
User Friendly|Cliff Kuang and Robert Fabricant|423|476|339|684
The Master Algorithm|Pedro Domingos|483|525|350|678
Read Write Own|Chris Dixon|529|568|338|680
Always Day One|Alex Kantrowitz|580|621|300|686
The Infinite Game|Simon Sinek|626|657|290|683
The Entrepreneur's Weekly Nietzsche|Dave Jilk and Brad Feld|666|697|313|684
Range|David Epstein|715|753|294|685
Can’t Even|Anne Helen Petersen|766|808|295|685
The Principles of Product Development Flow|Donald G. Reinertsen|820|858|291|684
The Art of the Start|Guy Kawasaki|863|900|294|683
Blue Ocean Strategy|W. Chan Kim and Renée Mauborgne|912|944|284|682
Jobs to Be Done|Stephen Wunker, Jessica Wattman and David Farber|956|986|292|681
That Will Never Work|Marc Randolph|991|1026|281|679
The Lean Startup|Eric Ries|1040|1074|296|674
The Machine That Changed the World|James P. Womack, Daniel T. Jones and Daniel Roos|1084|1108|333|665
`);
row('cream','14',5,[120,1210],200,619,`
Behind the Cloud|Marc Benioff and Carlye Adler|142|234|225|610
The Upstarts|Brad Stone|211|295|210|604
Chaos Monkeys|Antonio García Martínez|268|339|219|602
Unscaled|Hemant Taneja with Kevin Maney|330|398|214|609
The Lean Startup|Eric Ries|388|444|268|596
The Year in Tech 2022|Harvard Business Review|437|460|274|597
The Cold Start Problem|Andrew Chen|461|507|223|597
Hooked|Nir Eyal|518|548|262|595
Design to Grow|David Butler and Linda Tischler|555|591|224|602
Growth Hacker Marketing|Ryan Holiday|595|609|281|596
The Obstacle Is the Way|Ryan Holiday|612|630|241|596
Remote|Jason Fried and David Heinemeier Hansson|641|672|259|596
Accelerate|Nicole Forsgren, Jez Humble and Gene Kim|685|713|239|600
Alibaba|Duncan Clark|724|754|222|602
Create the Future + The Innovation Handbook|Jeremy Gutsche|770|810|238|613
Work Rules!|Laszlo Bock|827|871|229|605
How I Built This|Guy Raz|880|923|228|607
Crossing the Chasm|Geoffrey A. Moore|934|955|342|604
Never Split the Difference|Chris Voss with Tahl Raz|962|993|295|603
How to Fail at Almost Everything and Still Win Big|Scott Adams|1005|1037|234|608
The Nordstrom Way|Robert Spector and Patrick D. McCarthy|1049|1094|235|621
Ogilvy on Advertising|David Ogilvy|1114|1170|185|627
`);
row('right','08',1,[120,1140],250,700,`
After the Fall|Ben Rhodes|139|191|261|695
The Rise and Fall of the Neoliberal Order|Gary Gerstle|196|254|269|696
White Trash|Nancy Isenberg|267|339|291|696
Kill Switch|Adam Jentleson|345|395|283|695
Tailspin|Steven Brill|404|463|271|698
The Wise Men|Walter Isaacson and Evan Thomas|474|537|284|696
The Lessons of History|Will and Ariel Durant|543|571|257|697
The Art of Power|Nancy Pelosi|585|630|282|697
On Freedom|Timothy Snyder|644|691|272|693
Seeing Like a State|James C. Scott|699|741|362|670
The Paranoid Style in American Politics and Other Essays|Richard Hofstadter|751|777|352|670
Twilight of the Elites|Christopher Hayes|787|810|353|670
Fear Itself|Ira Katznelson|820|868|339|668
Post-Capitalist Society|Peter F. Drucker|877|896|350|666
The System|Robert B. Reich|902|934|357|666
How Democracies Die|Steven Levitsky and Daniel Ziblatt|944|971|352|664
American Dialogue|Joseph J. Ellis|977|1005|348|663
The Optimistic Leftist|Ruy Teixeira|1014|1061|332|667
Recoding America|Jennifer Pahlka|1071|1121|274|676
Our Dishonest President|Los Angeles Times Editorial Board|130|463|207|225|h
Six Amendments|John Paul Stevens|130|534|231|260|h
`);
row('right','07',2,[78,1148],290,700,`
On Fire|Naomi Klein|105|178|333|687
This Changes Everything|Naomi Klein|151|217|349|688
The Precipice|Toby Ord|194|284|307|696
Speed & Scale|John Doerr|264|338|308|691
How to Avoid a Climate Disaster|Bill Gates|326|385|293|694
The Uninhabitable Earth|David Wallace-Wells|377|433|294|692
The Omnivore's Dilemma|Michael Pollan|437|492|297|691
The Upcycle|William McDonough and Michael Braungart|500|532|354|687
The Sixth Extinction|Elizabeth Kolbert|536|577|356|689
The Tyranny of Merit|Michael J. Sandel|584|626|311|686
Arguing with Zombies|Paul Krugman|634|694|300|686
Poorly Understood|Mark Rank, Lawrence Eppard and Heather Bullock|706|741|300|684
The Decadent Society|Ross Douthat|749|787|309|684
Hidden in Plain Sight|Peter J. Wallison|798|829|324|680
Radical Markets|Eric A. Posner and E. Glen Weyl|844|882|333|680
The Politics Industry|Katherine M. Gehl and Michael E. Porter|891|927|304|681
What Is Real?|Adam Becker|937|971|357|683
The Wizard and the Prophet|Charles C. Mann|980|1026|369|686
A Brief History of Time|Stephen Hawking|1091|1123|274|705
`);
row('right','06',3,[198,1160],200,645,`
On Edge|Andrea Petersen|202|263|207|643
The Heartfulness Way|Kamlesh D. Patel and Joshua Pollock|268|298|238|642
The Mythical Man-Month|Frederick P. Brooks Jr.|302|330|233|642
Humble Leadership|Edgar H. Schein and Peter A. Schein|336|365|272|639
The Creative Curve|Allen Gannett|369|397|281|639
My Age of Anxiety|Scott Stossel|407|442|301|638
Cognitive Behavioral Therapy|Olivia Telford|446|465|284|638
Quiet Your Mind|John Selby|474|499|282|638
The Art of Happiness|The Dalai Lama and Howard C. Cutler|507|539|295|638
Fear of Falling|Barbara Ehrenreich|549|591|313|638
The Worry Cure|Robert L. Leahy|599|619|315|638
The Gifts of Imperfection|Brené Brown|626|647|273|638
Fully Present|Susan L. Smalley and Diana Winston|653|684|268|638
Burn Rate|Andy Dunn|692|729|288|641
Overwhelmed|Brigid Schulte|736|767|309|639
Zen and the Art of Motorcycle Maintenance|Robert M. Pirsig|777|813|370|638
The Untethered Soul|Michael A. Singer|827|852|356|638
When Breath Becomes Air|Paul Kalanithi|861|888|341|638
The Happiness Advantage|Shawn Achor|898|917|331|639
Option B|Sheryl Sandberg and Adam Grant|927|956|275|640
Mindfulness||962|979|375|640
Wild at Heart|John Eldredge|984|1010|313|640
The 5 Love Languages|Gary Chapman|1020|1039|310|642
Attached|Amir Levine and Rachel S. F. Heller|1046|1073|295|642
The State of Affairs|Esther Perel|1078|1097|341|642
Hold Me Tight|Sue Johnson|1105|1152|285|643
`);
row('right','05',4,[170,1110],248,710,`
SuperFreakonomics|Steven D. Levitt and Stephen J. Dubner|323|754|404|448|h
What Money Can't Buy|Michael J. Sandel|238|748|451|499|h
The Wealth Blueprint|Selwyn Gerber and Jonathan Gerber|248|749|506|537|h
The Bogleheads' Guide to Investing|Taylor Larimore, Mel Lindauer and Michael LeBoeuf|246|745|545|589|h
One Billion Americans|Matthew Yglesias|243|755|598|643|h
Un-Trumping America|Dan Pfeiffer|246|752|658|701|h
HBR's 10 Must Reads: The Essentials|Harvard Business Review|760|782|284|681
HBR's 10 Must Reads 2017|Harvard Business Review|790|813|286|681
HBR's 10 Must Reads on Strategic Marketing|Harvard Business Review|822|845|287|681
HBR's 10 Must Reads on Managing People|Harvard Business Review|851|876|289|681
HBR Guide to Coaching Employees|Harvard Business Review|884|905|253|680
HBR's 10 Must Reads on Managing Yourself|Harvard Business Review|912|935|291|681
HBR's 10 Must Reads on Strategy|Harvard Business Review|940|964|295|679
HBR's 10 Must Reads on Communication|Harvard Business Review|974|996|299|679
HBR's 10 Must Reads on Innovation|Harvard Business Review|1004|1026|300|678
`);
row('right','04',5,[10,1210],130,714,`
Vinyl Me, Please: 100 Albums You Need in Your Collection|Vinyl Me, Please|42|117|158|742
Juxtapoz Poster Art|Juxtapoz|168|213|173|712
Aerosmith: The Ultimate Illustrated History|Richard Bienstock|221|250|240|700
Can't Stop Won't Stop|Jeff Chang|254|336|238|707
Ego Trip's Book of Rap Lists|Sacha Jenkins, Elliott Wilson, Chairman Mao, Gabriel Alvarez and Brent Rollins|345|386|258|700
Decoded|Jay-Z|392|451|245|693
The Creative Act|Rick Rubin|466|516|290|664
Mo' Meta Blues|Questlove with Ben Greenman|529|565|271|656
The Vinyl Ain't Final|Dipannita Basu and Sidney J. Lemelle|575|597|292|654
All You Need to Know About the Music Business|Donald S. Passman|609|659|283|661
The Rolling Stone Interviews|Jann S. Wenner and Joe Levy|671|714|288|653
Jay-Z|Michael Eric Dyson|723|745|354|645
Go Ahead in the Rain|Hanif Abdurraqib|753|775|364|644
Securities Regulation: Cases and Materials|Cox, Hillman, Langevoort, Lipton and Sjostrom|820|885|224|673
How to Reassess Your Chess|Jeremy Silman|900|930|248|664
Eating Animals|Jonathan Safran Foer|939|959|284|642
Economics|Paul Krugman and Robin Wells|1084|1188|264|687
`);
row('right','10',0,[290,1140],280,640,`
IKEA Democratic Design|IKEA|379|891|292|338|h
IKEA the Book|IKEA|326|944|354|420|h
We Love Home|IKEA|322|1134|446|527|h
Less Is More (Difficult): 20 Years of Design at Blu Dot|Blu Dot|305|1071|541|628|h
`);
row('left','16',1,[150,1240],270,737,`
Strategic Marketing Management|Alexander Chernev|153|181|282|729
The Changing World Order|Ray Dalio|235|304|299|714
Principles: Life and Work|Ray Dalio|310|385|298|713
The 48 Laws of Power|Robert Greene|396|458|300|719
The Laws of Human Nature|Robert Greene|467|550|282|722
Connecting the Dots|John Chambers|553|601|299|720
The Starfish and the Spider|Ori Brafman and Rod A. Beckstrom|607|639|342|722
The Tipping Point|Malcolm Gladwell|645|680|346|721
Blink|Malcolm Gladwell|685|727|344|722
Outliers|Malcolm Gladwell|734|773|346|722
The Undoing Project|Michael Lewis|780|818|346|725
The Premonition|Michael Lewis|824|876|282|728
A Passion for Leadership|Robert M. Gates|881|924|282|728
Good to Great|Jim Collins|928|976|286|729
The Lords of Strategy|Walter Kiechel|983|1038|280|735
Leadership|Henry Kissinger|1043|1117|275|737
On Grand Strategy|John Lewis Gaddis|1120|1160|329|726
Competitive Strategy|Michael E. Porter|1164|1240|278|737
`);
row('left','15',2,[190,1160],230,727,`
Modern Principles: Macroeconomics|Tyler Cowen and Alex Tabarrok|195|244|234|725
The Great Escape|Angus Deaton|285|341|322|695
The New Economics|W. Edwards Deming|345|372|351|693
Narrative Economics|Robert J. Shiller|375|418|370|694
Scarcity|Sendhil Mullainathan and Eldar Shafir|422|457|382|691
A Brief History of Equality|Thomas Piketty|461|494|375|694
Power: A New Social Analysis|Bertrand Russell|498|520|355|696
Economics for the Common Good|Jean Tirole|524|575|397|690
Misbehaving|Richard H. Thaler|578|614|387|694
Nudge|Richard H. Thaler and Cass R. Sunstein|618|651|378|700
American Bonds|Sarah L. Quinn|656|681|349|704
Competition|James Case|686|729|348|707
The Undercover Economist Strikes Back|Tim Harford|736|763|388|708
The Undercover Economist|Tim Harford|768|805|337|705
Information Rules|Carl Shapiro and Hal R. Varian|810|852|356|708
The Logic of Life|Tim Harford|858|893|333|714
The Data Detective|Tim Harford|899|942|345|714
The Exponential Age|Azeem Azhar|950|985|345|715
Four Threats|Suzanne Mettler and Robert C. Lieberman|993|1032|333|717
The People Themselves|Larry D. Kramer|1040|1071|357|717
Mission Economy|Mariana Mazzucato|1075|1118|346|719
10% Less Democracy|Garett Jones|1121|1156|339|720
`);
row('left','17',3,[100,1200],215,775,`
Tools and Weapons|Brad Smith and Carol Ann Browne|111|166|217|700
The Coming Wave|Mustafa Suleyman with Michael Bhaskar|180|229|217|701
The Sentient Machine|Amir Husain|240|283|232|700
The Second Machine Age|Erik Brynjolfsson and Andrew McAfee|290|372|220|701
Co-Intelligence|Ethan Mollick|373|402|279|691
Shape|Jordan Ellenberg|401|452|220|705
How Not to Be Wrong|Jordan Ellenberg|458|516|215|710
God, Human, Animal, Machine|Meghan O'Gieblyn|526|576|281|696
Theory of Games and Economic Behavior|John von Neumann and Oskar Morgenstern|583|1109|533|603|h
Artificial Intelligence: A Modern Approach|Stuart Russell and Peter Norvig|560|1135|620|722|h
GreenPilled|Kevin Owocki|565|1187|736|775|h
`);
row('left','18',4,[106,1212],265,715,`
Holy Bible: New Revised Standard Version||117|185|375|679
Holy Bible: New International Version||181|264|302|681
Exercised|Daniel Lieberman|278|325|348|673
Confessions of an Advertising Man|David Ogilvy|310|757|530|572|h
Shoe Dog|Phil Knight|332|748|580|620|h
Genius Makers|Cade Metz|330|744|633|667|h
Leading Matters|John L. Hennessy|339|746|682|704|h
Who Is Michael Ovitz?|Michael Ovitz|786|849|265|715
Good Economics for Hard Times|Abhijit V. Banerjee and Esther Duflo|852|910|269|715
Net Positive|Paul Polman and Andrew Winston|916|969|267|715
More from Less|Andrew McAfee|975|1026|282|715
The Business of Venture Capital|Mahendra Ramsinghani|1036|1092|284|715
High Growth Handbook|Elad Gil|1101|1185|286|714
`);
row('left','19',5,[0,1220],231,715,`
The God Delusion|Richard Dawkins|3|73|244|673
The Portable Atheist|Christopher Hitchens|60|127|245|670
Why Buddhism Is True|Robert Wright|130|245|251|670
The Meaning of Human Existence|Edward O. Wilson|240|280|323|659
The Infidel and the Professor|Dennis C. Rasmussen|280|319|320|656
Major Works|Ludwig Wittgenstein|320|371|315|656
Moral Action|Robert Sokolowski|372|393|290|662
Selections from the Essays|Michel de Montaigne|392|409|346|659
Nicomachean Ethics|Aristotle|409|449|340|667
Meditations|Marcus Aurelius|450|468|318|669
The Evolution of God|Robert Wright|459|542|234|677
The Divine Comedy: Inferno|Dante Alighieri|555|588|331|669
Man's Search for Meaning|Viktor E. Frankl|615|641|378|655
Beyond Good and Evil|Friedrich Nietzsche|646|671|266|674
The Theory of the Leisure Class|Thorstein Veblen|679|705|266|675
Does the Center Hold?|Donald Palmer|704|721|364|678
The World as I See It|Albert Einstein|723|751|251|676
Thus Spoke Zarathustra|Friedrich Nietzsche|765|796|335|650
Human, All Too Human / Beyond Good and Evil|Friedrich Nietzsche|799|860|334|652
Twilight of the Idols|Friedrich Nietzsche|862|892|338|651
Political Dialogues: Republic, Laws, Statesman|Plato|893|984|285|664
Philosophical Investigations|Ludwig Wittgenstein|984|1053|282|676
The Theory of Moral Sentiments|Adam Smith|1125|1212|171|750
`);
row('left','20',0,[95,1255],190,612,`
Begin Again|Eddie S. Glaude Jr.|100|177|193|575
The Big Sea|Langston Hughes|177|218|219|576
Yarmulkes & Fitted Caps|Aaron Levy Samuels|215|620|448|464|h
The City|Allen J. Scott and Edward W. Soja|205|630|471|511|h
The Collected Poems of Wallace Stevens|Wallace Stevens|202|661|528|586|h
Principles for Success|Ray Dalio|677|1216|566|603|h
Unidentified orange volume||662|1254|604|613|h
`);

// Tower ledges are separate stacks. List the photographed spines top to bottom;
// their thickness comes from the photo and every pile rests on its own ledge.
const towerStacks=[];
function stack(source,text){
 towerStacks.push(text.trim().split('\n').map(line=>{
  const [title,author,l,t,r,b]=line.split('|'),x1=+l,y1=+t,x2=+r,y2=+b;
  const width=3.15*(x2-x1)/600,height=Math.max(.055,width*(y2-y1)/(x2-x1));
  return {title,author,horizontal:true,rect:[x1,y1,x2-x1,y2-y1],layout:{x:((x1+x2)/2-470)/600*.4,width,height,depth:1.75},spine:{source:`study/${source}`,quad:[[x1,y1],[x2,y1],[x2,y2],[x1,y2]]}};
 }));
}
stack('22',`
The Best of Lenny's Newsletter, Volume 1|Lenny Rachitsky|38|128|701|208
High Growth Handbook|Elad Gil|48|210|719|306
`);
stack('22',`
Where Is My Flying Car?|J. Storrs Hall|162|510|735|574
Invent & Wander|Jeff Bezos|162|582|735|631
Sprint|Jake Knapp, John Zeratsky and Braden Kowitz|183|645|727|707
`);
stack('22',`
The Art of Doing Science and Engineering|Richard W. Hamming|183|756|714|823
An Elegant Puzzle|Will Larson|190|839|706|890
The Big Score|Michael S. Malone|216|913|716|955
Increment: Programming Languages|Increment|166|981|686|1000
`);
stack('23',`
The Great Mental Models, Volume 4: Economics and Art|Shane Parrish and Rhiannon Beaubien|240|237|741|273
The Great Mental Models, Volume 2: Physics, Chemistry and Biology|Shane Parrish and Rhiannon Beaubien|140|291|779|363
The Great Mental Models, Volume 3: Systems and Mathematics|Shane Parrish and Rhiannon Beaubien|181|386|796|453
`);
stack('23',`
Ethics in the Real World|Peter Singer|275|605|690|654
High Output Management|Andrew S. Grove|276|671|681|695
The Cathedral & the Bazaar|Eric S. Raymond|279|710|726|735
The Hard Thing About Hard Things|Ben Horowitz|239|764|731|801
`);
stack('24',`
Nexus|Yuval Noah Harari|207|100|790|190
Thinking in Systems|Donella H. Meadows|276|213|785|244
The Alignment Problem|Brian Christian|238|259|778|345
`);
stack('24',`
The Dream Machine|M. Mitchell Waldrop|227|418|726|490
The Revolt of the Public|Martin Gurri|233|510|708|576
Abundance|Ezra Klein and Derek Thompson|242|596|700|631
`);
stack('25',`
Only the Paranoid Survive|Andrew S. Grove|216|56|718|88
Algorithms to Live By|Brian Christian and Tom Griffiths|188|108|751|151
The Essays of Warren Buffett|Warren Buffett and Lawrence A. Cunningham|167|173|794|209
`);
stack('25',`
How to Lie with Statistics|Darrell Huff|239|288|687|306
Anti-Intellectualism in American Life|Richard Hofstadter|239|322|681|367
The American Political Tradition|Richard Hofstadter|248|384|681|426
Stubborn Attachments|Tyler Cowen|201|440|704|473
The Power Law|Sebastian Mallaby|226|491|723|558
`);
stack('25',`
Orbiting the Giant Hairball|Gordon MacKenzie|295|646|618|675
The Wealth of Nations|Adam Smith|303|690|667|735
The End of History and the Last Man|Francis Fukuyama|305|749|659|780
Increment: Frontend|Increment|306|786|664|800
Increment: Software Architecture|Increment|300|804|670|816
`);
stack('26',`
The Federalist Papers|Alexander Hamilton, James Madison and John Jay|193|325|819|393
The Power of Creative Destruction|Philippe Aghion, Céline Antonin and Simon Bunel|215|415|848|484
Empowered|Marty Cagan and Chris Jones|235|511|822|575
`);
stack('26',`
Founders at Work|Jessica Livingston|305|684|786|716
Inspired|Marty Cagan|297|743|782|790
Modern Philosophy: An Anthology of Primary Sources|Roger Ariew and Eric Watkins|279|833|785|872
`);
export const towerBases=[];
let towerY=.22;
for(let r=towerStacks.length-1;r>=0;r--){
 towerBases[r]=towerY;
 for(const book of [...towerStacks[r]].reverse()){
  book.row=r;book.layout.y=towerY+book.layout.height/2;
  towerY+=book.layout.height+.012;
 }
 towerY+=.32;
}
studyBooks.tower=towerStacks.flat();
export const towerHeight=towerY-.32;
// The cream case has no books on its top surface.
studyBooks.cream.forEach(book=>book.row--);

// Rectify the visibly leaning spines rather than including a neighboring cover.
function corners(collection,title,quad){
 const book=studyBooks[collection].find(b=>b.title===title),old=book.spine.quad;
 const center=points=>points.reduce((s,p)=>s+p[0],0)/4;
 const width=((quad[1][0]-quad[0][0])+(quad[2][0]-quad[3][0]))/2;
 const scale=book.layout.width/book.rect[2];
 book.layout.x+=(center(quad)-center(old))*scale;
 book.layout.width=width*scale;book.spine.quad=quad;
}
corners('cream','When',[[120,233],[175,232],[228,638],[180,636]]);
corners('cream',"Numbers Don't Lie",[[177,277],[218,278],[276,637],[237,635]]);
corners('cream','Messy',[[221,285],[264,282],[309,638],[277,638]]);
corners('cream','Applied Empathy',[[264,276],[308,277],[340,638],[310,638]]);
corners('cream','A Brief History of Intelligence',[[313,224],[374,222],[413,643],[348,641]]);
corners('cream','Noise',[[385,220],[455,217],[478,641],[411,640]]);
corners('cream','You Are a Badass',[[142,344],[175,340],[206,687],[176,687]]);
corners('cream','Obsessed',[[180,335],[219,334],[246,687],[206,687]]);
corners('cream','The Making of a Manager',[[224,333],[272,331],[292,688],[247,687]]);
corners('cream',"You're Not Listening",[[278,334],[325,334],[338,688],[296,688]]);
corners('cream','Behind the Cloud',[[114,211],[179,209],[229,610],[191,613]]);
corners('cream','The Upstarts',[[191,203],[247,203],[294,603],[242,606]]);
corners('cream','Chaos Monkeys',[[255,217],[304,214],[342,602],[299,602]]);
corners('cream','Unscaled',[[314,202],[368,211],[398,608],[351,609]]);

// Keep plainly visible but unreadable volumes in place without inventing a title.
studyBooks.right.push({title:'Unidentified white volume',author:'',unidentified:true,row:0,rect:[641,15,47,135],layout:{x:2.95,y:14.65,width:.15,height:1.8,depth:1.25},spine:{source:'study/03',quad:[[671,15],[688,17],[664,149],[641,148]]}});
studyBooks.cream.push({title:'Unidentified illustrated volume',author:'',unidentified:true,row:2,horizontal:true,coverFace:2,rect:[4,783,425,19],layout:{x:-1.93,y:5.84,width:2.2,height:.08,depth:1.9},spine:{source:'study/12',quad:[[4,783],[429,786],[430,803],[4,798]]},top:{source:'study/12',quad:[[185,651],[495,650],[440,790],[9,779]]}});
studyBooks.left.push({title:'Unidentified flat volume',author:'',unidentified:true,row:5,horizontal:true,rect:[1,214,425,45],layout:{x:-2.04,y:2.91,width:2.51,height:.08,depth:1.7},spine:{source:'study/19',quad:[[2,214],[428,247],[427,260],[2,228]]}});

// Perspective can make adjacent photographed spines overlap. Their physical
// cuboids need a small gap, and tall angled covers must clear the shelf above.
for(const key of ['left','cream','right']){
 const bases=key==='cream'?studyBases.slice(1):studyBases;
 const list=studyBooks[key];
 for(const book of list){
  const p=book.layout,floor=bases[book.row];
  if(!book.horizontal){p.height=Math.min(p.height,2.45);p.y=floor+p.height/2}
  p.y=Math.max(p.y,floor+p.height/2);
 }
 const overhang=list.filter(b=>b.row===1&&b.horizontal);
 if(key==='right')overhang.forEach(b=>b.layout.y-=.065);
 for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
  const a=list[i],b=list[j],p=a.layout,q=b.layout;
  if(a.row!==b.row||Math.abs(p.y-q.y)>=(p.height+q.height)/2-.025)continue;
  const gap=Math.abs(p.x-q.x),span=(p.width+q.width)/2;
  if(gap<span+.008){const scale=Math.max(.1,(gap-.008)/span);p.width*=scale;q.width*=scale}
 }
}
