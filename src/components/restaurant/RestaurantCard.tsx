"use client"

import { MapPin, Search } from "lucide-react"

import { getCategoryName } from "@/lib/constants/categories"
import { getMarkerColor } from "@/lib/constants/colors"
import type { Restaurant } from "@/types/model"

interface RestaurantCardProps {
  restaurant: Restaurant
  isSelected?: boolean
  onClick?: () => void
}

/**
 * 맛집 목록이나 검색 결과에서 한 개의 맛집을 보여주는 카드형 컴포넌트입니다.
 */
export function RestaurantCard({
  restaurant,
  isSelected,
  onClick,
}: RestaurantCardProps) {
  // 첫 번째 프로그램 정보 가져오기
  const appearance = restaurant.recommendations?.[0]
  const programName = appearance?.source?.name
  const markerColor = getMarkerColor(programName)

  return (
    <div
      className={`hover:bg-muted/50 cursor-pointer p-4 transition-colors ${
        isSelected ? "bg-muted font-bold" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-0.5">
            <h3 className="truncate text-base leading-tight font-bold">
              {restaurant.name}
            </h3>
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

          <p className="text-muted-foreground mt-1 text-xs">
            {getCategoryName(restaurant.category)}
            {restaurant.price_range && ` · ${restaurant.price_range}`}
          </p>

          <p className="text-muted-foreground truncate text-[11px]">
            {restaurant.address}
          </p>
        </div>
      </div>

      {/* 카드가 선택되었을 때만 나타나는 버튼 (네이버 지도) */}
      {isSelected && (
        <div className="mt-3">
          <a
            href={`https://map.naver.com/v5/search/${encodeURIComponent(restaurant.name + " " + restaurant.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <Search className="h-4 w-4 text-green-500" />
            네이버 지도 열기
          </a>
        </div>
      )}
    </div>
  )
}
