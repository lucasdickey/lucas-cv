'use client'

import { useViewMode } from '../contexts/view-mode-context'
import { Terminal, Briefcase } from 'lucide-react'

export default function ViewModeToggle() {
  const { viewMode, toggleViewMode } = useViewMode()

  // Hidden for now - keeping code intact for future use
  return null;

  return (
    <button
      onClick={toggleViewMode}
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 border ${
        viewMode === 'marketer'
          ? 'bg-[#f5f5dc] border-[#cccccc] hover:bg-[#e8e8d8]'
          : 'bg-white border-[#DFE1E6] hover:bg-[#F4F5F7]'
      }`}
      aria-label={`Switch to ${viewMode === 'terminal' ? 'marketer' : 'terminal'} view`}
      title={`Switch to ${viewMode === 'terminal' ? 'marketer' : 'terminal'} view`}
    >
      {viewMode === 'terminal' ? (
        <>
          <Briefcase className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#172B4D]">Marketer View</span>
        </>
      ) : (
        <>
          <Terminal className="w-4 h-4 text-[#8b0000]" />
          <span className="text-sm font-medium text-[#8b0000]">Terminal View</span>
        </>
      )}
    </button>
  )
}

