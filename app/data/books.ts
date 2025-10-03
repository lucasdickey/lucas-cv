export interface Book {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  amazonUrl: string;
  slug: string;
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
  }
];
