"use client"

import { MapPinned, Navigation, Phone, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store/uiStore"
import type { Restaurant } from "@/types/model"

interface ActionButtonsProps {
  restaurant: Restaurant
}

export function ActionButtons({ restaurant }: ActionButtonsProps) {
  const { openShareModal } = useUIStore()

  const handleShare = () => {
    const url = `${window.location.origin}/restaurant/${restaurant.id}`
    openShareModal(restaurant.name, url)
  }

  // 네이버 지도 길찾기 URL 생성
  const getNaverMapUrl = () => {
    const encodedName = encodeURIComponent(restaurant.name)
    return `https://map.naver.com/v5/search/${encodedName}?c=${restaurant.longitude},${restaurant.latitude},15,0,0,0,dh`
  }

  // 카카오맵 길찾기 URL 생성
  const getKakaoMapUrl = () => {
    return `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`
  }

  // 모바일 여부 확인
  const isMobile =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <div className="bg-background fixed inset-x-0 bottom-0 border-t p-4 lg:static lg:border-none lg:bg-transparent lg:p-0">
      <div className="flex gap-3">
        {/* 길찾기 버튼 */}
        <a
          href={isMobile ? getKakaoMapUrl() : getNaverMapUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full gap-2" size="lg">
            <Navigation className="h-4 w-4" />
            길찾기
          </Button>
        </a>

        {/* 전화하기 버튼 */}
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`}>
            <Button variant="outline" size="lg" className="gap-2">
              <Phone className="h-4 w-4" />
              전화
            </Button>
          </a>
        )}

        {/* 공유하기 버튼 */}
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          공유
        </Button>
      </div>
    </div>
  )
}
