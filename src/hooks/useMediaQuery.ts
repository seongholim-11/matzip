"use client"

import { useEffect, useState } from "react"

type MediaQuery =
  | "(min-width: 768px)"
  | "(min-width: 1024px)"
  | "(min-width: 1280px)"

/**
 * 화면 크기가 바뀔 때마다(CSS의 Media Query처럼) 현재 크기가 조건에 맞는지 확인하는 훅입니다.
 */
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
/** 현재 화면이 1024px보다 큰 '데스크탑'인지 확인합니다. */
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
