"use client"

import { useEffect, useState } from "react"

type MediaQuery =
  | "(min-width: 768px)"
  | "(min-width: 1024px)"
  | "(min-width: 1280px)"

export function useMediaQuery(query: MediaQuery): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return matches
}

// 편의 훅들
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px)")
}

export function useIsMobile() {
  const isTablet = useMediaQuery("(min-width: 768px)")
  return !isTablet
}
