import { notFound } from 'next/navigation';
import TerminalLayout from '../../components/TerminalLayout';
import { books } from '../../data/books';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = books.find(b => b.slug === slug);
  
  if (!book) {
    return {
      title: 'Book Not Found | Lucas Dickey',
      description: 'The requested book could not be found.',
    };
  }

  const title = `${book.title} by ${book.author} - Recent Read | Lucas Dickey`;
  const description = (book.detailedDescription || book.description || `${book.title} by ${book.author}. Recently read by Lucas Dickey.`).substring(0, 160);
  const url = `https://lucas.cv/books/${book.slug}`;
  const imageUrl = `https://lucas.cv${book.coverUrl}`;

  // Generate keywords based on book content
  const keywords = [
    book.title,
    book.author,
    "recent read",
    "book review",
    "Lucas Dickey",
    "reading list",
    "book recommendation",
    book.genre || "",
    "product manager reading",
    "startup books",
    "business books",
    "technology books"
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
      'AI-content-type': 'recent-read',
      'AI-reader': 'Lucas Dickey',
      'AI-genre': book.genre || '',
      'AI-rating': book.rating || '',
      'AI-published-year': book.publishedYear || '',
      'AI-reader-context': 'Product Manager and Serial Founder',
      
      // Book-specific structured data
      'book:title': book.title,
      'book:author': book.author,
      'book:genre': book.genre || '',
      'book:published_year': book.publishedYear || '',
      'book:rating': book.rating || '',
      'book:pages': book.pages || '',
      'book:publisher': book.publisher || '',
      
      // Reading context
      'reading:status': 'completed',
      'reading:reader': 'Lucas Dickey',
      'reading:context': 'Product Management and Technology Leadership',
      'reading:category': 'recent-reads',
    },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = books.find(b => b.slug === slug);

  if (!book) {
    notFound();
  }

  return (
    <TerminalLayout backLink={{ href: '/#books', text: 'Back to Recent Books' }}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Book Cover */}
        <div className="space-y-4">
          <img 
            src={book.coverUrl} 
            alt={`${book.title} cover`}
            className="w-full max-w-sm mx-auto rounded-lg shadow-lg border-2 border-gray-700"
          />
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              by {book.author}
            </p>
            {book.rating && (
              <p className="text-lg font-semibold text-yellow-400 mb-4">
                ⭐ {book.rating}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">About This Book</h2>
            <p className="text-gray-300 leading-relaxed">
              {book.detailedDescription || book.description}
            </p>
          </div>

          {/* Book Details */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Book Details</h2>
            <div className="space-y-2">
              {book.genre && (
                <div className="flex">
                  <span className="font-medium text-gray-200 w-32 flex-shrink-0">Genre:</span>
                  <span className="text-gray-400">{book.genre}</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="flex">
                  <span className="font-medium text-gray-200 w-32 flex-shrink-0">Published:</span>
                  <span className="text-gray-400">{book.publishedYear}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex">
                  <span className="font-medium text-gray-200 w-32 flex-shrink-0">Pages:</span>
                  <span className="text-gray-400">{book.pages}</span>
                </div>
              )}
              {book.publisher && (
                <div className="flex">
                  <span className="font-medium text-gray-200 w-32 flex-shrink-0">Publisher:</span>
                  <span className="text-gray-400">{book.publisher}</span>
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
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              View on Amazon
            </a>
            <p className="text-xs text-gray-500 mt-2">
              This is an affiliate link. I may earn a small commission if you purchase through this link, at no extra cost to you.
            </p>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}
