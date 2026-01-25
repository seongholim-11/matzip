import { Navigation, X } from "lucide-react"

import { RestaurantInfoContent } from "@/components/restaurant/RestaurantInfoContent"
import type { Restaurant } from "@/types/model"

interface OverlayCardProps {
  restaurant: Restaurant
  onClose: () => void
}

/**
 * 지도 위 마커를 클릭했을 때 하단에 나타나는 요약 정보 카드입니다.
 * 데스크탑에서는 중앙 하단에 떠 있고, 모바일에서는 하단에 밀착되어 나타납니다.
 */
export function OverlayCard({ restaurant, onClose }: OverlayCardProps) {
  return (
    <div className="bg-background animate-in slide-in-from-bottom-full fixed right-4 bottom-4 left-4 z-40 overflow-hidden rounded-2xl border shadow-2xl duration-300 lg:absolute lg:right-auto lg:bottom-10 lg:left-1/2 lg:w-[360px] lg:-translate-x-1/2">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-black/40 lg:bg-black/50 lg:hover:bg-black/70"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col">
        {/* 짧은 정보 (이름, 카테고리, 주소) */}
        <div className="flex flex-1 flex-col justify-center p-5 lg:justify-start">
          <RestaurantInfoContent restaurant={restaurant} />

          <div className="mt-4 flex gap-2">
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(restaurant.name + " " + restaurant.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted hover:bg-muted/80 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors"
            >
              <Navigation className="h-4 w-4 text-blue-500" />
              네이버 지도 열기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
