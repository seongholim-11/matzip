"use client"

import React, { useCallback, useState } from "react"

import { Check, Copy, Link2, X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ShareModalInternalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  url,
}: ShareModalInternalProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드 API 실패 시 fallback
      const textarea = document.createElement("textarea")
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [url])

  const shareKakao = useCallback(() => {
    // 카카오톡 공유 API (SDK 초기화 필요)
    if (typeof window !== "undefined" && window.Kakao?.Link) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: title,
          description: "방송에 소개된 맛집을 확인해보세요!",
          imageUrl: "", // 기본 이미지 URL
          link: {
            webUrl: url,
            mobileWebUrl: url,
          },
        },
        buttons: [
          {
            title: "자세히 보기",
            link: {
              webUrl: url,
              mobileWebUrl: url,
            },
          },
        ],
      })
    }
  }, [title, url])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="bg-background relative z-10 mx-4 w-full max-w-sm rounded-2xl p-6 shadow-xl">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">공유하기</h2>
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-full p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 공유 링크 */}
        <div className="bg-muted mb-6 flex items-center gap-2 rounded-lg p-3">
          <Link2 className="text-muted-foreground h-5 w-5 shrink-0" />
          <span className="min-w-0 flex-1 truncate text-sm">{url}</span>
        </div>

        {/* 공유 버튼들 */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={copyToClipboard} variant="outline" className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                링크 복사
              </>
            )}
          </Button>
          <Button
            onClick={shareKakao}
            className="gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FDD835]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.525 2 10.875c0 2.7 1.75 5.07 4.375 6.475-.188.7-.69 2.55-.79 2.95-.12.5.18.49.38.36.16-.11 2.5-1.7 3.5-2.38.83.13 1.68.2 2.53.2 5.523 0 10-3.525 10-7.875S17.523 3 12 3z" />
            </svg>
            카카오톡
          </Button>
        </div>
      </div>
    </div>
  )
}

// Kakao SDK 타입 선언
declare global {
  interface Window {
    Kakao?: {
      Link: {
        sendDefault: (options: unknown) => void
      }
    }
  }
}
