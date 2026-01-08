"use client"

import { Map, Menu, Search, Tv, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/useMediaQuery"
import { useUIStore } from "@/store/uiStore"

export function Header() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { isSearchFocused, setSearchFocused } = useUIStore()

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <Tv className="h-4 w-4 text-white" />
          </div>
          {!isMobile && (
            <span className="text-lg font-bold">방송 맛집 지도</span>
          )}
        </Link>

        {/* 검색바 (데스크탑) */}
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

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Map className="h-4 w-4" />
              {!isMobile && <span>지도</span>}
            </Button>
          </Link>
          <Link href="/program">
            <Button
              variant={pathname.startsWith("/program") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Tv className="h-4 w-4" />
              {!isMobile && <span>프로그램</span>}
            </Button>
          </Link>
        </nav>
      </div>

      {/* 모바일 검색바 */}
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
