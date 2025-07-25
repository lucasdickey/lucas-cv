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
    title: "The Wager",
    author: "David Grann",
    description: "A tale of shipwreck, mutiny, and murder set in the 18th century",
    coverUrl: "/images/books/the-wager.jpg",
    amazonUrl: "https://amzn.to/3ZqQxQV",
    slug: "the-wager-david-grann",
    detailedDescription: "From the #1 New York Times bestselling author of Killers of the Flower Moon comes a masterful true story of shipwreck, survival, and savagery. In 1741, on a secret mission during an imperial war, a British warship was wrecked on a desolate island off the coast of Patagonia. The survivors, marooned for months and facing starvation, split into warring factions—some choosing to build the flimsy craft and sail to safety, others refusing to venture into the deadly seas. The resulting tale is a riveting story of human nature under extreme duress.",
    genre: "History/Adventure",
    publishedYear: "2023",
    pages: "352",
    publisher: "Doubleday",
    rating: "4.4/5"
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
    title: "Demon Copperhead",
    author: "Barbara Kingsolver",
    description: "A Pulitzer Prize-winning novel about a boy's journey through foster care in Appalachia",
    coverUrl: "/images/books/demon-copperhead.jpg",
    amazonUrl: "https://amzn.to/3ZqQxQV",
    slug: "demon-copperhead-barbara-kingsolver",
    detailedDescription: "Winner of the 2023 Pulitzer Prize for Fiction, Demon Copperhead is a contemporary retelling of Charles Dickens' David Copperfield set in the mountains of southern Appalachia. The novel follows Damon Fields, known as Demon, as he navigates a childhood marked by poverty, addiction, and the foster care system. Kingsolver's masterful storytelling brings to life the opioid crisis and its devastating impact on communities, while celebrating the resilience of the human spirit and the power of art to transform lives.",
    genre: "Literary Fiction",
    publishedYear: "2022",
    pages: "560",
    publisher: "Harper",
    rating: "4.5/5"
  },
  {
    title: "The Seven Moons of Maali Almeida",
    author: "Shehan Karunatilaka",
    description: "A darkly comic fantasy about a photographer navigating the afterlife during Sri Lanka's civil war",
    coverUrl: "/images/books/seven-moons-maali.jpg",
    amazonUrl: "https://amzn.to/4gfVWXY",
    slug: "seven-moons-of-maali-almeida",
    detailedDescription: "Winner of the 2022 Booker Prize, this darkly comic novel follows Maali Almeida, a war photographer who wakes up dead in what seems like a celestial visa office. Given seven moons to contact someone from his past life to expose hidden photographs that could change the course of Sri Lanka's civil war, Maali must navigate the afterlife's bureaucracy while coming to terms with his own mortality. Karunatilaka blends magical realism with biting social commentary to create a unique and powerful narrative about war, love, and redemption.",
    genre: "Magical Realism/Literary Fiction",
    publishedYear: "2022",
    pages: "432",
    publisher: "Sort Of Books",
    rating: "4.1/5"
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
