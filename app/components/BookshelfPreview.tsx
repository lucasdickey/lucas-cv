import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

/** A shared entrance to the static bookshelf app in either homepage theme. */
export default function BookshelfPreview() {
  return (
    <a
      href="/real-books"
      className="group mb-6 grid grid-cols-[96px_minmax(0,1fr)] overflow-hidden rounded-lg border border-[#446354] bg-[#142b22] text-[#f4f0df] shadow-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0052CC] sm:grid-cols-[180px_minmax(0,1fr)]"
    >
      <div className="relative min-h-48 overflow-hidden">
        <Image
          src="/real-books/assets/full.jpg"
          alt=""
          fill
          sizes="(max-width: 639px) 96px, 180px"
          className="object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2 p-4 sm:p-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#d8c58e] sm:text-xs">
          From the reading list to the real thing
        </span>
        <h3 className="text-xl font-semibold leading-tight sm:text-2xl">Step inside my bookshelf</h3>
        <p className="text-sm leading-relaxed text-[#d3ddd4]">
          Explore my actual shelves in 3D. Pick a spine, pull out a book, and take a closer look.
        </p>
        <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#f2d98d] group-hover:underline">
          Explore the bookshelf <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
