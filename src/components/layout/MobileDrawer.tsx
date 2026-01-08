"use client"

import { useEffect, useRef } from "react"

import { X } from "lucide-react"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  title,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  // 드래그 핸들링
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY
    const diff = currentY.current - startY.current

    if (drawerRef.current && diff > 0) {
      drawerRef.current.style.transform = `translateY(${diff}px)`
    }
  }

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current

    if (drawerRef.current) {
      if (diff > 100) {
        onClose()
      }
      drawerRef.current.style.transform = ""
    }
  }

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 드로어 */}
      <div
        ref={drawerRef}
        className="bg-background absolute inset-x-0 bottom-0 rounded-t-2xl shadow-xl transition-transform duration-300"
        style={{ maxHeight: "85vh" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center py-3">
          <div className="bg-muted-foreground/30 h-1.5 w-12 rounded-full" />
        </div>

        {/* 헤더 */}
        {title && (
          <div className="flex items-center justify-between border-b px-4 pb-3">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="hover:bg-muted rounded-full p-1.5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* 콘텐츠 */}
        <div
          className="overflow-y-auto p-4"
          style={{ maxHeight: "calc(85vh - 80px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
