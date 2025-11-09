'use client';

import { Book } from "../app/data/books";
import { ExpandableSection } from "@/app/components/ExpandableSection";

interface IngestionQueueProps {
  books: Book[];
}

export default function IngestionQueue({ books }: IngestionQueueProps) {
  const pendingBooks = books.filter((book) => book.status === "pending");
  const MAX_ROWS = 4;

  if (pendingBooks.length === 0) {
    return null;
  }

  const booksContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {pendingBooks.map((book, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 border border-[#e0e0d0] rounded bg-white hover:bg-[#f0f0e0] transition-colors"
          >
            {/* Small book cover image - 50% size of reading/read books */}
            <div className="flex-shrink-0">
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                className="w-10 h-16 object-cover rounded shadow-sm"
              />
            </div>

            {/* Book details - left-aligned, compact */}
            <div className="flex-1 min-w-0">
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0000ff] text-xs mb-1 line-clamp-2 text-left hover:underline block"
              >
                {book.title}
              </a>
              <p className="text-[#666666] text-xs text-left">by {book.author}</p>
            </div>
          </div>
        ))}
      </div>
  );

  return (
    <div className="mt-6 border border-[#cccccc] rounded-lg p-4 bg-[#fafafa]">
      <h3 className="text-[#0000ff] font-bold text-base mb-4">
        Ingestion Queue
      </h3>
      <p className="text-[#666666] text-xs mb-4">
        Books lined up to read next. And yes, it's a huge list, but it's not codified in stone
      </p>

      {pendingBooks.length > MAX_ROWS ? (
        <ExpandableSection maxRows={MAX_ROWS} rowHeight={100} expandLabel="Show all books">
          {booksContent}
        </ExpandableSection>
      ) : (
        booksContent
      )}
    </div>
  );
}
