"use client"

import { Navigation, Phone, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store/uiStore"
import type { Restaurant } from "@/types/model"

interface ActionButtonsProps {
  restaurant: Restaurant
}

/**
 * 맛집 상세 화면에서 하단에 고정되어 나타나는 버튼들입니다.
 * 길찾기, 전화하기, 공유하기 기능을 제공합니다.
 */
export function ActionButtons({ restaurant }: ActionButtonsProps) {
  const { openShareModal } = useUIStore()

  /** 현재 페이지 주소를 복사하여 공유 모달을 엽니다. */
  const handleShare = () => {
    const url = `${window.location.origin}/restaurant/${restaurant.id}`
    openShareModal(restaurant.name, url)
  }

  /** 네이버 지도 앱이나 웹으로 연결되는 길찾기 주소를 만듭니다. */
  const getNaverMapUrl = () => {
    const encodedName = encodeURIComponent(restaurant.name)
    return `https://map.naver.com/v5/search/${encodedName}?c=${restaurant.longitude},${restaurant.latitude},15,0,0,0,dh`
  }

  /** 카카오맵 앱이나 웹으로 연결되는 길찾기 주소를 만듭니다. */
  const getKakaoMapUrl = () => {
    return `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`
  }

  /** 현재 사용자가 모바일 기기(아이폰, 안드로이드 등)를 쓰는지 확인합니다. */
  const isMobile =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <div className="bg-background fixed inset-x-0 bottom-0 border-t p-4 lg:static lg:border-none lg:bg-transparent lg:p-0">
      <div className="flex gap-3">
        {/* 길찾기: 모바일에선 카카오맵, PC에선 네이버 지도로 연결되도록 설정함 */}
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
