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
  }
];