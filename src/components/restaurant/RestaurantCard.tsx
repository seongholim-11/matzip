"use client"

import { Search } from "lucide-react"

import type { Restaurant } from "@/types/model"

import { RestaurantInfoContent } from "./RestaurantInfoContent"

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
  return (
    <div
      className={`hover:bg-muted/50 cursor-pointer p-4 transition-colors ${
        isSelected ? "bg-muted font-bold" : ""
      }`}
      onClick={onClick}
    >
      <RestaurantInfoContent restaurant={restaurant} isCompact={true} />

      {/* 카드가 선택되었을 때만 나타나는 버튼 (네이버 지도) */}

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
