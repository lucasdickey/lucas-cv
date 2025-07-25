import Link from 'next/link';

interface TerminalLayoutProps {
  children: React.ReactNode;
  backLink?: {
    href: string;
    text: string;
  };
}

export default function TerminalLayout({ children, backLink }: TerminalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-[#2d2d2d] rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="flex items-center p-3 bg-[#3d3d3d] border-b border-gray-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff605c]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd44]"></div>
            <div className="w-3 h-3 rounded-full bg-[#00ca4e]"></div>
          </div>
        </div>
        <div className="p-4 sm:p-6 md:p-8 text-white font-mono">
          {backLink && (
            <Link href={backLink.href} scroll={false} className="text-blue-400 hover:underline mb-6 block">
              &larr; {backLink.text}
            </Link>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
