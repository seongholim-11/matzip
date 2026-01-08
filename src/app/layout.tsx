"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ShareModal } from "@/components/common/ShareModal"
import { useUIStore } from "@/store/uiStore"

import "./globals.css"

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <title>방송 맛집 지도 - TV와 유튜브 맛집을 한눈에</title>
        <meta
          name="description"
          content="TV 프로그램과 유튜브에 소개된 맛집들을 지도에서 찾아보세요. 성시경의 먹을텐데, 맛있는 녀석들, 풍자 또간집 등 인기 프로그램의 맛집 정보를 한눈에!"
        />
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
        <Providers>
          {children}
          <GlobalModals />
        </Providers>
      </body>
    </html>
  )
}
