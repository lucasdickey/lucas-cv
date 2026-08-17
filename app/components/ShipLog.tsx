"use client";

import { ExternalLink, Github } from "lucide-react";
import { shipLog, type ShipLogProject } from "../data/shipLog";
import { ExpandableSection } from "./ExpandableSection";

/**
 * "The Last 90 Days" — renders the rolling build log in either the terminal
 * or the marketer theme. Data lives in `app/data/shipLog.ts`; only projects
 * with a public, un-gated deployment carry a live link.
 */

// Pinned to UTC: these dates are rendered on the server and hydrated on the
// client, and a viewer east or west of the server would otherwise format the
// same ISO date differently and trip a hydration mismatch.
const formatRange = (project: ShipLogProject) => {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  const start = new Date(project.firstCommit).toLocaleDateString("en-US", opts);
  const end = new Date(project.lastCommit).toLocaleDateString("en-US", opts);
  return start === end ? start : `${start} – ${end}`;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function TerminalProject({ project }: { project: ShipLogProject }) {
  return (
    <div className="p-4 border-b border-[#e0e0d0] last:border-b-0 hover:bg-[#f0f0e0] transition-colors duration-200">
      <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
        <div className="text-[#0000ff] font-bold text-lg">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.name}
            </a>
          ) : (
            <span className="text-[#333333]">{project.name}</span>
          )}
          {project.liveUrl && (
            <span className="ml-2 align-middle text-[10px] font-normal uppercase tracking-wide bg-[#28ca41] text-[#14471f] px-1.5 py-0.5 rounded">
              live
            </span>
          )}
        </div>
        <span className="text-[#8b0000] text-sm whitespace-nowrap">
          {plural(project.commits, "commit")} · {formatRange(project)}
        </span>
      </div>

      <div className="text-[#666666] text-sm italic mb-2">
        {project.tagline}
      </div>

      <div className="text-[#333333] mb-3 leading-relaxed">
        {project.summary}
      </div>

      <ul className="mb-3 space-y-1.5">
        {project.bullets.map((bullet, i) => (
          <li key={i} className="text-[#333333] text-sm leading-relaxed flex">
            <span className="text-[#8b0000] mr-2 select-none">▸</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0000ff] hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink size={13} /> Open it
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0000ff] hover:underline inline-flex items-center gap-1"
          >
            <Github size={13} /> Source
          </a>
        )}
        {project.extraLinks?.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0000ff] hover:underline text-xs"
          >
            {link.label} →
          </a>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[#e0e0d0] text-[#666666] px-2 py-1 rounded border"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function MarketerProject({ project }: { project: ShipLogProject }) {
  return (
    <div className="bg-[#F4F5F7] rounded-lg p-6 border border-transparent hover:border-[#0052CC] hover:shadow-lg transition-all flex flex-col">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-semibold text-[#172B4D] text-lg">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0052CC] hover:underline"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        {project.liveUrl && (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide bg-[#E3FCEF] text-[#006644] px-2 py-1 rounded">
            Live
          </span>
        )}
      </div>

      <div className="text-xs text-[#6B778C] mb-3">
        {plural(project.commits, "commit")} · {formatRange(project)}
      </div>

      <p className="text-sm text-[#172B4D] font-medium mb-3 leading-relaxed">
        {project.summary}
      </p>

      <ul className="space-y-2 mb-4 flex-1">
        {project.bullets.map((bullet, i) => (
          <li key={i} className="text-sm text-[#6B778C] leading-relaxed flex">
            <span className="text-[#0052CC] mr-2 select-none">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0052CC] font-medium hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" /> Open it
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0052CC] font-medium hover:underline inline-flex items-center gap-1"
          >
            <Github className="w-4 h-4" /> Source
          </a>
        )}
      </div>

      {project.extraLinks && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          {project.extraLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0052CC] hover:underline"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[#DEEBFF] text-[#0052CC] px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ShipLog({
  variant = "terminal",
}: {
  variant?: "terminal" | "marketer";
}) {
  if (variant === "marketer") {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {shipLog.map((project) => (
          <MarketerProject key={project.name} project={project} />
        ))}
      </div>
    );
  }

  return (
    <ExpandableSection
      maxRows={3}
      rowHeight={280}
      expandLabel="Show all 12 projects"
      collapseLabel="Collapse"
    >
      {shipLog.map((project) => (
        <TerminalProject key={project.name} project={project} />
      ))}
    </ExpandableSection>
  );
}
