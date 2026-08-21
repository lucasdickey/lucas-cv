import type { Metadata } from 'next';

const title = 'AI & Civilization Reading Syllabus | Lucas Dickey';
const description =
  'A multidisciplinary reading syllabus built around one question: if intelligence becomes abundant, inexpensive, and increasingly non-human, which theories of civilization still hold?';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'AI syllabus',
    'AI and civilization',
    'reading list',
    'Lucas Dickey',
    'media theory',
    'political economy',
    'AI futures',
    'institutions',
    'technology and society',
  ].join(', '),

  openGraph: {
    title,
    description,
    url: 'https://lucas.cv/syllabus',
    siteName: 'Lucas Dickey CV',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI & Civilization Reading Syllabus',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
    creator: '@lucasdickey4',
    site: '@lucasdickey4',
  },

  // Agents are pointed at the Markdown mirror the same way /cv.md and
  // /blog.md are surfaced in llms.txt.
  alternates: {
    canonical: 'https://lucas.cv/syllabus',
    types: {
      'text/markdown': 'https://lucas.cv/syllabus.md',
    },
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function SyllabusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
