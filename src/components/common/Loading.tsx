"use client"

import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

/**
 * 데이터를 불러오는 동안 보여주는 로딩 스피너(빙글빙글 도는 아이콘) 컴포넌트입니다.
 */
export function Loading({ size = "md", text }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizeMap[size]} text-primary animate-spin`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}

/**
 * 화면 전체를 덮는 로딩 화면입니다. 페이지 전체를 불러올 때 사용합니다.
 */
export function FullPageLoading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <Loading size="lg" text="로딩 중..." />
    </div>
  )
}
