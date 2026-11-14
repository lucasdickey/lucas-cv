import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '../../lib/site';

const title = "Agency, Curiosity, and the World You’re Walking Into";
const description =
  'A letter about agency, curiosity, and why this might be the best time ever to grow up.';

export const metadata: Metadata = {
  title: `${title} | Lucas Dickey`,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/essay/letter-to-my-daughter-nov-09-26`,
    siteName: 'Lucas Dickey CV',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ex Libris bookplate for Lucas Dickey above an engraving of six bookcases full of books',
      },
    ],
    locale: 'en_US',
    type: 'article',
    publishedTime: '2026-11-09',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
    creator: '@lucasdickey4',
    site: '@lucasdickey4',
  },
  alternates: {
    canonical: `${SITE_URL}/essay/letter-to-my-daughter-nov-09-26`,
  },
};

const salutation = 'To my big-brained beauty:';

const paragraphs = [
  'When we were looking at the IB program at [redacted high school] and at colleges, we kept circling back to one worry: what if AI takes all the jobs? It’s a fair question, and one I think about every day for work. So here’s what I’ve seen up close, at Stripe and with the people I’m about to work with at Anthropic.',
  'The people who do really well are not always the smartest people in the room. They’re the ones with agency. That’s a big word for a simple idea: you decide something is worth doing, and you go do it, without waiting for someone to hand it to you as an assignment. My team at Fernish used to call me the “King of Hacks,” and it wasn’t because I was the best engineer. It was because I’d find some way to get the thing done.',
  'That matters more now than ever. For most of history, the hard part was finding answers. Now AI can answer almost any question in seconds, so what matters is everything around the answer: knowing which questions are worth asking, what’s worth building, and then actually doing it. That’s true in science, writing, law, business, or a field that doesn’t have a name yet.',
  'You ask a lot of questions, and that’s a gift. Some are logistical: what time, which form, how many pages. Those get you through the day. Others go to the heart of the thing: Why does this matter? What’s actually true here? Asking those is called first principles thinking. You break a problem down to what you know for sure is true and build your own answer from there, peeling the onion one layer at a time. Studying philosophy trained me to keep asking “why” until I hit bottom, and it’s still one of the most useful things I ever learned.',
  'That habit is how you build your own worldview instead of borrowing someone else’s. Use AI all the time, but don’t take its answer as the final word. Push back, ask it why, and decide for yourself. The same goes for teachers, the internet, and your parents too. And don’t wait for any of us to suggest a book, an app to build, or something new to try. You don’t need permission to be curious, and you don’t need permission to start.',
  'Reading ten articles about making an app teaches you less than building a clumsy one this weekend. Almost everyone I admire got where they are by trying a lot of things, plenty of which didn’t work. As John Collison, one of Stripe’s founders, put it, “the world is a museum of passion projects.” That’s what carpe diem really means: noticing an opening and stepping through it before you talk yourself out of it. Don’t ask, just do.',
  'And don’t wait until you’re older to take your interests seriously. The things you love right now, even the ones that feel small or random, deserve real time today, not someday after high school and college are over. School gives you the tools, and your passions give you a reason to use them. Do both at once and each one makes the other better.',
  'None of this means giving up YouTube, Netflix, or Pinterest. Rest and relaxation matter. But notice the difference between watching and making. Scrolling for clothing ideas is fun, and designing your own embroidered jacket is more fun. Playing a game is fun, and building your own with Claude might be better. Making things leaves you with a skill, something you made, and a clearer sense of who you are.',
  'Some of the most interesting careers come from putting together two things that don’t usually go together: an artist who understands business, a writer who understands science. You don’t have to choose between what you love and a practical path. Often the practical skill is what lets you keep doing what you love, on your own terms.',
  'So I don’t think this is or should be a scary time to grow up. It might be the best time ever to be curious and have agency. Someone your age can now build things that used to take a whole team, and because AI can handle more of the time-consuming digging, you get to spend more of your time on exploring your own ideas. What will set you apart is your curiosity, your taste, and your willingness to start. You have more of all three than you think. Let’s sit down together soon and map what you love to where it could lead. Until then, pick one of them and give it a little real time this week.',
];

export default function EssayPage() {
  return (
    <main className="min-h-screen bg-[#f5f5dc] text-[#222222]">
      <article className="mx-auto max-w-[42rem] px-4 sm:px-6 pt-8 pb-24 sm:pt-12 font-serif text-[1.125rem] sm:text-[1.1875rem] leading-[1.75]">
        <Link
          href="/"
          className="font-mono text-sm text-[#666666] hover:text-[#8b0000]"
        >
          ← Home
        </Link>

        <h1 className="mt-12 mb-12 sm:mt-16 text-[2rem] sm:text-[2.5rem] leading-[1.2] font-normal text-[#1a1a1a] text-balance">
          {title}
        </h1>

        <p className="mb-8 text-[#555555]">
          <time dateTime="2026-11-09">November 9, 2026</time>
        </p>

        <p className="mb-6">{salutation}</p>

        {paragraphs.map((paragraph, i) => (
          <p key={i} className="mb-6 text-pretty">
            {paragraph}
          </p>
        ))}

        <p className="mt-10">
          Love,
          <br />
          <span className="pl-6">Dad (and Mom)</span>
        </p>
      </article>
    </main>
  );
}
