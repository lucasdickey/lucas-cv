'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ViewMode = 'terminal' | 'marketer'

interface ViewModeContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

const STORAGE_KEY = 'viewMode'
/** `?theme=terminal` / `?theme=marketer`, so either presentation is linkable. */
const PARAM = 'theme'
const DEFAULT_MODE: ViewMode = 'terminal'

const isViewMode = (value: unknown): value is ViewMode =>
  value === 'terminal' || value === 'marketer'

/**
 * Keeps the URL in step with the chosen presentation.
 *
 * The default is left out of the query string so ordinary browsing keeps clean
 * URLs, and `replaceState` is used rather than `pushState` so switching
 * presentation does not fill up the back button.
 */
function writeToUrl(mode: ViewMode) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (mode === DEFAULT_MODE) {
    url.searchParams.delete(PARAM)
  } else {
    url.searchParams.set(PARAM, mode)
  }
  window.history.replaceState(null, '', url)
}

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>(DEFAULT_MODE)
  const [mounted, setMounted] = useState(false)

  // A `?theme=` in the URL wins over the stored preference, so a shared link
  // opens in the presentation it promises even for someone who has previously
  // chosen the other one. Absent the parameter, the stored preference holds.
  useEffect(() => {
    setMounted(true)

    const fromUrl = new URLSearchParams(window.location.search).get(PARAM)
    if (isViewMode(fromUrl)) {
      // Deliberately not written to storage. ViewModeToggle currently renders
      // null, so there is no UI to switch presentation: if a link could
      // overwrite the stored preference it would strand the visitor in the
      // other presentation site-wide with no way back except knowing the
      // parameter. The link governs the page it is on; it does not redecorate
      // the site. Re-enable the toggle and persisting this becomes safe.
      setViewModeState(fromUrl)
      return
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (isViewMode(saved)) setViewModeState(saved)
    } catch {
      // Private browsing and blocked storage both land here; the default holds.
    }
  }, [])

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Preference will not persist; the presentation still switches.
    }
    writeToUrl(mode)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'terminal' ? 'marketer' : 'terminal')
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
