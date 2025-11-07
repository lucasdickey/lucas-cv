'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ViewMode = 'terminal' | 'marketer'

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('terminal')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load from localStorage on mount
    const saved = localStorage.getItem('viewMode') as ViewMode
    if (saved === 'terminal' || saved === 'marketer') {
      setViewModeState(saved)
    }
  }, [])

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    if (mounted) {
      localStorage.setItem('viewMode', mode)
    }
  }

  const toggleViewMode = () => {
    const newMode = viewMode === 'terminal' ? 'marketer' : 'terminal'
    setViewMode(newMode)
  }

  // Always provide the context, even before mounted, to prevent the error
  // The context will use the default 'terminal' value until localStorage loads
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider')
  }
  return context
}

