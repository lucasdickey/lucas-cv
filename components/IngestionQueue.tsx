import Link from "next/link";
import { Book } from "../app/data/books";

interface IngestionQueueProps {
  books: Book[];
}

export default function IngestionQueue({ books }: IngestionQueueProps) {
  const pendingBooks = books.filter((book) => book.status === "pending");

  if (pendingBooks.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border border-[#cccccc] rounded-lg p-4 bg-[#fafafa]">
      <h3 className="text-[#0000ff] font-bold text-base mb-4">
        Ingestion Queue
      </h3>
      <p className="text-[#666666] text-xs mb-4">
        Books lined up to read next
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pendingBooks.map((book, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-3 border border-[#e0e0d0] rounded bg-white hover:bg-[#f0f0e0] transition-colors"
          >
            {/* Small book cover image */}
            <div className="flex-shrink-0 mx-auto">
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                className="w-12 h-16 object-cover rounded shadow-sm"
              />
            </div>

            {/* Book details */}
            <div className="flex-1 min-w-0 text-center">
              <h4 className="font-bold text-[#333333] text-xs mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-[#666666] text-xs mb-2">by {book.author}</p>
              <p className="text-[#333333] text-xs mb-2 leading-relaxed line-clamp-2">
                {book.description}
              </p>
              <div className="flex flex-col items-center gap-2 mt-auto">
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0000ff] text-xs hover:underline"
                >
                  View on Amazon
                </a>
                <Link
                  href={`/books/${book.slug}`}
                  className="text-[#0000ff] hover:underline"
                  title="View details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
