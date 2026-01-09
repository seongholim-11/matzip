"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ShareModal } from "@/components/common/ShareModal"
import { useUIStore } from "@/store/uiStore"

import "./globals.css"

/**
 * 앱에 필요한 설정들을 감싸주는 컴포넌트입니다.
 * React Query 같은 상태 관리 도구를 초기화합니다.
 */
function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 데이터가 신선하다고 간주하는 시간 (1분)
            refetchOnWindowFocus: false, // 창을 다시 클릭했을 때 자동 업데이트 끄기
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

/**
 * 앱 어디서든 띄워야 하는 공통 모달(팝업)들을 모아놓은 곳입니다.
 * '공유하기' 모달 등이 여기서 관리됩니다.
 */
function GlobalModals() {
  const { isShareModalOpen, shareModalData, closeShareModal } = useUIStore()

  return (
    <ShareModal
      isOpen={isShareModalOpen}
      onClose={closeShareModal}
      title={shareModalData?.title ?? ""}
      url={shareModalData?.url ?? ""}
    />
  )
}

/**
 * 앱 전체의 기본 뼈대가 되는 레이아웃 파일입니다.
 * 모든 페이지는 이 레이아웃 안의 {children} 부분에 나타나게 됩니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 브라우저 상단 탭에 보일 제목과 설명 (SEO - 검색 엔진 최적화용) */}
        <title>방송 맛집 지도 - TV와 유튜브 맛집을 한눈에</title>
        <meta
          name="description"
          content="TV 프로그램과 유튜브에 소개된 맛집들을 지도에서 찾아보세요. 성시경의 먹을텐데, 맛있는 녀석들, 풍자 또간집 등 인기 프로그램의 맛집 정보를 한눈에!"
        />
        {/* SNS에 공유했을 때 보이는 미리보기 정보 (오픈 그래프) */}
        <meta property="og:title" content="방송 맛집 지도" />
        <meta
          property="og:description"
          content="TV와 유튜브에 소개된 맛집을 지도에서 탐색하세요"
        />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-dvh overflow-hidden">
        {/* Providers로 감싸서 앱 전체에서 React Query 등을 쓸 수 있게 함 */}
        <Providers>
          {children}
          {/* 공통 팝업창 관리 */}
          <GlobalModals />
        </Providers>
      </body>
    </html>
  )
}
