'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useViewMode } from '../contexts/view-mode-context';
import {
  syllabus,
  syllabusParts,
  getSyllabusStats,
  getSyllabusStatusLabel,
  formatMissingBookInfluences,
  type SyllabusReading,
} from '../data/syllabus';

export default function SyllabusPage() {
  const { viewMode } = useViewMode();
  const stats = getSyllabusStats();

  const readingLinks = (reading: SyllabusReading) =>
    [
      reading.url
        ? { href: reading.url, label: reading.urlLabel || 'Read online' }
        : null,
      reading.amazonUrl
        ? { href: reading.amazonUrl, label: 'Find on Amazon' }
        : null,
    ].filter(Boolean) as { href: string; label: string }[];

  // Marketer view
  if (viewMode === 'marketer') {
    return (
      <div className="min-h-screen bg-white marketer-view">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-10">
            <Link
              href="/#syllabus"
              className="inline-flex items-center gap-2 text-[#0052CC] hover:text-[#0065FF] mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to home</span>
            </Link>
            <h1 className="text-4xl font-bold text-[#172B4D] mb-4">
              {syllabus.title}
            </h1>
            <blockquote className="border-l-4 border-[#0052CC] pl-4 text-lg text-[#172B4D] italic mb-6">
              {syllabus.guidingQuestion}
            </blockquote>
            <p className="text-[#6B778C] leading-relaxed">{syllabus.purpose}</p>
          </div>

          {/* Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: stats.total, label: 'Readings' },
              { value: stats.parts, label: 'Parts' },
              { value: stats.read, label: 'Read' },
              { value: stats.pending, label: 'Queued' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#F4F5F7] rounded-lg px-3 py-4 text-center"
              >
                <div className="text-3xl font-bold text-[#0052CC] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#6B778C]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Lenses */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#172B4D] mb-4">Lenses</h2>
            <div className="flex flex-wrap gap-2">
              {syllabus.lenses.map((lens) => (
                <span
                  key={lens}
                  className="px-3 py-1 bg-[#DEEBFF] text-[#0052CC] text-sm font-medium rounded-md"
                >
                  {lens}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#172B4D] mb-4">
              Learning Goals
            </h2>
            <ol className="space-y-3">
              {syllabus.learningGoals.map((goal, index) => (
                <li key={goal} className="flex gap-3">
                  <span className="font-bold text-[#0052CC] flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-[#172B4D] leading-relaxed">{goal}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Central Questions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#172B4D] mb-4">
              Central Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {syllabus.centralQuestions.map((question) => (
                <div
                  key={question}
                  className="bg-[#F4F5F7] rounded-lg p-4 text-[#172B4D] leading-relaxed"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>

          {/* Reading List */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-[#0052CC]" />
              <h2 className="text-2xl font-bold text-[#172B4D]">
                Reading Syllabus
              </h2>
              <span className="text-sm text-[#6B778C]">
                ({stats.total} readings)
              </span>
            </div>

            <div className="space-y-10">
              {syllabusParts.map((part) => (
                <section key={part.id} id={part.id}>
                  <h3 className="text-xl font-bold text-[#172B4D] mb-1">
                    {part.label} — {part.title}
                  </h3>
                  <p className="text-sm text-[#6B778C] mb-4">{part.summary}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {part.readings.map((reading) => (
                      <div
                        key={reading.slug}
                        className="bg-[#F4F5F7] rounded-lg p-5 hover:shadow-lg transition-all border border-transparent hover:border-[#0052CC] relative"
                      >
                        <div
                          className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded ${
                            reading.status === 'reading'
                              ? 'bg-red-500 text-white'
                              : reading.status === 'read'
                              ? 'bg-[#00875A] text-white'
                              : 'bg-[#DFE1E6] text-[#42526E]'
                          }`}
                        >
                          {getSyllabusStatusLabel(reading.status)}
                        </div>
                        <div className="flex gap-4">
                          {reading.coverUrl && (
                            <img
                              src={reading.coverUrl}
                              alt={`${reading.title} cover`}
                              className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0 pr-20">
                            <h4 className="font-bold text-[#172B4D] mb-1 text-sm leading-tight">
                              {reading.title}
                            </h4>
                            <p className="text-[#6B778C] text-xs mb-2">
                              by {reading.author}
                              {reading.orderIndex
                                ? ` · #${reading.orderIndex} in reading order`
                                : ''}
                            </p>
                            {reading.note && (
                              <p className="text-[#333333] text-xs mb-3 leading-relaxed">
                                {reading.note}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4">
                              {readingLinks(reading).map((link) => (
                                <a
                                  key={link.href}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0052CC] text-xs hover:underline"
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Suggested Reading Order */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#172B4D] mb-4">
              Suggested Reading Order
            </h2>
            <ol className="grid md:grid-cols-2 gap-2">
              {syllabus.suggestedOrder.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-3 bg-[#F4F5F7] rounded-md px-4 py-2 text-[#172B4D] text-sm"
                >
                  <span className="font-bold text-[#0052CC]">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* The Missing Book */}
          <div className="bg-[#F4F5F7] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#172B4D] mb-4">
              The Missing Book
            </h2>
            <p className="text-[#172B4D] leading-relaxed mb-4">
              The book I suspect has not yet been written sits somewhere between{' '}
              {formatMissingBookInfluences()}. Its central question would be:
            </p>
            <blockquote className="border-l-4 border-[#0052CC] pl-4 text-lg font-medium text-[#172B4D] italic mb-4">
              {syllabus.missingBook.question}
            </blockquote>
            <ul className="space-y-1 mb-4">
              {syllabus.missingBook.progression.map((line) => (
                <li key={line} className="text-[#172B4D]">
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-[#6B778C] leading-relaxed">
              {syllabus.missingBook.closing}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Terminal view
  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#333333] font-mono p-5">
      {/* Terminal Header */}
      <div className="border border-[#cccccc] bg-[#e8e8d8] p-2 md:p-4 mb-5 rounded-md shadow-sm">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6057] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
          <div className="ml-4 text-[#666666] text-sm">terminal — bash</div>
        </div>
        <div className="text-[#333333] mb-1">
          <Link href="/#syllabus" className="text-[#0000ff] hover:underline">
            <span className="text-[#8b0000]">$</span> cd ../
          </Link>
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> cd syllabus/
        </div>
        <div className="text-[#333333] mb-1">
          <span className="text-[#8b0000]">$</span> cat README.md
        </div>
      </div>

      {/* Syllabus Header */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] text-2xl font-bold mb-3">
          🏛️ {syllabus.title}
        </div>
        <div className="border-l-4 border-[#8b0000] pl-3 mb-3 text-[#333333] italic">
          {syllabus.guidingQuestion}
        </div>
        <div className="text-[#333333] text-sm leading-relaxed mb-3">
          {syllabus.purpose}
        </div>
        <div className="flex flex-wrap gap-2">
          {syllabus.lenses.map((lens) => (
            <span
              key={lens}
              className="text-xs bg-[#e0e0d0] text-[#666666] px-2 py-1 rounded border"
            >
              #{lens.toLowerCase().replace(/\s+/g, '-')}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">Progress</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-[#666666]">total:</span>{' '}
            <span className="font-bold">{stats.total}</span>
          </div>
          <div>
            <span className="text-[#666666]">parts:</span>{' '}
            <span className="font-bold">{stats.parts}</span>
          </div>
          <div>
            <span className="text-[#666666]">read:</span>{' '}
            <span className="font-bold">{stats.read}</span>
          </div>
          <div>
            <span className="text-[#666666]">queued:</span>{' '}
            <span className="font-bold">{stats.pending}</span>
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">Learning Goals</div>
        <ol className="space-y-2 text-sm">
          {syllabus.learningGoals.map((goal, index) => (
            <li key={goal} className="flex gap-2">
              <span className="text-[#8b0000] font-bold">{index + 1}.</span>
              <span className="leading-relaxed">{goal}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Central Questions */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">Central Questions</div>
        <ul className="space-y-2 text-sm">
          {syllabus.centralQuestions.map((question) => (
            <li key={question} className="flex gap-2">
              <span className="text-[#8b0000]">&gt;</span>
              <span className="leading-relaxed">{question}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reading List */}
      {syllabusParts.map((part) => (
        <div
          key={part.id}
          id={part.id}
          className="mb-8 border border-[#cccccc] rounded-md overflow-hidden shadow-sm"
        >
          <div className="bg-[#e8e8d0] px-4 py-3 border-b border-[#cccccc]">
            <span className="text-[#8b0000] text-lg font-bold">
              {part.label} — {part.title}
            </span>
            <span className="text-[#666666] text-sm ml-2">
              ({part.readings.length}{' '}
              {part.readings.length === 1 ? 'reading' : 'readings'})
            </span>
          </div>
          <div className="bg-[#f5f5dc] p-4">
            <p className="text-[#666666] text-xs mb-4 leading-relaxed">
              {part.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {part.readings.map((reading) => (
                <div
                  key={reading.slug}
                  className="border border-[#cccccc] rounded-lg p-3 bg-[#fafafa] hover:bg-[#f0f0f0] transition-colors relative"
                >
                  <div
                    className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                      reading.status === 'reading'
                        ? 'bg-[#ff0000] text-white'
                        : reading.status === 'read'
                        ? 'bg-[#2e7d32] text-white'
                        : 'bg-[#e0e0d0] text-[#666666]'
                    }`}
                  >
                    {getSyllabusStatusLabel(reading.status)}
                  </div>
                  <div className="flex gap-4">
                    {reading.coverUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={reading.coverUrl}
                          alt={`${reading.title} cover`}
                          className="w-16 h-24 object-cover rounded shadow-sm"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-20">
                      <h4 className="font-bold text-[#333333] mb-1 text-sm leading-tight">
                        {reading.title}
                      </h4>
                      <p className="text-[#666666] text-xs mb-2">
                        by {reading.author}
                        {reading.orderIndex
                          ? ` · #${reading.orderIndex} in reading order`
                          : ''}
                      </p>
                      {reading.note && (
                        <p className="text-[#333333] text-xs mb-2 leading-relaxed">
                          {reading.note}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4">
                        {readingLinks(reading).map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0000ff] text-xs hover:underline"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Suggested Reading Order */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">
          Suggested Reading Order
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
          {syllabus.suggestedOrder.map((item, index) => (
            <li key={item} className="flex gap-2">
              <span className="text-[#8b0000] font-bold">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* The Missing Book */}
      <div className="border border-[#cccccc] bg-[#f0f0e0] p-4 mb-5 rounded-md shadow-sm">
        <div className="text-[#8b0000] font-bold mb-3">The Missing Book</div>
        <p className="text-sm text-[#333333] mb-3 leading-relaxed">
          The book I suspect has not yet been written sits somewhere between{' '}
          {formatMissingBookInfluences()}. Its central question would be:
        </p>
        <div className="border-l-4 border-[#8b0000] pl-3 mb-3 text-[#333333] italic font-bold">
          {syllabus.missingBook.question}
        </div>
        <ul className="text-sm text-[#333333] space-y-1 mb-3">
          {syllabus.missingBook.progression.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-sm text-[#666666] leading-relaxed">
          {syllabus.missingBook.closing}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[#666666] text-sm">
        <Link href="/#syllabus" className="text-[#0000ff] hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
