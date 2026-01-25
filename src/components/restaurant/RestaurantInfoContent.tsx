"use client"

import { getCategoryName } from "@/lib/constants/categories"
import { getMarkerColor } from "@/lib/constants/colors"
import type { Restaurant } from "@/types/model"

interface RestaurantInfoContentProps {
  restaurant: Restaurant
  isCompact?: boolean
}

/**
 * 식당의 핵심 정보(이름, 방송정보, 카테고리, 주소 등)를 렌더링하는 공통 컴포넌트입니다.
 * 사이드바 리스트와 지도의 팝업 카드에서 동일한 스타일을 보장합니다.
 */
export function RestaurantInfoContent({
  restaurant,
  isCompact = false,
}: RestaurantInfoContentProps) {
  // 첫 번째 프로그램 정보 가져오기
  const appearance = restaurant.recommendations?.[0]
  const programName = appearance?.source?.name
  const markerColor = getMarkerColor(programName)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h3
            className={`truncate font-bold tracking-tight ${isCompact ? "text-base" : "text-lg"}`}
          >
            {restaurant.name}
          </h3>
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
            {getCategoryName(restaurant.category)}
          </span>
        </div>

        {/* 프로그램 정보 표시 (핀 색상과 일치) */}
        {programName && (
          <span
            className="truncate text-[11px] font-semibold"
            style={{ color: markerColor }}
          >
            {programName}
          </span>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        {restaurant.price_range && `${restaurant.price_range} · `}
        {restaurant.address}
      </p>
    </div>
  )
}
