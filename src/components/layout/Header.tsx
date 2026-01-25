"use client"

import { Search, Tv } from "lucide-react"
import Link from "next/link"

import { useIsMobile } from "@/hooks/useMediaQuery"
import { useUIStore } from "@/store/uiStore"

/**
 * 앱의 상단 헤더 컴포넌트입니다.
 * 로고, 검색바(데스크탑/모바일), 네비게이션 버튼들을 포함합니다.
 */
export function Header() {
  const isMobile = useIsMobile()
  const { setSearchFocused } = useUIStore()

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* 왼쪽: 로고 및 서비스 이름 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <Tv className="h-4 w-4 text-white" />
          </div>
          {!isMobile && (
            <span className="text-lg font-bold">방송 맛집 지도</span>
          )}
        </Link>

        {/* 중간: 검색바 (데스크탑 화면에서만 보임) */}
        {!isMobile && (
          <div className="mx-4 flex max-w-md flex-1">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="맛집, 지역, 프로그램 검색..."
                className="bg-muted/50 focus:border-primary focus:bg-background h-10 w-full rounded-full border pr-4 pl-10 text-sm transition-colors focus:outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        )}

        <div className="flex w-10 items-center justify-end" />
      </div>

      {/* 모바일 하단 검색바 (핸드폰 화면에서만 로고 아래에 나타남) */}
      {isMobile && (
        <div className="border-t px-4 py-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="맛집, 지역, 프로그램 검색..."
              className="bg-muted/50 focus:border-primary focus:bg-background h-10 w-full rounded-full border pr-4 pl-10 text-sm transition-colors focus:outline-none"
            />
          </div>
        </div>
      )}
    </header>
  )
}
