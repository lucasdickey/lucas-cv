interface SyllabusPartIconProps {
  partId: string;
  className?: string;
}

/**
 * A thematic line icon per syllabus part. Strokes use currentColor so the same
 * icon works in the terminal and marketer palettes.
 */
export default function SyllabusPartIcon({
  partId,
  className = 'w-6 h-6',
}: SyllabusPartIconProps) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };

  switch (partId) {
    // Civilization & History — a classical portico: the institution itself
    case 'civilization-history':
      return (
        <svg {...common}>
          <path d="M3 9 12 3.5 21 9" />
          <path d="M4.5 9v9M9.5 9v9M14.5 9v9M19.5 9v9" />
          <path d="M2.5 18h19M4 21h16" />
        </svg>
      );

    // Media & Cognition — a broadcast signal radiating from a point
    case 'media-cognition':
      return (
        <svg {...common}>
          <circle cx="12" cy="12.5" r="1.8" />
          <path d="M9.4 10.2a3.4 3.4 0 0 0 0 4.6" />
          <path d="M14.6 10.2a3.4 3.4 0 0 1 0 4.6" />
          <path d="M7 7.6a7.2 7.2 0 0 0 0 9.8" />
          <path d="M17 7.6a7.2 7.2 0 0 1 0 9.8" />
        </svg>
      );

    // Economics & Institutions — output over time
    case 'economics-institutions':
      return (
        <svg {...common}>
          <path d="M4 3.5v17h16" />
          <path d="M7.5 15.5 11 11l3 2.5L19.5 7" />
          <path d="M16 7h3.5v3.5" />
        </svg>
      );

    // Networks, States & Power — hub and nodes
    case 'networks-states-power':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.4" />
          <circle cx="5" cy="5.5" r="1.9" />
          <circle cx="19" cy="5.5" r="1.9" />
          <circle cx="5" cy="18.5" r="1.9" />
          <circle cx="19" cy="18.5" r="1.9" />
          <path d="M6.4 6.9 10.3 10.4M17.6 6.9 13.7 10.4M6.4 17.1l3.9-3.5M17.6 17.1l-3.9-3.5" />
        </svg>
      );

    // AI Futures — compute, with pins out to everything else
    case 'ai-futures':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="8" height="8" rx="1.2" />
          <path d="M10.5 8V4.5M13.5 8V4.5M10.5 16v3.5M13.5 16v3.5" />
          <path d="M8 10.5H4.5M8 13.5H4.5M16 10.5h3.5M16 13.5h3.5" />
        </svg>
      );

    // Ethics, Society & Governance — the scales
    case 'ethics-society-governance':
      return (
        <svg {...common}>
          <path d="M12 4.5V20M8.5 20h7" />
          <path d="M4 8h16" />
          <path d="M4 8v3.5M20 8v3.5" />
          <path d="M1.6 11.5 4 15l2.4-3.5" />
          <path d="M17.6 11.5 20 15l2.4-3.5" />
        </svg>
      );

    // Information & Civilization — the whole networked globe
    case 'information-civilization':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <ellipse cx="12" cy="12" rx="4" ry="8.5" />
          <path d="M3.7 12h16.6" />
          <path d="M5.2 7.5h13.6M5.2 16.5h13.6" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <path d="M5 4.5h11l3 3v12H5z" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      );
  }
}
