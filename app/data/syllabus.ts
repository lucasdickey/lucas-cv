export type SyllabusStatus = "reading" | "read" | "pending";

export interface SyllabusReading {
  slug: string;
  title: string;
  author: string;
  format: "book" | "essays" | "interviews";
  status: SyllabusStatus;
  /** The framing question or note this reading is assigned against */
  note?: string;
  /** Canonical link when the work is published on the open web */
  url?: string;
  amazonUrl?: string;
  coverUrl?: string;
  /** Position in the suggested reading order, if assigned */
  orderIndex?: number;
}

export interface SyllabusPart {
  id: string;
  label: string;
  title: string;
  summary: string;
  readings: SyllabusReading[];
}

const amazonSearch = (title: string, author: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(`${title} ${author}`)}`;

export const syllabusParts: SyllabusPart[] = [
  {
    id: "civilization-history",
    label: "Part I",
    title: "Civilization & History",
    summary:
      "The big structural theories of where civilizations are headed — and whether any of them survive contact with abundant machine intelligence.",
    readings: [
      {
        slug: "the-end-of-history-and-the-last-man",
        title: "The End of History and the Last Man",
        author: "Francis Fukuyama",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/the-end-of-history-and-the-last-man.jpg",
        note: "Does liberal democracy represent the endpoint of ideological evolution?",
        amazonUrl: "https://www.amazon.com/dp/0743284550",
        orderIndex: 3,
      },
      {
        slug: "the-clash-of-civilizations",
        title: "The Clash of Civilizations",
        author: "Samuel Huntington",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/the-clash-of-civilizations.jpg",
        note: "Is culture, rather than ideology, the dominant source of future conflict?",
        amazonUrl: amazonSearch("The Clash of Civilizations", "Samuel Huntington"),
        orderIndex: 4,
      },
      {
        slug: "end-times",
        title: "End Times",
        author: "Peter Turchin",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/end-times.jpg",
        note: "Can civilizational instability be modeled structurally?",
        amazonUrl: amazonSearch("End Times", "Peter Turchin"),
        orderIndex: 10,
      },
    ],
  },
  {
    id: "media-cognition",
    label: "Part II",
    title: "Media & Cognition",
    summary:
      "How the medium reshapes the mind that uses it. Read with 'television' and 'the internet' mentally swapped for LLMs, synthetic media, and algorithmic feeds.",
    readings: [
      {
        slug: "understanding-media",
        title: "Understanding Media",
        author: "Marshall McLuhan",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/understanding-media.jpg",
        note: "The foundational work on how media reshape civilization.",
        amazonUrl: amazonSearch("Understanding Media", "Marshall McLuhan"),
        orderIndex: 2,
      },
      {
        slug: "amusing-ourselves-to-death",
        title: "Amusing Ourselves to Death",
        author: "Neil Postman",
        format: "book",
        status: "read",
        coverUrl: "/images/books/amusing-ourselves-to-death.jpg",
        note: "Read while mentally replacing 'television' with AI systems, LLMs, synthetic media, and algorithmic feeds.",
        amazonUrl: "https://amzn.to/4lMkbyS",
        orderIndex: 1,
      },
      {
        slug: "the-shallows",
        title: "The Shallows",
        author: "Nicholas Carr",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/the-shallows.jpg",
        note: "A bridge between internet cognition and AI cognition.",
        amazonUrl: amazonSearch("The Shallows", "Nicholas Carr"),
      },
    ],
  },
  {
    id: "economics-institutions",
    label: "Part III",
    title: "Economics & Institutions",
    summary:
      "Incentives, productivity, equilibrium, and institutional adaptation — plus the economic model AI inherits from the internet.",
    readings: [
      {
        slug: "average-is-over",
        title: "Average Is Over",
        author: "Tyler Cowen",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/average-is-over.jpg",
        note: "Read alongside selected Marginal Revolution essays. Focus: incentives, productivity, equilibrium, institutional adaptation.",
        amazonUrl: amazonSearch("Average Is Over", "Tyler Cowen"),
        orderIndex: 6,
      },
      {
        slug: "the-age-of-surveillance-capitalism",
        title: "The Age of Surveillance Capitalism",
        author: "Shoshana Zuboff",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/the-age-of-surveillance-capitalism.jpg",
        note: "The economic model AI inherits from the internet.",
        amazonUrl: amazonSearch(
          "The Age of Surveillance Capitalism",
          "Shoshana Zuboff"
        ),
        orderIndex: 7,
      },
      {
        slug: "the-second-machine-age",
        title: "The Second Machine Age",
        author: "Erik Brynjolfsson & Andrew McAfee",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/the-second-machine-age.jpg",
        amazonUrl: amazonSearch("The Second Machine Age", "Brynjolfsson McAfee"),
        orderIndex: 8,
      },
      {
        slug: "machine-platform-crowd",
        title: "Machine, Platform, Crowd",
        author: "Erik Brynjolfsson & Andrew McAfee",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/machine-platform-crowd.jpg",
        amazonUrl: amazonSearch("Machine Platform Crowd", "Brynjolfsson McAfee"),
        orderIndex: 8,
      },
    ],
  },
  {
    id: "networks-states-power",
    label: "Part IV",
    title: "Networks, States & Power",
    summary:
      "Does AI strengthen states or networks? Does it concentrate power or distribute it? The historical record on hierarchies, networks, and institutions.",
    readings: [
      {
        slug: "the-square-and-the-tower",
        title: "The Square and the Tower",
        author: "Niall Ferguson",
        format: "book",
        status: "reading",
        coverUrl: "/images/books/the-square-and-the-tower.jpg",
        note: "Probably the strongest historical treatment of networks versus hierarchies.",
        amazonUrl: amazonSearch("The Square and the Tower", "Niall Ferguson"),
        orderIndex: 9,
      },
      {
        slug: "civilization-the-west-and-the-rest",
        title: "Civilization: The West and the Rest",
        author: "Niall Ferguson",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/civilization-the-west-and-the-rest.jpg",
        note: "A framework for thinking about civilizational success and its prerequisites.",
        amazonUrl: amazonSearch("Civilization The West and the Rest", "Niall Ferguson"),
        orderIndex: 9,
      },
      {
        slug: "institutions-institutional-change",
        title: "Institutions, Institutional Change and Economic Performance",
        author: "Douglass North",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/institutions-institutional-change.jpg",
        note: "Foundational work on institutions and political economy.",
        amazonUrl: amazonSearch(
          "Institutions Institutional Change and Economic Performance",
          "Douglass North"
        ),
        orderIndex: 11,
      },
    ],
  },
  {
    id: "ai-futures",
    label: "Part V",
    title: "AI Futures",
    summary:
      "The forecasters and the frontier. Mostly published on the open web, and mostly revised faster than books can be printed.",
    readings: [
      {
        slug: "superintelligence",
        title: "Superintelligence: Paths, Dangers, Strategies",
        author: "Nick Bostrom",
        format: "book",
        status: "reading",
        coverUrl: "/images/books/superintelligence.jpg",
        note: "The foundational case for why a machine intelligence explosion is hard to steer and hard to contain.",
        amazonUrl: "https://www.amazon.com/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0198739834",
        orderIndex: 12.5,
      },
      {
        slug: "ai-2027",
        title: "AI 2027 (and What 2026 Looks Like)",
        author: "Daniel Kokotajlo",
        format: "essays",
        status: "reading",
        coverUrl: "/images/syllabus/ai-2027.svg",
        note: "Including follow-up essays and revisions — the scenario work is a moving target by design.",
        url: "https://ai-2027.com",
        orderIndex: 13,
      },
      {
        slug: "dwarkesh-interviews",
        title: "Long-form interviews",
        author: "Dwarkesh Patel",
        format: "interviews",
        status: "read",
        coverUrl: "/images/syllabus/dwarkesh-interviews.svg",
        note: "Dario Amodei, Demis Hassabis, Ilya Sutskever, Noam Brown, Leopold Aschenbrenner.",
        url: "https://www.dwarkesh.com",
        orderIndex: 14,
      },
      {
        slug: "situational-awareness",
        title: "Situational Awareness",
        author: "Leopold Aschenbrenner",
        format: "essays",
        status: "pending",
        coverUrl: "/images/syllabus/situational-awareness.svg",
        url: "https://situational-awareness.ai",
      },
    ],
  },
  {
    id: "ethics-society-governance",
    label: "Part VI",
    title: "Ethics, Society & Governance",
    summary:
      "How ethics and governance evolve when intelligence is no longer uniquely human — and what that does to the moral psychology underneath.",
    readings: [
      {
        slug: "practical-ethics",
        title: "Practical Ethics",
        author: "Peter Singer",
        format: "book",
        status: "read",
        coverUrl: "/images/books/practical-ethics.jpg",
        amazonUrl: amazonSearch("Practical Ethics", "Peter Singer"),
        orderIndex: 12,
      },
      {
        slug: "the-righteous-mind",
        title: "The Righteous Mind",
        author: "Jonathan Haidt",
        format: "book",
        status: "reading",
        coverUrl: "/images/books/the-righteous-mind.jpg",
        amazonUrl: amazonSearch("The Righteous Mind", "Jonathan Haidt"),
      },
      {
        slug: "the-anxious-generation",
        title: "The Anxious Generation",
        author: "Jonathan Haidt",
        format: "book",
        status: "read",
        coverUrl: "/images/books/the-anxious-generation.jpg",
        amazonUrl: amazonSearch("The Anxious Generation", "Jonathan Haidt"),
      },
      {
        slug: "genesis",
        title: "Genesis",
        author: "Henry Kissinger, Eric Schmidt & Craig Mundie",
        format: "book",
        status: "pending",
        coverUrl: "/images/books/genesis.jpg",
        amazonUrl: amazonSearch("Genesis", "Kissinger Schmidt Mundie"),
        orderIndex: 15,
      },
    ],
  },
  {
    id: "information-civilization",
    label: "Part VII",
    title: "Information & Civilization",
    summary:
      "Information networks as the substrate of civilization — worth revisiting periodically as AI develops.",
    readings: [
      {
        slug: "nexus",
        title: "Nexus",
        author: "Yuval Noah Harari",
        format: "book",
        status: "read",
        coverUrl: "/images/books/nexus.jpg",
        note: "Worth revisiting periodically as AI develops.",
        amazonUrl: amazonSearch("Nexus", "Yuval Noah Harari"),
        orderIndex: 5,
      },
    ],
  },
];

export const syllabus = {
  title: "AI & Civilization Reading Syllabus",
  guidingQuestion:
    "If intelligence becomes abundant, inexpensive, and increasingly non-human, which theories of civilization still hold — and which must be rewritten?",
  purpose:
    "Rather than studying AI purely as a technical discipline, the goal is to understand it through multiple lenses simultaneously. The premise is that AI is likely to become a civilizational technology — not merely another software platform. Understanding its long-term implications therefore requires synthesis rather than specialization.",
  lenses: [
    "History",
    "Political science",
    "Economics",
    "Sociology",
    "Anthropology",
    "Psychology",
    "Philosophy",
    "Computer science",
    "Organizational behavior",
    "Media theory",
  ],
  learningGoals: [
    "Build a coherent mental model for how AI changes civilization.",
    "Understand how previous technological revolutions transformed societies and institutions.",
    "Develop intuition for second- and third-order effects rather than focusing only on near-term disruption.",
    "Better understand the interaction between incentives, institutions, technology, culture, and governance.",
    "Identify which historical theories remain predictive in an age of abundant machine intelligence.",
    "Recognize where existing academic frameworks appear insufficient.",
    "Form my own multidisciplinary perspective rather than adopting a single ideological or disciplinary lens.",
  ],
  centralQuestions: [
    "What happens when intelligence becomes infrastructure?",
    "Which institutions become more valuable, and which become obsolete?",
    "Does AI strengthen states or networks?",
    "Does it concentrate power or decentralize it?",
    "What becomes scarce once intelligence is abundant?",
    "How should ethics evolve when intelligence is no longer uniquely human?",
    "Which historical analogies are genuinely useful?",
    "Which assumptions about economics, education, labor, governance, and culture need to be revisited?",
  ],
  suggestedOrder: [
    "Neil Postman",
    "Marshall McLuhan",
    "Francis Fukuyama",
    "Samuel Huntington",
    "Yuval Noah Harari",
    "Tyler Cowen",
    "Shoshana Zuboff",
    "Brynjolfsson & McAfee",
    "Niall Ferguson",
    "Peter Turchin",
    "Douglass North",
    "Peter Singer",
    "Nick Bostrom",
    "Daniel Kokotajlo",
    "Dwarkesh Patel interviews",
    "Genesis",
  ],
  missingBook: {
    question: "What happens when intelligence becomes infrastructure?",
    influences: [
      "Neil Postman",
      "Marshall McLuhan",
      "Francis Fukuyama",
      "Tyler Cowen",
      "Yuval Noah Harari",
      "frontier AI researchers",
    ],
    progression: [
      "Electricity democratized energy.",
      "The printing press democratized knowledge.",
      "The internet democratized information.",
      "Large language models may democratize reasoning itself.",
    ],
    closing:
      "That shift has implications for economics, politics, science, education, warfare, religion, identity, creativity, governance, and culture. Understanding that transition — not merely the technology itself — is the overarching objective of this syllabus.",
  },
  parts: syllabusParts,
};

export const syllabusReadings: SyllabusReading[] = syllabusParts.flatMap(
  (part) => part.readings
);

export const getSyllabusStats = () => ({
  total: syllabusReadings.length,
  parts: syllabusParts.length,
  read: syllabusReadings.filter((r) => r.status === "read").length,
  reading: syllabusReadings.filter((r) => r.status === "reading").length,
  pending: syllabusReadings.filter((r) => r.status === "pending").length,
});

/** "A, B, and C" — used for the Missing Book's list of influences */
export const formatMissingBookInfluences = () => {
  const influences = syllabus.missingBook.influences;
  return `${influences.slice(0, -1).join(", ")}, and ${
    influences[influences.length - 1]
  }`;
};

export const getSyllabusStatusLabel = (status: SyllabusStatus) =>
  status === "reading"
    ? "📖 Reading"
    : status === "read"
    ? "✅ Read"
    : "🗓 Queued";
