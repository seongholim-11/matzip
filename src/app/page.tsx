"use client"

import { Suspense, useCallback, useMemo, useRef, useState } from "react"

import { Loading } from "@/components/common/Loading"
import { Header } from "@/components/layout/Header"
import { MobileDrawer } from "@/components/layout/MobileDrawer"
import { Sidebar } from "@/components/layout/Sidebar"
import { MapControls } from "@/components/map/MapControls"
import { NaverMap } from "@/components/map/NaverMap"
import { OverlayCard } from "@/components/map/OverlayCard"
import { FilterChips } from "@/components/search/FilterChips"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useIsDesktop } from "@/hooks/useMediaQuery"
import { useUIStore } from "@/store/uiStore"
import type { MapBounds, Restaurant } from "@/types/model"

// Mock 데이터 (실제로는 API에서 가져옴)
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "을지로 골뱅이",
    category: "korean",
    address: "서울특별시 중구 을지로 157",
    road_address: "서울특별시 중구 을지로3가",
    latitude: 37.5665,
    longitude: 126.99,
    phone: "02-2267-1234",
    business_hours: null,
    price_range: "1~2만원",
    thumbnail_url: null,
    parking: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "광화문 미진",
    category: "korean",
    address: "서울특별시 종로구 세종대로 175",
    road_address: "서울특별시 종로구 세종로",
    latitude: 37.5723,
    longitude: 126.9769,
    phone: "02-735-7890",
    business_hours: null,
    price_range: "만원 미만",
    thumbnail_url: null,
    parking: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "명동 칼국수",
    category: "korean",
    address: "서울특별시 중구 명동길 25",
    road_address: "서울특별시 중구 명동2가",
    latitude: 37.5636,
    longitude: 126.9859,
    phone: "02-776-5678",
    business_hours: null,
    price_range: "만원 미만",
    thumbnail_url: null,
    parking: false,
    created_at: new Date().toISOString(),
  },
]

function MapPage() {
  const isDesktop = useIsDesktop()
  const mapRef = useRef<{
    panTo: (lat: number, lng: number) => void
    zoomIn: () => void
    zoomOut: () => void
  } | null>(null)

  const { selectedRestaurantId, selectRestaurant, isDrawerOpen, closeDrawer } =
    useUIStore()

  const {
    getCurrentPosition,
    latitude,
    longitude,
    isLoading: isLocating,
  } = useGeolocation()

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  // 현재 보고 있는 맛집 리스트 (실제로는 API 호출 결과)
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS)
  const [isLoading] = useState(false)

  // 지도 bounds 변경 시 호출
  const handleBoundsChanged = useCallback((bounds: MapBounds) => {
    // TODO: bounds 내 맛집 조회 API 호출
    console.log("Bounds changed:", bounds)
  }, [])

  // 마커 클릭 시
  const handleMarkerClick = useCallback(
    (restaurantId: string) => {
      selectRestaurant(restaurantId)
    },
    [selectRestaurant]
  )

  // 내 위치로 이동
  const handleMyLocation = useCallback(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  // 위치 얻었을 때 지도 이동
  const handleLocationUpdate = useCallback(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.panTo(latitude, longitude)
    }
  }, [latitude, longitude])

  // 선택된 맛집
  const selectedRestaurant = useMemo(() => {
    return restaurants.find((r) => r.id === selectedRestaurantId) ?? null
  }, [restaurants, selectedRestaurantId])

  // 필터된 맛집 목록
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false
      // TODO: program 필터 추가
      return true
    })
  }, [restaurants, selectedCategory])

  return (
    <div className="flex h-full flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* 데스크탑: 사이드바 */}
        {isDesktop && (
          <Sidebar restaurants={filteredRestaurants} isLoading={isLoading} />
        )}

        {/* 지도 영역 */}
        <main className="relative flex-1">
          {/* 모바일 필터 */}
          {!isDesktop && (
            <div className="from-background absolute top-0 right-0 left-0 z-10 bg-gradient-to-b to-transparent p-4 pb-8">
              <FilterChips
                selectedCategory={selectedCategory}
                selectedProgram={selectedProgram}
                onCategoryChange={setSelectedCategory}
                onProgramChange={setSelectedProgram}
              />
            </div>
          )}

          {/* 네이버 지도 */}
          <NaverMap
            restaurants={filteredRestaurants}
            onBoundsChanged={handleBoundsChanged}
            onMarkerClick={handleMarkerClick}
            selectedRestaurantId={selectedRestaurantId}
          />

          {/* 지도 컨트롤 */}
          <MapControls
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onMyLocation={handleMyLocation}
            isLocating={isLocating}
          />

          {/* 선택된 맛집 오버레이 (데스크탑) */}
          {isDesktop && selectedRestaurant && (
            <OverlayCard
              restaurant={selectedRestaurant}
              onClose={() => selectRestaurant(null)}
            />
          )}
        </main>
      </div>

      {/* 모바일: 바텀 드로어 */}
      {!isDesktop && (
        <MobileDrawer
          isOpen={isDrawerOpen && !!selectedRestaurant}
          onClose={closeDrawer}
          title={selectedRestaurant?.name}
        >
          {selectedRestaurant && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {selectedRestaurant.address}
              </p>
              <div className="flex gap-2">
                <a
                  href={`/restaurant/${selectedRestaurant.id}`}
                  className="bg-primary text-primary-foreground flex-1 rounded-lg py-3 text-center text-sm font-medium"
                >
                  상세보기
                </a>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(selectedRestaurant.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg border py-3 text-center text-sm font-medium"
                >
                  길찾기
                </a>
              </div>
            </div>
          )}
        </MobileDrawer>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<Loading size="lg" text="지도를 불러오는 중..." />}>
      <MapPage />
    </Suspense>
  )
}
