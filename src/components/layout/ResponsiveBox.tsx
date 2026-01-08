"use client"

import { useIsDesktop } from "@/hooks/useMediaQuery"

interface ResponsiveBoxProps {
  desktop: React.ReactNode
  mobile: React.ReactNode
}

export function ResponsiveBox({ desktop, mobile }: ResponsiveBoxProps) {
  const isDesktop = useIsDesktop()

  return <>{isDesktop ? desktop : mobile}</>
}
