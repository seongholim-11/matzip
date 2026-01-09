"use client"

import { MapPin, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { getCategoryName } from "@/lib/constants/categories"
import type { Restaurant } from "@/types/model"

interface OverlayCardProps {
  restaurant: Restaurant
  onClose: () => void
}

/**
 * 지도 위 마커를 클릭했을 때 해당 위치에 작게 나타나는 요약 정보 카드입니다.
 */
export function OverlayCard({ restaurant, onClose }: OverlayCardProps) {
  return (
    <div className="bg-background absolute bottom-20 left-1/2 z-20 w-[280px] -translate-x-1/2 overflow-hidden rounded-xl border shadow-xl lg:bottom-24 lg:w-[320px]">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
      >
        <X className="h-4 w-4" />
      </button>

      <Link href={`/restaurant/${restaurant.id}`}>
        {/* 맛집 이미지 (없을 땐 핀 아이콘 표시) */}
        <div className="bg-muted relative h-32 w-full lg:h-40">
          {restaurant.thumbnail_url ? (
            <Image
              src={restaurant.thumbnail_url}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="320px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <MapPin className="text-muted-foreground h-8 w-8" />
            </div>
          )}
        </div>

        {/* 짧은 정보 (이름, 카테고리, 주소) */}
        <div className="p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
              {getCategoryName(restaurant.category)}
            </span>
            {restaurant.price_range && (
              <span className="text-muted-foreground text-xs">
                {restaurant.price_range}
              </span>
            )}
          </div>
          <h3 className="mb-1 font-bold">{restaurant.name}</h3>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {restaurant.address}
          </p>
        </div>
      </Link>
    </div>
  )
}
