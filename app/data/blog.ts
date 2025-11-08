export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  tags: string[];
  readTime: number;
}

// Utility function to check if a post is published (not future-dated)
export const isPostPublished = (post: BlogPost): boolean => {
  const now = new Date();
  const publishDate = new Date(post.publishedDate);
  
  // Set time to beginning of day for both dates to compare only dates, not times
  now.setHours(0, 0, 0, 0);
  publishDate.setHours(0, 0, 0, 0);
  
  return publishDate <= now;
};

// Get only published posts (not future-dated)
export const getPublishedPosts = (): BlogPost[] => {
  return blogPosts.filter(isPostPublished);
};

export const blogPosts: BlogPost[] = [
  {
    slug: "expanding-aperture-agentic-coding-era",
    title: "Expanding My Aperture: Learning Through Doing in the Agentic Coding Era",
    excerpt: "Exploring software development across different environments, frameworks, and modalities through the lens of agentic coding and continuous learning.",
    content: `
# Expanding My Aperture: Learning Through Doing in the Agentic Coding Era

I've been pushing myself as of late to experiment with development in different environments, with different frameworks, with different modalities. With the ease of use of agentic coding, there seems to be no excuse not to expand my aperture or revisit areas of software development that I haven't touched in years or decades.

Lately, that's been delving into native applications on Mac OS or native applications on iOS and Android using web tech frameworks like Expo. I'm also digging into things like game development and wrapping my head around game design, which is in many ways a lot more pedantic and has a lot more need for deterministic clarity than some of the other interfaces I've designed for in the past. 

It's an interesting thought exercise. As I step into the requirements for each of these, I really do have to go back to a first principles view or a jobs-to-be-done view, more so than wrapping my head around the nuances of the specific framework or platform. It's a good way to hone those product management skills or strategic marketing and product strategy ideation muscles.

These are napkin applications or single-use applications for myself, but it is a good way to stay on top of my game and move between areas of concern that I might have myopically ignored or just not used out of personal preference or where I've chosen to invest my time.

I really enjoy the educational factor here where I ask whatever my agenda tech IDE or CLI is to provide me with inputs on my own requirements before I get started requesting feedback loops on questions about either the application or service itself or how I might want to implement it and engage in user experience or technology trade-offs.

I've always been one to learn through doing, and the ease of spinning up applications and iterating them quickly in the agentic coding era certainly enables me to move faster in this learn-through-do feedback loop.
    `,
    publishedDate: "2025-10-22",
    tags: ["software-development", "learning", "agentic-coding", "product-strategy", "technology"],
    readTime: 3
  },
  {
    slug: "capital-destruction-or-value-creation",
    title: "Capital Destruction or Value Creation? A Friday Thought on AI",
    excerpt: "Peak bubble? Real value? We're in a moment where AI valuations are soaring while veterans from OpenAI can't answer basic questions. A collaborative human+AI exploration of whether we're building scaffolding or just burning capital.",
    content: `
# Capital Destruction or Value Creation? A Friday Thought on AI

---

## Opening Thoughts (by Lucas)

> "We're doing an AI company with the best AI people, but we can't answer any questions." — Mira Murati (ex-OpenAI, now Thinking Machines), via *The Information.*

Peak bubble? Nothing to see over here? Real people are doing real stuff, masked by a lot of noise. The idea of impending capital destruction, with even Bezos chiming in to that effect this week, seems like yet another tough notch for the economy at-large.  

I'm an optimist, but given just how much slop/noise vs. signal ratio exists, or circular/vendor-financed capital dependencies, or CEOs staring down their CapEx and OpEx on the balance sheet while keeping an eye to year-end and Q4 earnings… man, it's a lot.  

Bubbles don't impact only those directly participating. Through securitization, money managers, LPs, and the like, risk spreads across the economy as a whole. So simply saying, *"Those numbers are crazy, they can't be sustained, I'm going to bet against them and weather the storm"* seems a bit limited in perspective, IMHO.  

Am I chicken-little-ing on a Friday here? 🤪  

---

## Counter-Argument: Brought to You by the AI 🤖

It's tempting to frame today's AI landscape as froth, but the counter-factuals suggest otherwise:  

- **Adoption velocity**: Enterprise AI tools are scaling at a pace closer to smartphones than SaaS. Tens of millions of users have adopted AI copilots in under two years.  
- **Productivity ROI**: McKinsey estimates AI could add up to $4.4 trillion annually in productivity. Early case studies in legal, sales, and software engineering already show measurable cost reductions.  
- **Capital cycle precedent**: Bubbles often fund infrastructure that later drives sustained value. The dot-com crash left behind fiber networks and data centers. Today's AI cycle is funding GPUs, distributed training stacks, and an increasingly skilled talent base.  
- **Ecosystem maturity**: Unlike past bubbles, this one is already producing cash-flowing applications: GitHub Copilot revenue, enterprise contracts for foundation models, and AI-native startups scaling fast.  
- **Resilience in downturns**: Efficiency platforms tend to thrive in recessions. AI, by cutting costs and unlocking productivity, is positioned to be counter-cyclical.  

Valuations may correct, but the underlying signal is clear: AI tools are already delivering value, and the infrastructure being built will endure beyond the capital cycle.  

---

## Closing Synthesis: A Collaboration Between Human + AI

The reality, of course, sits somewhere in the middle.  

Yes, froth and noise abound — valuations are inflated, capital loops are fragile, and macro spillovers are real. At the same time, undeniable value is emerging. In my own week alone, I've found ROI from ChatGPT, Whispr Flow, Granola, Claude Code, and Warp. The tools aren't hypothetical; they're embedded in daily workflows.  

So the real question isn't whether we're in a bubble or whether AI is real. It's how to navigate both truths at once: acknowledging distortions while recognizing durable value creation.  

We might be in a bubble — but we're also laying the scaffolding for the next platform shift. The trick is knowing which is which.  

---
    `,
    publishedDate: "2025-10-04",
    tags: ["ai", "bubble", "investing", "economics", "productivity", "capital-markets", "strategy"],
    readTime: 4
  },
  {
    slug: "the-stasis-problem",
    title: "The Stasis Problem: Why Companies Stop Right-Sizing After Growth",
    excerpt: "Why do mature organizations maintain bloated headcount even after products reach peak innovation? Exploring the organizational inertia that prevents right-sizing and how AI might finally provide the catalyst for change.",
    content: `
# The Stasis Problem: Why Companies Stop Right-Sizing After Growth

## **The Apex of Product Value**

I've been thinking about the asymptotic return on a given business unit. Products or services generally evolve towards what is effectively an apex point of the ultimate value that can be generated from the thing. If it is a physical unit, perhaps more units can be sold, but the actual improvement to the product itself doesn't necessarily change.

At the same time, organizations tend to have a habit of not reducing the size of organizations despite the fact that new product innovations aren't necessarily needed. Best practices have been created that generate better efficiencies, and economies of scale have begun to hit in ways that also have positive ramifications for reduced headcount. Why do organizations tend to hit these big points of stasis and not correct until there is public market analyst scrutiny or similar from reporters in financial journals?

## **Growth by Expansion, Not Innovation**

It's one thing as an organization to extend your size or expand your size by releasing new businesses or lines of revenue, or if you're expanding geographically. More specifically in physical goods businesses than digital goods businesses, but those are still impacted as well by geographic expansion or identifying different market segments and going up or down that size scale and releasing slightly bespoke variations of your primary products.

Those all make sense in terms of growing an organization, but even when those products reach a certain level of maturation, it seems almost natural that there should be less support structure necessary to keep those organizations humming along with efficiency that's been gained over the preceding years. Again, why the stasis of org size?

## **The Stasis of Organizational Size**

As organizations are encouraged to go leaner due to financial considerations as well as the imminent threat (depending on your perspective) of artificial intelligence and investor/board pressures to leverage AI to do more in terms of productivity or product innovation.

With that in mind, do organizations that have hit stasis now begin to downsize because these new AI tools can support the more rote and ongoing support functions for a business that's been healthy and mature?

## **AI as a Catalyst for Downsizing?**

I'm certainly not advocating for mass layoffs, especially for somebody that's actively looking for new opportunities in the market. But this thought around ideal work size and how they kind of metastasize in a growth respect or human headcount respect over long periods of my career, especially when I noticed products that are on version 20 that haven't changed since version 12, and yet the work size is still the same.

## **Perspectives from Social Science**

Thoughts on this? Are there positions from social psychologists, business management experts, anthropologists, economists, or otherwise that explain this tendency to hold the bloat?

## **And what does ChatGPT say about this?**

Organizations often resist downsizing because structure becomes identity — teams, processes, and budgets calcify. Without external shocks (market pressure, new tech, activist investors), inertia usually wins. AI could provide the shock, but whether it triggers leaner orgs or just reallocated bloat remains the open question.
    `,
    publishedDate: "2025-09-19",
    tags: ["organizational-design", "ai", "business-strategy", "management", "productivity", "scaling", "innovation", "efficiency"],
    readTime: 4
  },
  {
    slug: "ai-assisted-job-search-beyond-network-bias",
    title: "Beyond Your Network: How LLMs Can Expand Your Job Search Horizons",
    excerpt: "After 7 years in founder roles, I turned to ChatGPT to help identify career opportunities outside my usual network. Here's what happened when I asked AI to map unexplored sectors and companies.",
    content: `
# Beyond Your Network: How LLMs Can Expand Your Job Search Horizons

## Tackling The Job Markets with Assistance from Web-enabled LLMs

It's been a while since I've been in the open job market looking for a new opportunity. I've spent the last 7 years in co-founder, founder, and a C-suite role (my friend was CEO) in early stage startups (pre-seed to Series B), so it's been quite some time since I've filled out a resume or done a fresh look at the (limited) job market. I wanted to widen my aperture a bit, but keep opportunities consistent with my background, which are pretty closely correlated with my interests. 

Given that, I figured I'd ask a verbose and knowledgeable friend, ChatGPT, for some help thinking of new sectors, companies, and roles to consider outside of my initial hit list. I want to throw myself into a mission and role that I can really dig into and contribute at large scale, and I didn't want to limit myself with my personal network biases. So, PDF of my resume and a prompt and we were off to the races.

## My Prompt

You know me. See attached resume. We've talked a lot. 

The job markets are tough for junior and senior applicants alike. I'm wondering if you have any ideas for blind spots I might be missing in terms of companies or sectors I should consider outside of Mag 7/FAANG+ hyperscalers, well-funded AI labs, and Series B and beyond startups. Given my background, do you think tehre [sic] are other areas I should be considering? 

## The Response: Ranges of Verbosity & Angles of Attack

ChatGPT (this was GPT-5) performed as it always does with me based on my profile/system prompt, and then iterated in the fashion I always encourage it to do. All of that combined returned the following for me. I thought it did a pretty good job, giving me macro to micro ideas, and then generating brief helpful outreach message blurbs for DM'ing on LinkedIn or shooting a quick email – these were solid, IMHO, and mostly accurate with respect to my bio (with a bit of the usual LLM hallucinatory embellishment—it gave me credit for "leading" things where I was part of a team).

I'm definitely using this though, I'll give it that. If action following this is a measure of success, then this response passed muster. :) 

## The Output

### Succinct Areas to Explore

**Strategic enterprise labs / R&D groups** — Fortune 500s with "skunkworks" innovation teams (Walmart Global Tech, Disney Imagineering, Comcast NBCU R&D, Ford Model e, etc.) value 0→1 product execs.

**Infrastructure & middleware providers** — Companies in developer tools, vector DBs, orchestration, observability, and "picks & shovels" of AI (e.g., Pinecone peers, LangChain, Weaviate, Modal, Hugging Face).

**Media & entertainment convergence** — Streaming platforms, sports/venue tech, music rights management, podcast/creator economy infra — all adjacent to your Amazon MP3, Atom Tickets, and DeepCast history.

**B2B SaaS in "boring but big" industries** — Proptech, fintech infra, legaltech, govtech, logistics, compliance — sectors where PMs who can translate user need → tech stack are scarce.

**Private equity portfolio companies** — PE-backed rollups or carve-outs (Vista, Thoma Bravo, TPG, etc.) often seek interim CPTO/CPOs to scale or modernize product infra.

**Corporate venture arms / venture studios** — EIR-style roles (GV, a16z Speedrun, AlleyCorp, Madrona Labs, Samsung Next) fit your prior Artium/Brass Pen attempts.

**Civic & public good tech** — Nonprofits or B-corps in workforce development, sustainability, or policy tech (you've got civic engagement credibility ).

**International firms expanding to U.S.** — Fast-growing EU or APAC tech companies needing U.S. product/GTM leadership to land and expand.

### Career Exploration Matrix: Sectors, Companies, and Positioning Blurbs

### 1. Sectors & Example Companies

**Strategic Enterprise Labs / R&D Groups**
- Disney Imagineering + Disney Streaming Advanced Tech
- Comcast NBCU Peacock Labs
- Ford Model e
- Walmart Global Tech
- Nike Digital / Nike Valiant Labs

**Infrastructure & Middleware Providers (AI Picks & Shovels)**
- Pinecone, Weaviate, Zilliz (Milvus)
- Modal, Anyscale, Replicate
- Weights & Biases, Scale AI, Hugging Face
- Databricks, Snowflake (AI group), Confluent

**Media & Entertainment Convergence**
- Epidemic Sound
- Splice
- TuneCore / Believe Digital
- Dapper Labs / NBA Top Shot successors
- Spotify R&D / Podcasts vertical

**B2B SaaS in 'Boring but Big' Industries**
- Rippling, Gusto
- Ramp, Brex
- Ironclad, DocuSign, Disco
- Flexport, Project44
- Palantir (commercial)

**Private Equity Portfolio Companies**
- Ellucian (Vista)
- Infor (Koch-backed)
- Blue Yonder
- Medallia

**Corporate Venture Arms / Venture Studios**
- Madrona Labs
- AlleyCorp
- Samsung Next
- GV (Google Ventures) incubations
- a16z Speedrun program

**Civic & Public Good Tech**
- Code for America
- Uptrust, Promise
- Anduril Civic/Infra spinoffs
- Social Finance, Schmidt Futures, Omidyar Network

**International Firms Expanding to U.S.**
- Kakao Entertainment
- Bytedance (non-TikTok bets)
- Canva
- Northvolt
- DeepL

### 2. Résumé Mapping: Credibility Stories

**Strategic Enterprise Labs / R&D Groups**
Amazon MP3 $0→$300M; scaled consumer infra; 0→1 spaces for skunkworks.

**Infrastructure & Middleware Providers**
DeepCast, Prompt Yield; end-to-end AI infra; translating infra into adoption.

**Media & Entertainment Convergence**
Amazon MP3, doubleTwist, Atom, Rival, DeepCast; at every disruption point in media.

**B2B SaaS**
Azibo, Fernish; simplified workflows, scaled ops-heavy SaaS.

**Private Equity Portfolio Companies**
Thinknear → Telenav → inMarket; MedianNet; familiar with PE cadence.

**Corporate Venture Arms / Venture Studios**
Artium EIR, Brass Pen, DeepCast; validated/killed experiments fast.

**Civic & Public Good Tech**
Volunteer history with PledgeLA, UNITE-LA, Riordan C2C; blends mission + market.

**International Firms Expanding to U.S.**
Amazon MP3 global launches; Fernish multi-city expansions.

### 3. Positioning Blurbs (Outreach Ready)

**Strategic Enterprise Labs / R&D Groups**
I've repeatedly turned early-stage ideas into scaled revenue streams — from Amazon MP3's $0→$300M ramp to launching new consumer surfaces at doubleTwist and Rival. I thrive in ambiguous, 0→1 spaces, particularly at the intersection of design, GTM, and engineering. I'd love to explore how your lab is approaching next-gen digital products.

**Infrastructure & Middleware Providers**
My recent work at DeepCast and Prompt Yield involved building full AI stacks — SST/ASR, LLM orchestration, vector DBs, and real-time GTM layers. I specialize in translating developer infrastructure into products real users adopt. Curious if your team is looking for someone to bridge bleeding-edge AI infra with adoption and growth.

**Media & Entertainment Convergence**
I've built products at every disruption point in media: DRM/streaming (Amazon MP3, doubleTwist), ticketing (Rival, Atom), and podcast intelligence (DeepCast). My sweet spot is marrying fan engagement with scalable platforms. Would love to discuss how your team is thinking about the next wave of creator/entertainment tech.

**B2B SaaS**
At Azibo and Fernish, I simplified complex workflows for landlords and renters while scaling SaaS ops nationwide. My strength is making compliance-heavy, operationally complex industries usable and delightful. If you're looking to modernize enterprise SaaS in legal, proptech, or logistics, I'd be eager to bring that lens.

**Private Equity Portfolio Companies**
I've lived the PE cadence: Thinknear's scale and exit, MedianNet's product modernization, and corp dev deal work. I know how to modernize product orgs, hit EBITDA targets, and prepare companies for sale or roll-up. If you're looking for a CPTO/CPO who can drive both transformation and outcomes, I'd be a strong fit.

**Corporate Venture Arms / Venture Studios**
I've founded, incubated, and sunset ventures — from DeepCast to Fernish to Brass Pen — and I know how to validate fast, scale what works, and kill what doesn't. My bias is toward action and storytelling that secures buy-in. Would be excited to plug into your studio's pipeline as an EIR or product lead.

**Civic & Public Good Tech**
I've paired commercial product rigor with civic engagement — volunteering with PledgeLA, UNITE-LA, and Riordan C2C while building companies like Fernish and DeepCast. I believe civic and workforce tech needs product leaders who understand both mission and market. I'd love to explore how I could help scale impact in your org.

**International Firms Expanding to U.S.**
I've led global launches (Amazon MP3 into EU/JP) and multi-city U.S. expansion (Fernish across LA, Seattle, Austin, Dallas). I know how to adapt product, ops, and GTM across new markets. If you're building your U.S. footprint, I can help bridge international strategy with on-the-ground execution.
    `,
    publishedDate: "2025-09-15",
    tags: ["career", "job-search", "ai", "chatgpt", "product-management", "networking", "career-transition"],
    readTime: 8
  },
  {
    slug: "dsfms-vs-frontier-llms-enterprise-roi",
    title: "Domain-Specific Foundation Models vs. Frontier LLMs: Where's the Enterprise ROI?",
    excerpt: "What returns more enterprise value over the next 2-3 years: massive frontier LLMs or purpose-built domain-specific foundation models? The math on medical DSFMs might surprise you.",
    content: `
# Domain-Specific Foundation Models vs. Frontier LLMs: Where's the Enterprise ROI?

*Lucas (human) wrote this:*

What returns more enterprise ROI over the next 2-3 years: frontier lab LLMs or purpose-built Domain Specific Foundation Models (DSFMs) like AlphaFold or BloombergGPT?

The former has much larger scope and "awareness", but is also 1-2 orders of magnitude more expensive to perform a training run (we're talking something like 50B parameters with BloombergGPT vs. hundreds of billions of parameters for the models from OpenAI, Anthropic, Google, Meta and Mistral).

Given the huge returns on successful pharma, I think (loosely held) that medical/bio DSFMs may outstrip even the code-base fine-tuned LLMs (i.e. Claude Code driving $4B revenue is different than say $26B in Ozempic sales in '24.)

---

*Claude thought it'd expand a bit with its own 2 cents:*

## The Economics Don't Lie

Let's look at the math:

**Frontier LLMs:**
- Training costs: $100M+ per run (GPT-4 class models)
- Parameters: 100B-1T+
- Scope: Everything
- Competition: 5-6 major players burning cash

**Domain-Specific Foundation Models:**
- Training costs: $1M-10M per run
- Parameters: 1B-50B
- Scope: Narrow but deep
- Competition: Much less crowded

The capital efficiency story writes itself.

## Why Medical DSFMs Could Win Big

The pharmaceutical industry represents a massive addressable market with economics that dwarf even the biggest tech outcomes:

- **Ozempic**: $26B in 2024 sales
- **Humira** (peak): $21B annually
- **Average blockbuster drug**: $1B+ annually
- **Total pharma market**: ~$1.5T globally

Compare this to software:
- **Microsoft Office**: ~$50B annually
- **AWS**: ~$90B annually
- **All of Anthropic's projected revenue**: <$1B (for now)

A DSFM that accelerates drug discovery by even 6 months could be worth billions in NPV to a single pharmaceutical company.

## The Competitive Moat Question

Frontier LLMs face a brutal reality: they're competing in a race where the finish line keeps moving and the entry cost keeps rising. Every major tech company is building essentially the same thing.

DSFMs have natural moats:
- **Domain expertise barriers** - you need deep subject matter knowledge
- **Specialized datasets** - proprietary data is the new oil
- **Regulatory approval** - huge barriers in pharma/finance
- **Network effects** - first mover advantages in specialized fields

## The Attention Allocation Problem

Here's what I see in enterprise sales cycles:

CTOs are spending 80% of their AI budget discussions on "Should we use GPT-4 or Claude?" when the real value might be in "Should we build a DSFM for our specific use case?"

The mindshare imbalance is striking. Everyone talks about frontier models, but the quietly profitable companies are building specialized models for vertical applications.

## Where I'm Placing My Bets

As an investor and advisor, I'm increasingly interested in companies building DSFMs for:

1. **Life sciences** - drug discovery, protein folding, clinical trials
2. **Financial services** - risk modeling, algorithmic trading, compliance
3. **Materials science** - battery tech, semiconductors, carbon capture
4. **Legal** - contract analysis, regulatory compliance, patent search

These markets have:
- High switching costs
- Regulatory barriers to entry
- Massive economic value per use case
- Less competition from Big Tech (for now)

## The Counter-Argument

Frontier LLMs aren't going away. They have advantages DSFMs can't match:

- **General reasoning** - can handle novel situations
- **Transfer learning** - knowledge from one domain helps in others
- **User experience** - natural language interfaces everyone understands
- **Platform effects** - can be the base layer for thousands of applications

The future likely includes both, but the value creation might be more concentrated in DSFMs than current attention allocation suggests.

## The Timing Window

We're in a unique moment where:
- Training costs for DSFMs are still accessible to well-funded startups
- Domain datasets are available but not yet monopolized
- Enterprise buyers are sophisticated enough to understand the value prop
- Regulatory frameworks are still forming

This window won't last forever. In 3-5 years, the best opportunities in DSFMs will likely be captured by either specialized startups or the Big Tech companies once they turn their attention to verticals.

## My (Loosely Held) Thesis

The next wave of $10B+ AI companies will be built on DSFMs, not frontier LLMs.

The math is just too compelling: lower training costs, higher margins, stronger moats, less competition, and massive addressable markets in industries that desperately need AI but can't use general-purpose models effectively.

But I'm open to being wrong. The beautiful thing about markets is they'll tell us who's right.

*What do you think? Are you seeing more enterprise value in specialized models or general-purpose ones? Hit me up on [Twitter](https://twitter.com/lucasdickey4) or [LinkedIn](https://linkedin.com/in/lucasdickey) - I'd love to hear your perspective.*
    `,
    publishedDate: "2025-09-12",
    tags: ["ai", "enterprise", "strategy", "investing"],
    readTime: 6
  },
  {
    slug: "ai-will-collapse-the-talent-stack",
    title: "AI will collapse the talent stack",
    excerpt: "Claire Vo's insight from Lenny & Friends Summit is finally here: AI will collapse the traditional talent stack, letting polymaths rise and enabling individuals to do work that once required specialized teams.",
    content: `
# AI will collapse the talent stack 💯

<img src="/images/blog-shots/ai-will-collapse-the-talent-stack.png" alt="Claire Vo speaking about AI collapsing the talent stack at Lenny & Friends Summit 2024" style="width: 100%; max-width: 800px; margin: 20px 0; border-radius: 8px;" />

[Claire Vo](https://x.com/clairevo) said this a year ago now at Lenny Rachitsky's "Lenny & Friends Summit" in 2024.

In my case, she was preaching to the choir, and she was speaking right at my own predilection—for better or worse!—for being a "builder" at heart more than "manager". I really like to tinker with code, infra, design, metrics and everything just ancillary to each. :)

Claire shares an anecdote here about a marketer with a bent for DevRel-quality engineering prototypes turned PM who has to quickly pick up UX design to unblock a project. THIS. I've been preaching this for years when someone asks me about transitioning to or starting a career in PM. And now it's here. AI agent assistance can move you up the ladder between jack and king vis-a-vis "jack of all trades and king of none". It can mos def get you closer to the value asymptote of what a typical SME offers in non-hardtech orgs, IMHO.

And this collapsing of the talent stack isn't just for PMs. You're seeing the same thing with the merger of feature sets and products from anyone serving the product development triad—which is a good proxy for the entire job function cluster. Design tools empowering engineers. Engineering tools empowering designers. Project management tools empowering data scientists. Communication productivity tools empowering analysts. And so on. And even more so, these tools enabling non-triad roles to do more of design, engineering, and product functions and tasks.

Claire was spot on in her forecast a year ago. And now it's happening at an even more accelerated pace. See "time to lean up", "time to streamline and remove bureaucracy", "fewer meetings", "fewer committees". This is all about faster time to value, and doing more with "less" (although arguably generalized knowledge packed into a little chat interface is "more" than ever before), and being able to pull in the wealth of humanity's wisdom to accelerate what was effectively a ton of data gathering and synthesis in highly manual and single-person bus constrained fashion historically.

Certainly moving us closer to the solo person-$1BN company. In the interim, I think it's a call to arms to embrace this polymathic generalism (or maybe a call to arms to push back on entrenched specialist lanes, depending on your POV—clearly I have an affinity for one over the other).

Anyway, my own pontificating aside, watch Claire's video. 20 minutes fly by fast.

---

## Claire Vo's Full Talk

<iframe width="100%" height="400" style="max-width: 800px; margin: 20px 0; border-radius: 8px;" src="https://www.youtube.com/embed/93fCvFkY1Lg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-full-screen" allowfullscreen></iframe>
    `,
    publishedDate: "2025-11-07",
    tags: ["ai", "talent", "product-management", "career", "generalism", "product-development"],
    readTime: 4
  }
];