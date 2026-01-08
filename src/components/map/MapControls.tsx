"use client"

import { Crosshair, Minus, Plus } from "lucide-react"

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onMyLocation: () => void
  isLocating?: boolean
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onMyLocation,
  isLocating,
}: MapControlsProps) {
  return (
    <div className="absolute right-4 bottom-6 z-10 flex flex-col gap-2">
      {/* 줌 컨트롤 */}
      <div className="bg-background flex flex-col overflow-hidden rounded-lg border shadow-lg">
        <button
          onClick={onZoomIn}
          className="hover:bg-muted flex h-10 w-10 items-center justify-center transition-colors"
          aria-label="확대"
        >
          <Plus className="h-5 w-5" />
        </button>
        <div className="bg-border h-px" />
        <button
          onClick={onZoomOut}
          className="hover:bg-muted flex h-10 w-10 items-center justify-center transition-colors"
          aria-label="축소"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>

      {/* 내 위치 버튼 */}
      <button
        onClick={onMyLocation}
        disabled={isLocating}
        className="bg-background hover:bg-muted flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition-colors disabled:opacity-50"
        aria-label="내 위치로 이동"
      >
        <Crosshair className={`h-5 w-5 ${isLocating ? "animate-pulse" : ""}`} />
      </button>
    </div>
  )
}
