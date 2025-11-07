import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

interface LennyBook {
  title: string;
  author: string;
  coverUrl: string;
  amazonUrl: string;
  slug: string;
  detailedDescription?: string;
  keyTakeaways?: string[];
  genre?: string;
  publishedYear?: string;
  pages?: string;
  publisher?: string;
  rating?: string;
  lennyQuote?: string;
}

const lennyRecommendations: LennyBook[] = [
  {
    title: "The 15 Commitments of Conscious Leadership",
    author: "Jim Dethmer, Diana Chapman, Kaley Klemp",
    coverUrl: "/images/books/lennys-list/15-commitments-of-conscious-leadership.jpg",
    amazonUrl: "https://amzn.to/46S8Oku",
    slug: "15-commitments-conscious-leadership",
    detailedDescription: "A groundbreaking guide to conscious leadership that challenges traditional management paradigms. The authors present 15 commitments that help leaders shift from reactive, fear-based leadership to conscious, creative leadership. This book is essential for anyone looking to lead with authenticity, create psychological safety, and build high-performing teams.",
    keyTakeaways: [
      "Shift from being right to being curious",
      "Take radical responsibility for your circumstances",
      "Learn to feel your feelings rather than think them",
      "Commit to candor and eliminating gossip",
      "Practice appreciation and wonder"
    ],
    genre: "Leadership/Business",
    publishedYear: "2014",
    pages: "320",
    publisher: "Conscious Leadership Group",
    rating: "4.6/5",
    lennyQuote: "This book fundamentally changed how I think about leadership. The 15 commitments provide a practical framework for becoming a more conscious, effective leader."
  },
  {
    title: "Build: An Unorthodox Guide to Making Things Worth Making",
    author: "Tony Fadell",
    coverUrl: "/images/books/lennys-list/build.jpg",
    amazonUrl: "https://amzn.to/40vflxP",
    slug: "build-tony-fadell",
    detailedDescription: "From the creator of the iPod and co-creator of the iPhone, Tony Fadell shares his decades of experience building revolutionary products at Apple and beyond. This book offers practical advice on everything from individual career development to building and leading teams, creating products that matter, and starting companies that can change the world.",
    keyTakeaways: [
      "Focus on solving real problems, not just building cool technology",
      "The importance of storytelling in product development",
      "How to give and receive effective feedback",
      "Building products is about building teams",
      "The art of saying no to focus on what matters"
    ],
    genre: "Product Management/Business",
    publishedYear: "2022",
    pages: "416",
    publisher: "Harper Business",
    rating: "4.4/5",
    lennyQuote: "Tony's insights from building some of the most iconic products of our time are invaluable for anyone in product or technology."
  },
  {
    title: "Crossing the Chasm",
    author: "Geoffrey A. Moore",
    coverUrl: "/images/books/lennys-list/crossing-the-chasm.jpg",
    amazonUrl: "https://amzn.to/4m5mI7c",
    slug: "crossing-the-chasm",
    detailedDescription: "The definitive guide to marketing and selling disruptive products to mainstream customers. Moore's framework explains why many promising startups fail to achieve widespread adoption and provides a roadmap for successfully transitioning from early adopters to the mainstream market. Essential reading for anyone involved in bringing innovative products to market.",
    keyTakeaways: [
      "Understanding the technology adoption lifecycle",
      "The critical importance of the 'chasm' between early adopters and mainstream market",
      "How to identify and target your beachhead market",
      "Building a whole product solution",
      "The bowling pin strategy for market expansion"
    ],
    genre: "Marketing/Business Strategy",
    publishedYear: "1991",
    pages: "272",
    publisher: "Harper Business",
    rating: "4.3/5",
    lennyQuote: "A classic that every product manager and entrepreneur should read. The chasm concept is fundamental to understanding product-market fit."
  },
  {
    title: "Good Strategy Bad Strategy",
    author: "Richard Rumelt",
    coverUrl: "/images/books/lennys-list/good-strategy-bad-strategy.jpg",
    amazonUrl: "https://amzn.to/44VM5S6",
    slug: "good-strategy-bad-strategy",
    detailedDescription: "Richard Rumelt cuts through the fluff to explain what strategy really is and isn't. He shows how to recognize good strategy, which is rare, and bad strategy, which is unfortunately common. The book provides clear frameworks for developing coherent strategies that create competitive advantage and drive results.",
    keyTakeaways: [
      "Good strategy has a kernel: diagnosis, guiding policy, and coherent action",
      "Bad strategy is characterized by fluff, failure to face the challenge, and mistaking goals for strategy",
      "The importance of leverage in strategic thinking",
      "How to identify and exploit sources of power",
      "Strategy is about making choices and trade-offs"
    ],
    genre: "Strategy/Business",
    publishedYear: "2011",
    pages: "336",
    publisher: "Crown Business",
    rating: "4.2/5",
    lennyQuote: "This book helped me understand the difference between real strategy and strategic planning. Essential for anyone making strategic decisions."
  },
  {
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    coverUrl: "/images/books/lennys-list/hard-thing-about-hard-things.jpg",
    amazonUrl: "https://amzn.to/44ZtW5O",
    slug: "hard-thing-about-hard-things",
    detailedDescription: "Ben Horowitz offers essential advice on building and running a startup—practical wisdom for managing the toughest problems business school doesn't cover. Drawing on his experience as a co-founder of Andreessen Horowitz and his time as an executive at companies like Netscape, Horowitz provides honest, practical guidance for navigating the challenges of leadership.",
    keyTakeaways: [
      "There are no easy answers in business, only hard choices",
      "The importance of making decisions with incomplete information",
      "How to manage through crisis and uncertainty",
      "Building company culture during difficult times",
      "The difference between peacetime and wartime CEOs"
    ],
    genre: "Entrepreneurship/Leadership",
    publishedYear: "2014",
    pages: "304",
    publisher: "Harper Business",
    rating: "4.5/5",
    lennyQuote: "Raw, honest advice about the realities of building a company. Horowitz doesn't sugarcoat the challenges of leadership."
  },
  {
    title: "High Output Management",
    author: "Andrew S. Grove",
    coverUrl: "/images/books/lennys-list/high-output-management.jpg",
    amazonUrl: "https://amzn.to/44FyvU2",
    slug: "high-output-management",
    detailedDescription: "Former Intel CEO Andy Grove's classic guide to management that has influenced generations of leaders. Grove applies manufacturing principles to knowledge work, showing how managers can increase their team's output through better processes, measurement, and leadership. This book remains one of the most practical management guides ever written.",
    keyTakeaways: [
      "A manager's output is the output of their team plus neighboring teams",
      "The importance of one-on-ones and performance reviews",
      "How to run effective meetings",
      "The concept of management leverage",
      "Balancing individual contributor work with management responsibilities"
    ],
    genre: "Management/Leadership",
    publishedYear: "1983",
    pages: "272",
    publisher: "Vintage",
    rating: "4.4/5",
    lennyQuote: "The best management book ever written. Grove's frameworks for thinking about management are timeless and practical."
  },
  {
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    coverUrl: "/images/books/lennys-list/how-to-win-friends.jpg",
    amazonUrl: "https://amzn.to/40XQJ0I",
    slug: "how-to-win-friends-influence-people",
    detailedDescription: "Dale Carnegie's timeless guide to human relations and communication. Despite being written in 1936, the principles in this book remain incredibly relevant for anyone looking to improve their interpersonal skills, build better relationships, and become more influential in their personal and professional life.",
    keyTakeaways: [
      "Show genuine interest in other people",
      "Remember that a person's name is the sweetest sound to them",
      "Be a good listener and encourage others to talk about themselves",
      "Make the other person feel important",
      "Avoid criticism, condemnation, and complaints"
    ],
    genre: "Self-Help/Communication",
    publishedYear: "1936",
    pages: "288",
    publisher: "Simon & Schuster",
    rating: "4.3/5",
    lennyQuote: "A classic for a reason. These principles for human interaction are as relevant today as they were 80+ years ago."
  },
  {
    title: "Inspired: How to Create Tech Products Customers Love",
    author: "Marty Cagan",
    coverUrl: "/images/books/lennys-list/inspired.jpg",
    amazonUrl: "https://amzn.to/44JROvq",
    slug: "inspired-marty-cagan",
    detailedDescription: "Marty Cagan shares insights from his decades of experience in product management at companies like eBay, AOL, and Netscape. This book provides a comprehensive guide to modern product management, covering everything from product discovery to delivery, and how to build products that customers truly love.",
    keyTakeaways: [
      "The importance of continuous product discovery",
      "How to validate ideas before building",
      "The role of product managers vs. project managers",
      "Building empowered product teams",
      "The four big risks: value, usability, feasibility, and viability"
    ],
    genre: "Product Management",
    publishedYear: "2017",
    pages: "368",
    publisher: "Wiley",
    rating: "4.5/5",
    lennyQuote: "The definitive guide to modern product management. Every PM should read this book and keep it as a reference."
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    coverUrl: "/images/books/lennys-list/lean-startup.jpg",
    amazonUrl: "https://amzn.to/4f4DKjR",
    slug: "lean-startup-eric-ries",
    detailedDescription: "Eric Ries presents a scientific approach to creating and managing successful startups in an age when companies need to innovate more than ever. The Lean Startup methodology teaches how to drive a startup, when to turn, and when to persevere—and grow a business with maximum acceleration.",
    keyTakeaways: [
      "Build-Measure-Learn feedback loop",
      "The importance of validated learning",
      "Minimum Viable Product (MVP) concept",
      "Innovation accounting and actionable metrics",
      "The pivot vs. persevere decision"
    ],
    genre: "Entrepreneurship/Business",
    publishedYear: "2011",
    pages: "336",
    publisher: "Crown Business",
    rating: "4.2/5",
    lennyQuote: "Revolutionary thinking about how to build products and companies. The lean methodology has become standard practice in tech."
  },
  {
    title: "Make Time: How to Focus on What Matters Every Day",
    author: "Jake Knapp, John Zeratsky",
    coverUrl: "/images/books/lennys-list/make-time.jpg",
    amazonUrl: "https://amzn.to/3TTqRzd",
    slug: "make-time-focus-what-matters",
    detailedDescription: "From the creators of Google Ventures' design sprint, Make Time offers a framework for choosing what to focus on, building energy, and breaking the default cycle of constant busyness. The book provides practical tactics for creating time for the things that matter most in your life and work.",
    keyTakeaways: [
      "Choose a daily highlight to focus your time and energy",
      "Redesign your technology to serve you, not distract you",
      "Build energy through simple changes to how you eat, move, and sleep",
      "The importance of reflection and iteration",
      "Small changes can create big improvements in focus and satisfaction"
    ],
    genre: "Productivity/Self-Help",
    publishedYear: "2018",
    pages: "304",
    publisher: "Currency",
    rating: "4.3/5",
    lennyQuote: "Practical advice for staying focused in our distraction-filled world. The highlight technique alone is worth the read."
  },
  {
    title: "Never Split the Difference",
    author: "Chris Voss",
    coverUrl: "/images/books/lennys-list/never-split-the-difference.jpg",
    amazonUrl: "https://amzn.to/3Un1LJ5",
    slug: "never-split-the-difference",
    detailedDescription: "Former FBI hostage negotiator Chris Voss shares the field-tested strategies he used in high-stakes international negotiations. This book teaches tactical empathy and other negotiation techniques that can be applied to business and personal relationships.",
    keyTakeaways: [
      "Use tactical empathy to understand and influence others",
      "The power of mirroring and labeling emotions",
      "How to get to 'that's right' instead of 'you're right'",
      "The importance of calibrated questions",
      "Creating the illusion of control for the other party"
    ],
    genre: "Negotiation/Business",
    publishedYear: "2016",
    pages: "288",
    publisher: "Harper Business",
    rating: "4.4/5",
    lennyQuote: "Game-changing negotiation tactics that work in boardrooms and everyday conversations. Voss's techniques are practical and immediately applicable."
  },
  {
    title: "Obviously Awesome",
    author: "April Dunford",
    coverUrl: "/images/books/lennys-list/obviously-awesome.jpg",
    amazonUrl: "https://amzn.to/3GQcjO0",
    slug: "obviously-awesome",
    detailedDescription: "April Dunford demystifies positioning and shows how to do it right. This book provides a clear framework for positioning products so customers immediately understand their value and why they're different from alternatives.",
    keyTakeaways: [
      "The 5-component positioning framework",
      "How to identify your best-fit customers",
      "Understanding competitive alternatives from the customer's perspective",
      "Connecting features to value in a meaningful way",
      "Testing and refining your positioning"
    ],
    genre: "Marketing/Product Management",
    publishedYear: "2019",
    pages: "176",
    publisher: "Ambient Press",
    rating: "4.3/5",
    lennyQuote: "The definitive guide to product positioning. April's framework is simple, practical, and incredibly effective."
  },
  {
    title: "On Writing: A Memoir of the Craft",
    author: "Stephen King",
    coverUrl: "/images/books/lennys-list/on-writing.jpg",
    amazonUrl: "https://amzn.to/40xEl7A",
    slug: "on-writing-stephen-king",
    detailedDescription: "Stephen King's memoir and guide to writing craft. Part memoir, part masterclass, this book offers insights into King's writing process and practical advice for anyone looking to improve their writing skills.",
    keyTakeaways: [
      "The importance of reading widely to become a better writer",
      "Writing is both craft and art",
      "The value of consistent daily writing practice",
      "How to edit and revise your work effectively",
      "Finding your authentic voice as a writer"
    ],
    genre: "Writing/Memoir",
    publishedYear: "2000",
    pages: "320",
    publisher: "Scribner",
    rating: "4.3/5",
    lennyQuote: "Essential reading for anyone who writes, whether it's emails, product specs, or blog posts. King's advice on clarity and authenticity applies beyond fiction."
  },
  {
    title: "Poor Charlie's Almanack",
    author: "Charlie Munger & Peter Kaufman",
    coverUrl: "/images/books/lennys-list/poor-charlie.jpg",
    amazonUrl: "https://amzn.to/4fkXe3T",
    slug: "poor-charlies-almanack",
    detailedDescription: "A collection of Charlie Munger's speeches and writings on investment philosophy, decision-making, and life wisdom. Munger's multidisciplinary approach to thinking and mental models provides valuable insights for business and investing.",
    keyTakeaways: [
      "The importance of mental models from multiple disciplines",
      "Understanding human psychology and cognitive biases",
      "The power of compound interest and patience in investing",
      "Learning from mistakes and continuous self-improvement",
      "The value of reading and lifelong learning"
    ],
    genre: "Investing/Philosophy",
    publishedYear: "2005",
    pages: "548",
    publisher: "Donning Company Publishers",
    rating: "4.6/5",
    lennyQuote: "Munger's wisdom extends far beyond investing. His mental models and thinking frameworks are invaluable for any decision-maker."
  },
  {
    title: "Radical Candor",
    author: "Kim Scott",
    coverUrl: "/images/books/lennys-list/radical-candor.jpg",
    amazonUrl: "https://amzn.to/3Iyi9UK",
    slug: "radical-candor",
    detailedDescription: "Kim Scott's guide to being a better boss through radical candor - caring personally while challenging directly. The book provides a framework for giving feedback that helps people grow while maintaining strong relationships.",
    keyTakeaways: [
      "The radical candor framework: care personally and challenge directly",
      "How to avoid ruinous empathy and obnoxious aggression",
      "The importance of regular one-on-ones and feedback",
      "Building a culture of guidance and growth",
      "Soliciting criticism and creating psychological safety"
    ],
    genre: "Management/Leadership",
    publishedYear: "2017",
    pages: "272",
    publisher: "St. Martin's Press",
    rating: "4.2/5",
    lennyQuote: "A practical framework for giving feedback that actually helps people grow. Scott's approach balances caring with directness perfectly."
  },
  {
    title: "Range: Why Generalists Triumph in a Specialized World",
    author: "David Epstein",
    coverUrl: "/images/books/lennys-list/range.jpg",
    amazonUrl: "https://amzn.to/40u5sAk",
    slug: "range-generalists-triumph",
    detailedDescription: "David Epstein challenges the conventional wisdom about specialization, arguing that generalists often outperform specialists in complex, unpredictable fields. The book explores how broad experience and diverse knowledge lead to better problem-solving and innovation.",
    keyTakeaways: [
      "The benefits of sampling different fields before specializing",
      "Why late specialization can lead to better outcomes",
      "The importance of analogical thinking and pattern recognition",
      "How diverse experiences improve problem-solving",
      "The value of 'outside view' thinking"
    ],
    genre: "Psychology/Business",
    publishedYear: "2019",
    pages: "352",
    publisher: "Riverhead Books",
    rating: "4.3/5",
    lennyQuote: "A compelling case for the value of being a generalist. Epstein's research shows why breadth of knowledge matters more than ever."
  },
  {
    title: "Scaling People",
    author: "Claire Hughes Johnson",
    coverUrl: "/images/books/lennys-list/scaling-people.jpg",
    amazonUrl: "https://amzn.to/3TRLITG",
    slug: "scaling-people",
    detailedDescription: "Former Google and Stripe executive Claire Hughes Johnson shares her playbook for scaling teams and building high-performing organizations. The book covers hiring, management systems, and creating operational excellence.",
    keyTakeaways: [
      "Building systems and processes that scale with growth",
      "The importance of clarity in roles and expectations",
      "How to hire and onboard effectively",
      "Creating accountability and measurement frameworks",
      "Balancing individual and team performance"
    ],
    genre: "Management/Operations",
    publishedYear: "2023",
    pages: "416",
    publisher: "Ballantine Books",
    rating: "4.4/5",
    lennyQuote: "The most practical guide to scaling teams I've read. Claire's frameworks from Google and Stripe are immediately applicable."
  },
  {
    title: "The Goal: A Process of Ongoing Improvement",
    author: "Eliyahu Goldratt",
    coverUrl: "/images/books/lennys-list/the-goal.jpg",
    amazonUrl: "https://amzn.to/44ZrITY",
    slug: "the-goal-ongoing-improvement",
    detailedDescription: "Written as a novel, this book introduces the Theory of Constraints and systems thinking. Goldratt shows how to identify and eliminate bottlenecks in any process, making it essential reading for operations and continuous improvement.",
    keyTakeaways: [
      "The Theory of Constraints and bottleneck identification",
      "The importance of system-wide optimization vs. local optimization",
      "How to measure what really matters for throughput",
      "The five focusing steps for continuous improvement",
      "Understanding the relationship between throughput, inventory, and operational expense"
    ],
    genre: "Operations/Business",
    publishedYear: "1984",
    pages: "384",
    publisher: "North River Press",
    rating: "4.1/5",
    lennyQuote: "Systems thinking applied to business operations. The constraint theory is fundamental to understanding how to improve any process."
  },
  {
    title: "Working Backwards",
    author: "Bill Carr & Colin Bryar",
    coverUrl: "/images/books/lennys-list/working-backwards.jpg",
    amazonUrl: "https://amzn.to/3UorvEZ",
    slug: "working-backwards",
    detailedDescription: "Two former Amazon executives reveal the principles and practices that drove Amazon's success. The book explains Amazon's unique approach to innovation, customer obsession, and long-term thinking.",
    keyTakeaways: [
      "The Working Backwards process for product development",
      "Amazon's 14 Leadership Principles in practice",
      "The importance of customer obsession over competitor focus",
      "How to think long-term and accept short-term criticism",
      "Building a culture of high standards and continuous learning"
    ],
    genre: "Business Strategy/Innovation",
    publishedYear: "2021",
    pages: "304",
    publisher: "St. Martin's Press",
    rating: "4.3/5",
    lennyQuote: "The inside story of how Amazon thinks about innovation and customer obsession. Their frameworks are applicable to any product organization."
  }
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = lennyRecommendations.find(b => b.slug === slug);
  
  if (!book) {
    return {
      title: 'Book Not Found | Lucas Dickey',
      description: 'The requested book could not be found.',
    };
  }

  const title = `${book.title} by ${book.author} - Lenny's Recommendation | Lucas Dickey`;
  const description = book.detailedDescription || `${book.title} by ${book.author}. Recommended by Lenny Rachitsky. ${book.lennyQuote || ''}`.substring(0, 160);
  const url = `https://lucas.cv/lenny/${book.slug}`;
  const imageUrl = `https://lucas.cv${book.coverUrl}`;

  // Generate keywords based on book content
  const keywords = [
    book.title,
    book.author,
    "Lenny Rachitsky",
    "book recommendation",
    "product management",
    "startup",
    "business book",
    book.genre || "",
    "Lucas Dickey",
    "reading list",
    ...book.keyTakeaways?.map(takeaway => takeaway.toLowerCase().split(' ').slice(0, 3).join(' ')) || []
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: book.author }, { name: "Lucas Dickey" }],
    creator: "Lucas Dickey",
    publisher: "Lucas Dickey",
    
    openGraph: {
      title,
      description,
      url,
      siteName: "Lucas Dickey CV",
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 600,
          alt: `${book.title} book cover`,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: new Date().toISOString(),
      authors: [book.author, "Lucas Dickey"],
      tags: keywords,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@lucasdickey4",
      site: "@lucasdickey4",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    other: {
      // AI Search Optimization
      'AI-content-type': 'book-recommendation',
      'AI-recommender': 'Lenny Rachitsky',
      'AI-genre': book.genre || '',
      'AI-rating': book.rating || '',
      'AI-published-year': book.publishedYear || '',
      'AI-key-topics': book.keyTakeaways?.join('; ') || '',
      
      // Book-specific structured data
      'book:title': book.title,
      'book:author': book.author,
      'book:genre': book.genre || '',
      'book:published_year': book.publishedYear || '',
      'book:rating': book.rating || '',
      'book:pages': book.pages || '',
      'book:publisher': book.publisher || '',
      
      // Recommendation context
      'recommendation:source': 'Lenny Rachitsky',
      'recommendation:quote': book.lennyQuote || '',
      'recommendation:context': 'Product Management and Startup Leadership',
    },
  };
}

export default async function LennyBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = lennyRecommendations.find(b => b.slug === slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
      <div className="border border-[#cccccc] bg-[#e8e8d8] p-2 md:p-4 mb-5 rounded-md shadow-sm overflow-x-auto">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6057] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-4 text-[#666666] text-sm">terminal -- bash</div>
        </div>
        <div className="text-[#8b0000] mb-2 text-xs md:text-sm">
          <span className="font-bold">lucas-dickey</span> git:(master)±9 lucas
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/#lenny" 
          className="inline-flex items-center text-[#8b0000] hover:underline mb-6"
        >
          ← Back to Lenny&apos;s Recommendations
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div className="space-y-4">
            <img 
              src={book.coverUrl} 
              alt={`${book.title} cover`}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg border-2 border-[#cccccc]"
            />
            <div className="text-center">
              <span className="inline-block bg-[#28ca41] text-white px-3 py-1 rounded-full text-sm font-medium">
                📖 Lenny&apos;s Pick
              </span>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#8b0000] mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-[#333333] mb-4">
                by {book.author}
              </p>
              {book.rating && (
                <p className="text-lg font-semibold text-[#333333] mb-4">
                  ⭐ {book.rating}
                </p>
              )}
            </div>

            {book.lennyQuote && (
              <div className="bg-[#e8e8d8] border-l-4 border-[#8b0000] p-4 rounded">
                <h3 className="font-semibold text-[#8b0000] mb-2">Lenny&apos;s Take:</h3>
                <blockquote className="text-[#333333] italic">
                  &ldquo;{book.lennyQuote}&rdquo;
                </blockquote>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-[#8b0000] mb-2">About This Book</h2>
              <p className="text-[#333333] leading-relaxed">
                {book.detailedDescription}
              </p>
            </div>

            {book.keyTakeaways && (
              <div>
                <h2 className="text-xl font-semibold text-[#8b0000] mb-3">Key Takeaways</h2>
                <ul className="space-y-2">
                  {book.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#8b0000] mr-2">▸</span>
                      <span className="text-[#333333]">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Book Details */}
            <div>
              <h2 className="text-xl font-semibold text-[#8b0000] mb-3">Book Details</h2>
              <div className="space-y-2">
                {book.genre && (
                  <div className="flex">
                    <span className="font-medium text-[#333333] w-32 flex-shrink-0">Genre:</span>
                    <span className="text-[#666666]">{book.genre}</span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex">
                    <span className="font-medium text-[#333333] w-32 flex-shrink-0">Published:</span>
                    <span className="text-[#666666]">{book.publishedYear}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex">
                    <span className="font-medium text-[#333333] w-32 flex-shrink-0">Pages:</span>
                    <span className="text-[#666666]">{book.pages}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex">
                    <span className="font-medium text-[#333333] w-32 flex-shrink-0">Publisher:</span>
                    <span className="text-[#666666]">{book.publisher}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Button */}
            <div className="pt-4">
              <a 
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#28ca41] hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                View on Amazon
              </a>
              <p className="text-xs text-[#666666] mt-2">
                This is an affiliate link. I may earn a small commission if you purchase through this link, at no extra cost to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
