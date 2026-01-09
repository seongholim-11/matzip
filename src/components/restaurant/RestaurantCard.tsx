"use client"

import { MapPin, Tv } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { getCategoryName } from "@/lib/constants/categories"
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
  return (
    <div
      className={`hover:bg-muted/50 cursor-pointer p-4 transition-colors ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        {/* 맛집 대표 이미지 (없으면 기본 아이콘 표시) */}
        <div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          {restaurant.thumbnail_url ? (
            <Image
              src={restaurant.thumbnail_url}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <MapPin className="text-muted-foreground h-6 w-6" />
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate font-semibold">{restaurant.name}</h3>
            {/* 방송 뱃지 - 추후 appearances 데이터 연결 */}
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              <Tv className="h-3 w-3" />
              방송
            </span>
          </div>

          <p className="text-muted-foreground mb-1 text-sm">
            {getCategoryName(restaurant.category)}
            {restaurant.price_range && ` · ${restaurant.price_range}`}
          </p>

          <p className="text-muted-foreground truncate text-xs">
            {restaurant.address}
          </p>
        </div>
      </div>

      {/* 카드가 선택되었을 때만 나타나는 추가 버튼 (상세보기, 길찾기) */}
      {isSelected && (
        <div className="mt-3 flex gap-2">
          <Link
            href={`/restaurant/${restaurant.id}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()} // 카드 자체의 클릭 이벤트가 실행되지 않게 막음
          >
            상세보기
          </Link>
          <a
            href={`https://map.naver.com/v5/directions/-/-/-/transit?c=${restaurant.longitude},${restaurant.latitude},15,0,0,0,dh`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-muted flex-1 rounded-lg border py-2 text-center text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            길찾기
          </a>
        </div>
      )}
    </div>
  )
}
