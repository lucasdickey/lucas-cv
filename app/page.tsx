"use client"

import { useState, useEffect } from "react"

interface Entry {
  title: string
  description: string
  publishedDate: string
  type: "cv" | "code" | "news" | "opinion" | "podcast" | "twitter"
  sourceUrl: string
  sourceTitle: string
  sourceDescription: string
}

const entries: Entry[] = [
  // CV Section
  {
    title: "Professional Experience & Background",
    description:
      "Comprehensive professional profile including work experience, skills, education, and career achievements. Connect with me to explore collaboration opportunities.",
    publishedDate: "2024-01-20",
    type: "cv",
    sourceUrl: "https://linkedin.com/in/lucasdickey",
    sourceTitle: "LinkedIn Profile",
    sourceDescription: "Professional networking and career information",
  },

  // Code Repositories (keeping existing ones for now)
  {
    title: "React Performance Optimization Guide",
    description:
      "A comprehensive guide covering React performance optimization techniques including memoization, code splitting, and bundle analysis.",
    publishedDate: "2024-01-15",
    type: "code",
    sourceUrl: "https://github.com/user/react-performance",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Complete React performance optimization examples and benchmarks",
  },
  {
    title: "Docker Container Security Best Practices",
    description:
      "Essential security practices for Docker containers in production environments, covering image scanning, runtime security, and network policies.",
    publishedDate: "2024-01-08",
    type: "code",
    sourceUrl: "https://github.com/user/docker-security",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Docker security configurations and scanning tools",
  },
  {
    title: "Microservices Architecture Patterns",
    description:
      "Implementation patterns for microservices architecture including service discovery, API gateways, and distributed tracing solutions.",
    publishedDate: "2024-01-01",
    type: "code",
    sourceUrl: "https://github.com/user/microservices-patterns",
    sourceTitle: "GitHub Repository",
    sourceDescription: "Microservices implementation examples and architectural patterns",
  },

  // News Articles - COMMENTED OUT
  // {
  //   title: "Breaking: New JavaScript Framework Released",
  //   description:
  //     "Major announcement of a new JavaScript framework that promises to revolutionize frontend development with improved performance and developer experience.",
  //   publishedDate: "2024-01-03",
  //   type: "news",
  //   sourceUrl: "https://news.dev/new-js-framework",
  //   sourceTitle: "Developer News",
  //   sourceDescription: "Latest news and updates from the software development community",
  // },

  // Twitter Posts Section (placeholder for dynamic content)
  {
    title: "Latest thoughts on web development trends",
    description:
      "Quick thoughts and insights on the latest developments in web technology, shared in real-time with the developer community.",
    publishedDate: "2024-01-12",
    type: "twitter",
    sourceUrl: "https://twitter.com/username/status/123456789",
    sourceTitle: "Twitter",
    sourceDescription: "Real-time thoughts and industry insights",
  },
  {
    title: "Just shipped a new feature using React Server Components",
    description:
      "Excited to share the experience of implementing React Server Components in production. The performance improvements are incredible!",
    publishedDate: "2024-01-09",
    type: "twitter",
    sourceUrl: "https://twitter.com/username/status/123456790",
    sourceTitle: "Twitter",
    sourceDescription: "Development updates and technical insights",
  },

  // Keep existing opinion and podcast entries
  {
    title: "The Future of Web Development",
    description:
      "An in-depth analysis of emerging trends in web development, including WebAssembly, edge computing, and the evolution of JavaScript frameworks.",
    publishedDate: "2024-01-10",
    type: "opinion",
    sourceUrl: "https://techblog.com/future-web-dev",
    sourceTitle: "Tech Blog",
    sourceDescription: "Weekly insights on technology trends and industry analysis",
  },
  {
    title: "Why TypeScript is Taking Over",
    description:
      "Analysis of TypeScript adoption trends and why more development teams are choosing TypeScript over vanilla JavaScript for large-scale applications.",
    publishedDate: "2023-12-28",
    type: "opinion",
    sourceUrl: "https://devblog.com/typescript-adoption",
    sourceTitle: "Developer Blog",
    sourceDescription: "Insights and opinions on modern development practices",
  },
  {
    title: "AI in Software Development Podcast",
    description:
      "Discussion about the impact of artificial intelligence on software development workflows, featuring industry experts and practical examples.",
    publishedDate: "2024-01-05",
    type: "podcast",
    sourceUrl: "https://podcast.com/ai-software-dev",
    sourceTitle: "Dev Podcast Network",
    sourceDescription: "Weekly podcast covering software development trends and technologies",
  },
  {
    title: "Cloud Native Development Podcast",
    description:
      "Deep dive into cloud-native development practices, containerization strategies, and Kubernetes deployment patterns with industry practitioners.",
    publishedDate: "2023-12-25",
    type: "podcast",
    sourceUrl: "https://podcast.com/cloud-native",
    sourceTitle: "Cloud Tech Podcast",
    sourceDescription: "Weekly discussions on cloud technologies and DevOps practices",
  },
]

export default function TerminalRepoList() {
  const [loading, setLoading] = useState(true)
  const [groupedEntries, setGroupedEntries] = useState<Record<string, Entry[]>>({})

  useEffect(() => {
    // Simulate loading delay for terminal effect
    setTimeout(() => {
      const grouped: Record<string, Entry[]> = {}

      entries.forEach((entry) => {
        if (!grouped[entry.type]) {
          grouped[entry.type] = []
        }
        grouped[entry.type].push(entry)
      })

      // Sort each group by date (newest first)
      Object.keys(grouped).forEach((type) => {
        grouped[type].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      })

      setGroupedEntries(grouped)
      setLoading(false)
    }, 500)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { name: string; icon: string }> = {
      cv: { name: "Professional Profile", icon: "👤" },
      code: { name: "Code Repositories", icon: "📦" },
      // news: { name: "News Articles", icon: "📰" }, // COMMENTED OUT
      opinion: { name: "Opinion Pieces", icon: "💭" },
      podcast: { name: "Podcasts", icon: "🎧" },
      twitter: { name: "Twitter Posts", icon: "🐦" },
    }
    return typeMap[type] || { name: type.charAt(0).toUpperCase() + type.slice(1), icon: "📄" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
        <div className="text-center text-[#8b0000] py-5">
          Loading entries<span className="animate-pulse">_</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
      {/* Terminal Header */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6057] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-4 text-[#666666] text-sm">terminal — bash</div>
        </div>
        <div className="text-[#8b0000] mb-2">Fri Jun 06 2025 08:41 am ~/Documents/repos git:(master)±9</div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> ls -la repositories/
        </div>
      </div>

      {/* Content */}
      <div>
        {Object.keys(groupedEntries)
          .sort()
          .map((type) => {
            const typeInfo = getTypeInfo(type)
            const typeEntries = groupedEntries[type]

            return (
              <div key={type} className="mb-8 border border-[#cccccc] rounded-md overflow-hidden shadow-sm">
                {/* Type Header */}
                <div className="bg-[#e8e8d0] px-4 py-3 border-b border-[#cccccc]">
                  <span className="text-[#8b0000] text-lg font-bold">
                    {typeInfo.icon} {typeInfo.name}
                  </span>
                  <span className="text-[#666666] text-sm ml-2">({typeEntries.length} entries)</span>
                </div>

                {/* Entries List */}
                <div className="bg-[#f5f5dc]">
                  {typeEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 border-b border-[#e0e0d0] last:border-b-0 hover:bg-[#f0f0e0] transition-colors duration-200"
                    >
                      {/* Entry Header */}
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <a
                          href={entry.sourceUrl}
                          className="text-[#0000ff] font-bold text-lg hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.title}
                        </a>
                        <span className="text-[#8b0000] text-sm whitespace-nowrap">
                          {formatDate(entry.publishedDate)}
                        </span>
                      </div>

                      {/* Entry Description */}
                      <div className="text-[#333333] mb-2 leading-relaxed">{entry.description}</div>

                      {/* Entry Source */}
                      <div className="text-[#666666] text-sm">
                        Source:{" "}
                        <a
                          href={entry.sourceUrl}
                          className="text-[#006400] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.sourceTitle}
                        </a>
                        {entry.sourceDescription && ` - ${entry.sourceDescription}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
