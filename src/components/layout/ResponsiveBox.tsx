"use client"

import { useIsDesktop } from "@/hooks/useMediaQuery"

interface ResponsiveBoxProps {
  desktop: React.ReactNode
  mobile: React.ReactNode
}

/**
 * 화면 크기(폭)에 따라서 데스크탑용 UI나 모바일용 UI를 골라서 보여주는 박스입니다.
 */
export function ResponsiveBox({ desktop, mobile }: ResponsiveBoxProps) {
  const isDesktop = useIsDesktop()

  return <>{isDesktop ? desktop : mobile}</>
}
