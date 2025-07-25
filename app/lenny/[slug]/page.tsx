import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    amazonUrl: "https://amzn.to/3ZqQxQV",
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
    amazonUrl: "https://amzn.to/4gfVWXY",
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
    amazonUrl: "https://amzn.to/3ZqQxQV",
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
    amazonUrl: "https://amzn.to/4gfVWXY",
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
    amazonUrl: "https://amzn.to/3ZqQxQV",
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
    amazonUrl: "https://amzn.to/4gfVWXY",
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
    amazonUrl: "https://amzn.to/3ZqQxQV",
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
    amazonUrl: "https://amzn.to/4gfVWXY",
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
    amazonUrl: "https://amzn.to/3ZqQxQV",
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
    amazonUrl: "https://amzn.to/4gfVWXY",
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
  }
];

export default function LennyBookPage({ params }: { params: { slug: string } }) {
  const book = lennyRecommendations.find(b => b.slug === params.slug);

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
          ← Back to Lenny's Recommendations
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
                📖 Lenny's Pick
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
                <h3 className="font-semibold text-[#8b0000] mb-2">Lenny's Take:</h3>
                <blockquote className="text-[#333333] italic">
                  "{book.lennyQuote}"
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
