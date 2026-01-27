"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ShareModal } from "@/components/common/ShareModal"
import { useUIStore } from "@/store/uiStore"

/**
 * 앱에 필요한 설정들을 감싸주는 컴포넌트입니다.
 * React Query 같은 상태 관리 도구를 초기화합니다.
 */
export function Providers({ children }: { children: React.ReactNode }) {
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
    <QueryClientProvider client={queryClient}>
      {children}
      <GlobalModals />
    </QueryClientProvider>
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
