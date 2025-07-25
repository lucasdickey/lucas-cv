import { notFound } from 'next/navigation';
import TerminalLayout from '../../components/TerminalLayout';
import { books } from '../../data/books';

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = books.find(b => b.slug === params.slug);

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
