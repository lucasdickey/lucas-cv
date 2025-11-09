'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableSectionProps {
  children: React.ReactNode;
  maxRows: number;
  rowHeight?: number;
  className?: string;
  expandLabel?: string;
  collapseLabel?: string;
}

export function ExpandableSection({
  children,
  maxRows,
  rowHeight = 120,
  className,
  expandLabel = 'Click to expand',
  collapseLabel = 'Click to collapse',
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxHeight = maxRows * rowHeight;

  return (
    <div className={className}>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          !isExpanded && 'relative'
        )}
        style={!isExpanded ? { maxHeight: `${maxHeight}px` } : { maxHeight: 'none' }}
      >
        {children}

        {/* Gradient fade effect when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-[#f5f5dc] pointer-events-none"></div>
        )}
      </div>

      {/* Expand/Collapse button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center gap-2 text-[#0000ff] hover:underline text-sm font-medium transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp size={16} />
            {collapseLabel}
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            {expandLabel}
          </>
        )}
      </button>
    </div>
  );
}
