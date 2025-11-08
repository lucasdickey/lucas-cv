export interface Book {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  amazonUrl: string;
  slug: string;
  status?: "reading" | "read" | "pending";
  detailedDescription?: string;
  genre?: string;
  publishedYear?: string;
  pages?: string;
  isbn?: string;
  publisher?: string;
  rating?: string;
}

export const books: Book[] = [
  {
    title: "The Scaling Era: An Oral History of AI, 2019–2025",
    author: "Dwarkesh Patel and Gavin Leech",
    description: "An oral history documenting the rapid advancement of artificial intelligence",
    coverUrl: "/images/books/scaling-era.jpg",
    amazonUrl: "https://www.amazon.com/dp/1953953557",
    slug: "scaling-era-ai-history",
    status: "reading",
    detailedDescription: "This oral history captures one of the most transformative periods in technological development through interviews with key figures who shaped the AI revolution. Chronicling the years when machine learning models grew exponentially in capability, the book provides firsthand accounts of breakthrough moments, strategic decisions, and the cultural shift as artificial intelligence moved from research labs to becoming a defining force in society.",
    genre: "Technology/History",
    publishedYear: "2025",
    pages: "320",
    publisher: "Stripe Press",
    rating: "4.5/5"
  },

  {
    title: "Sourdough",
    author: "Robin Sloan",
    description: "A novel about food, culture, and technology in San Francisco",
    coverUrl: "/images/books/sourdough.jpg",
    amazonUrl: "https://www.amazon.com/dp/1250192757",
    slug: "sourdough-robin-sloan",
    detailedDescription: "From the author of Mr. Penumbra's 24-Hour Bookstore comes a whimsical novel about Lois, a software engineer who discovers a sourdough starter with mysterious origins. As she learns to bake bread, she's drawn into San Francisco's underground food culture and must navigate the worlds of artisan baking, fermentation, and robotics. A charming exploration of food, friendship, and finding meaning in unexpected places.",
    genre: "Literary Fiction",
    publishedYear: "2017",
    pages: "272",
    publisher: "MCD",
    rating: "3.9/5"
  },

  {
    title: "Moonbound",
    author: "Robin Sloan",
    description: "A genre-blending novel from the author of Mr. Penumbra's 24-Hour Bookstore",
    coverUrl: "/images/books/moonbound.jpg",
    amazonUrl: "https://amzn.to/42p4A0S",
    slug: "moonbound-robin-sloan",
    detailedDescription: "From bestselling author Robin Sloan comes a mind-bending adventure that blends science fiction and fantasy in entirely new ways. Set 11,000 years in the future, Moonbound follows a young boy raised by a robotic guardian on a desolate moon. When he discovers a mysterious talking animal, he embarks on a quest across time and space that challenges everything he knows about reality, family, and the nature of intelligence itself. Sloan crafts a wildly inventive tale that spans millennia while maintaining an intimate, character-driven narrative.",
    genre: "Science Fiction/Fantasy",
    publishedYear: "2024",
    pages: "272",
    publisher: "MCD",
    rating: "4.0/5"
  },

  {
    title: "All Fours",
    author: "Miranda July",
    description: "A novel about a married artist's midlife awakening and journey of self-discovery",
    coverUrl: "/images/books/all-fours.jpg",
    amazonUrl: "https://amzn.to/47FH9Uv",
    slug: "all-fours-miranda-july",
    detailedDescription: "Miranda July's audacious and tender novel follows a married artist in her forties who embarks on an unexpected journey of self-discovery. When a planned road trip to New York gets derailed, she finds herself staying at a motel just miles from home, confronting desires and possibilities she never knew existed. A provocative exploration of marriage, motherhood, and female desire that challenges conventional narratives about women's lives at midlife.",
    genre: "Literary Fiction",
    publishedYear: "2024",
    pages: "320",
    publisher: "Riverhead Books",
    rating: "4.1/5"
  },

  {
    title: "It Lasts Forever and Then It's Over",
    author: "Anne de Marcken",
    description: "A novel exploring mortality, memory, and the passage of time",
    coverUrl: "/images/books/it-lasts-forever.jpg",
    amazonUrl: "https://amzn.to/4gfVWXY",
    slug: "it-lasts-forever-and-then-its-over",
    detailedDescription: "Anne de Marcken's haunting debut novel explores the liminal space between life and death through the eyes of a recently deceased narrator. With lyrical prose and profound insight, the book examines what it means to exist in the aftermath of living, offering a meditation on memory, love, and the traces we leave behind. The novel follows the narrator as they navigate their new existence, observing the world they've left behind while grappling with the weight of unfinished business and unspoken words.",
    genre: "Literary Fiction",
    publishedYear: "2024",
    pages: "224",
    publisher: "Graywolf Press",
    rating: "4.2/5"
  },

  {
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    description: "A novel about friendship, art, and the creative process in the world of video game design",
    coverUrl: "/images/books/tomorrow-and-tomorrow.jpg",
    amazonUrl: "https://amzn.to/4gfVWXY",
    slug: "tomorrow-and-tomorrow-and-tomorrow",
    detailedDescription: "This is the story of Sam and Sadie, two friends who reunite after years apart to create a groundbreaking video game. Set against the backdrop of the gaming industry from the 1990s to the present, the novel explores themes of creativity, identity, disability, failure, the redemptive possibilities in play, and above all, the profound human need for connection. Zevin crafts a love letter to the creative process and examines the price of art, the nature of identity, and the possibility of reinvention.",
    genre: "Literary Fiction",
    publishedYear: "2022",
    pages: "416",
    publisher: "Knopf",
    rating: "4.3/5"
  },


  {
    title: "Amusing Ourselves to Death",
    author: "Neil Postman",
    description: "A critical analysis of media and public discourse",
    coverUrl: "/images/books/amusing-ourselves-to-death.jpg",
    amazonUrl: "https://amzn.to/4lMkbyS",
    slug: "amusing-ourselves-to-death"
  },
  {
    title: "Abundance: Progress Takes Imagination",
    author: "Ezra Klein",
    description: "A book about progress and imagination in society",
    coverUrl: "/images/books/abundance-progress.jpg",
    amazonUrl: "https://amzn.to/4m5EBTJ",
    slug: "abundance-progress-takes-imagination"
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    description: "A classic allegorical novel critiquing totalitarian systems through farm animals",
    coverUrl: "/images/books/animal-farm.jpg",
    amazonUrl: "https://amzn.to/3IiGC06",
    slug: "animal-farm-george-orwell"
  },
  {
    title: "Do Androids Dream Of Electric Sheep?",
    author: "Philip K. Dick",
    description: "A science fiction novel exploring artificial intelligence and humanity",
    coverUrl: "/images/books/do-androids-dream.jpg",
    amazonUrl: "https://amzn.to/46xjAMS",
    slug: "do-androids-dream-of-electric-sheep"
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Peter Norvig & Stuart Russell",
    description: "A comprehensive textbook on artificial intelligence covering modern approaches",
    coverUrl: "/images/books/ai-modern-approach.jpg",
    amazonUrl: "https://amzn.to/44EUsRO",
    slug: "artificial-intelligence-a-modern-approach"
  },
  {
    title: "The Business of Venture Capital",
    author: "Mahendra Ramsinghani",
    description: "A guide to venture capital strategies from industry experts",
    coverUrl: "/images/books/business-venture-capital.jpg",
    amazonUrl: "https://amzn.to/3TsNXwr",
    slug: "the-business-of-venture-capital"
  },
  {
    title: "Exhalation: Stories",
    author: "Ted Chiang",
    description: "A collection of short stories by acclaimed science fiction author Ted Chiang",
    coverUrl: "/images/books/exhalation-stories.jpg",
    amazonUrl: "https://amzn.to/46wer7N",
    slug: "exhalation-stories"
  },
  {
    title: "The Tainted Cup",
    author: "Robert Jackson Bennett",
    description: "A gaslamp fantasy murder mystery featuring a brilliant inspector and her magically altered aide",
    coverUrl: "/images/books/the-tainted-cup.jpg",
    amazonUrl: "https://www.amazon.com/Tainted-Cup-Robert-Jackson-Bennett/dp/1984820702/",
    slug: "the-tainted-cup-robert-jackson-bennett",
    status: "reading",
    detailedDescription:
      "In the lowland empire of Aördin, death by leviathan venom threatens the Imperial Court. When a high-ranking officer is found murdered, investigator Ana Dolabra and her magically modified aide Din must unravel a conspiracy that winds through botanical wizardry, courtly intrigue, and the looming menace of the leviathans. Bennett crafts a propulsive blend of mystery and fantasy where deduction, political maneuvering, and unforgettable characters drive the story forward.",
    genre: "Gaslamp Fantasy/Mystery",
    publishedYear: "2024",
    pages: "432",
    publisher: "Del Rey",
    rating: "4.2/5"
  },

  {
    title: "Behave: The Biology of Humans at Our Best and Worst",
    author: "Robert M. Sapolsky",
    description: "A landmark synthesis exploring how biological processes—from neural circuits to hormones to evolutionary history—influence human behavior.",
    coverUrl: "/images/books/behave-sapolsky.jpg",
    amazonUrl: "https://www.amazon.com/dp/1594205078",
    slug: "behave-sapolsky",
    status: "pending",
    detailedDescription: "In this sweeping work, Sapolsky investigates human behaviours from mere seconds before an action to millennia of evolution, unpacking why we do what we do — for good and for ill.",
    genre: "Science / Behavioral Neuroscience",
    publishedYear: "2017",
    pages: "800",
    publisher: "Penguin Press",
    rating: "4.4/5"
  },

  {
    title: "We the Corporations: How American Businesses Won Their Civil Rights",
    author: "Adam Winkler",
    description: "A history of how U.S. corporations achieved many of the constitutional rights once reserved for individuals.",
    coverUrl: "/images/books/we-the-corporations-winkler.jpg",
    amazonUrl: "https://www.amazon.com/dp/0871407124",
    slug: "we-the-corporations-winkler",
    status: "pending",
    detailedDescription: "Winkler traces a ~200-year corporate rights movement in the U.S., culminating in landmark cases like Citizens United v. FEC, and reveals how business entities became near-equal 'persons' under the law.",
    genre: "History / Constitutional Law",
    publishedYear: "2018",
    pages: "496",
    publisher: "W. W. Norton / Liveright",
    rating: "4.3/5"
  },

  {
    title: "HBR Guide to Finance Basics for Managers",
    author: "Harvard Business Review",
    description: "A concise primer for managers on the fundamentals of finance—including reading statements, interpreting data and making informed decisions.",
    coverUrl: "/images/books/hbr-guide-finance-basics-managers.jpg",
    amazonUrl: "https://www.amazon.com/dp/1422187306",
    slug: "hbr-guide-finance-basics-for-managers",
    status: "pending",
    detailedDescription: "Designed for busy non-financial managers, this guide covers key concepts such as income statements, balance sheets, cash flows and shows how to apply them in decision-making.",
    genre: "Business / Finance",
    publishedYear: "2011",
    pages: "272",
    publisher: "Harvard Business Review Press",
    rating: "4.2/5"
  },

  {
    title: "The Federalist Papers",
    author: "Alexander Hamilton, James Madison, John Jay",
    description: "A foundational collection of essays advocating for the ratification of the United States Constitution and exploring the nature of republican government.",
    coverUrl: "/images/books/the-federalist-papers-hamilton-madison-jay.jpg",
    amazonUrl: "https://www.amazon.com/dp/0553213407",
    slug: "the-federalist-papers",
    status: "pending",
    detailedDescription: "Written under the pseudonym \"Publius,\" this series of 85 essays addresses the problems of the Articles of Confederation and argues in favour of adopting the U.S. Constitution.",
    genre: "Political Science / History",
    publishedYear: "1788",
    pages: "approx. 500 (varies by edition)",
    publisher: "J. & A. McLean (original 1788) / multiple later editions",
    rating: ""
  },

  {
    title: "The Economic Structure of Corporate Law",
    author: "Frank H. Easterbrook & Daniel R. Fischel",
    description: "A canonical text connecting corporate law rules to economic logic, arguing corporations mirror bargained contracts among insiders.",
    coverUrl: "/images/books/economic-structure-corporate-law-easterbrook-fischel.jpg",
    amazonUrl: "https://www.amazon.com/dp/0674235398",
    slug: "economic-structure-corporate-law",
    status: "pending",
    detailedDescription: "Easterbrook and Fischel argue the rules and practices of corporate law mimic the contractual provisions that parties would reach if they could bargain about every contingency.",
    genre: "Law / Economics",
    publishedYear: "1991",
    pages: "370",
    publisher: "Harvard University Press",
    rating: ""
  },

  {
    title: "Dancing in the Streets: A History of Collective Joy",
    author: "Barbara Ehrenreich",
    description: "An exploration of the human impulse for communal celebration, from ancient rituals to modern festivals.",
    coverUrl: "/images/books/dancing-in-the-streets-ehrenreich.jpg",
    amazonUrl: "https://www.amazon.com/dp/0805057242",
    slug: "dancing-in-the-streets-ehrenreich",
    status: "pending",
    detailedDescription: "Ehrenreich traces the history of ecstatic group events, masking, carnival, and communal revelry, arguing that collective joy has been repeatedly suppressed by social hierarchies.",
    genre: "Cultural History / Anthropology",
    publishedYear: "2006",
    pages: "336",
    publisher: "Metropolitan Books / Henry Holt & Company",
    rating: ""
  },

  {
    title: "The Tangled Tree: A Radical New History of Life",
    author: "David Quammen",
    description: "A narrative of how modern molecular biology—including horizontal gene transfer and symbiosis—reshapes our understanding of evolution and life's history.",
    coverUrl: "/images/books/the-tangled-tree-quammen.jpg",
    amazonUrl: "https://www.amazon.com/dp/1476776628",
    slug: "the-tangled-tree-quammen",
    status: "pending",
    detailedDescription: "Quammen presents recent discoveries in molecular biology and their implications for the tree of life, weaving scientific explanation with the stories of scientists behind them.",
    genre: "Science / Natural History",
    publishedYear: "2018",
    pages: "461",
    publisher: "Simon & Schuster / William Collins (UK)",
    rating: ""
  },

  {
    title: "The End of History and the Last Man",
    author: "Francis Fukuyama",
    description: "A controversial political philosophy argument that liberal democracy may be the endpoint of mankind's ideological evolution.",
    coverUrl: "/images/books/the-end-of-history-fukuyama.jpg",
    amazonUrl: "https://www.amazon.com/dp/0743284550",
    slug: "the-end-of-history-and-the-last-man",
    status: "pending",
    detailedDescription: "Arguing that the collapse of communism marked the 'end of history' in ideological terms, Fukuyama traces how Western liberal democracy became the dominant form and explores the implications for the 'last man'.",
    genre: "Political Science / Philosophy",
    publishedYear: "1992",
    pages: "418",
    publisher: "Free Press",
    rating: ""
  },

  {
    title: "Making Sense: Conversations on Consciousness, Morality, and the Future of Humanity",
    author: "Sam Harris",
    description: "A curated collection of thought-provoking conversations drawn from the author's podcast, covering consciousness, morality, politics and society.",
    coverUrl: "/images/books/making-sense-harris.jpg",
    amazonUrl: "https://www.amazon.com/dp/0062857789",
    slug: "making-sense-harris",
    status: "pending",
    detailedDescription: "Includes interviews with figures such as Daniel Kahneman, Nick Bostrom, Glenn Loury, and others, on topics ranging from free will to responsible living in the modern world.",
    genre: "Philosophy / Contemporary Issues",
    publishedYear: "2020",
    pages: "444",
    publisher: "Ecco (HarperCollins imprint)",
    rating: ""
  },

  {
    title: "Einstein: His Life and Universe",
    author: "Walter Isaacson",
    description: "A comprehensive biography of Albert Einstein that melds his scientific achievements with his personal life and politics.",
    coverUrl: "/images/books/einstein-isaacson.jpg",
    amazonUrl: "https://www.amazon.com/dp/0743264746",
    slug: "einstein-his-life-and-universe",
    status: "pending",
    detailedDescription: "Isaacson draws on newly available papers and sources to portray Einstein's scientific imagination, personal struggles, and broader legacy.",
    genre: "Biography / Science History",
    publishedYear: "2007",
    pages: "675",
    publisher: "Simon & Schuster",
    rating: ""
  }
];
