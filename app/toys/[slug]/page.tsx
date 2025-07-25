import { notFound } from 'next/navigation';
import TerminalLayout from '../../components/TerminalLayout';
import { toys } from '../../data/toys';



export default function ToyPage({ params }: { params: { slug: string } }) {
  const toy = toys.find(t => t.slug === params.slug);

  if (!toy) {
    notFound();
  }

  return (
    <TerminalLayout backLink={{ href: '/#toys', text: 'Back to Recent Toys' }}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <img 
            src={toy.imageUrl} 
            alt={`${toy.title} product image`}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {toy.title}
            </h1>
            {toy.price && (
              <p className="text-2xl font-semibold text-green-400 mb-4">
                {toy.price}
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {toy.detailedDescription || toy.description}
            </p>
            {toy.comment && (
              <blockquote className="border-l-4 border-green-400 pl-4 italic text-gray-400">
                "{toy.comment}"
              </blockquote>
            )}
          </div>

          {toy.features && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Key Features</h2>
              <ul className="space-y-2">
                {toy.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">▸</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {toy.specifications && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Specifications</h2>
              <div className="space-y-2">
                {Object.entries(toy.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium text-gray-200 w-32 flex-shrink-0">{key}:</span>
                    <span className="text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <div className="pt-4">
            <a 
              href={toy.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
