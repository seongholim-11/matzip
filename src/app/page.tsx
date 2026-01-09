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

/**
 * 메인 지도 페이지의 핵심 로직과 화면을 구성하는 컴포넌트입니다.
 */
function MapPage() {
  const isDesktop = useIsDesktop() // 현재 화면이 데스크탑 크기인지 확인하는 훅
  // 지도 객체에 직접 접근하기 위한 참조(Ref) 변수
  const mapRef = useRef<{
    panTo: (lat: number, lng: number) => void
    zoomIn: () => void
    zoomOut: () => void
  } | null>(null)

  // 전역 상태(UI 상태)관리 도구에서 필요한 것들을 가져옵니다.
  const { selectedRestaurantId, selectRestaurant, isDrawerOpen, closeDrawer } =
    useUIStore()

  // 현재 사용자의 위치 정보를 가져오는 커스텀 훅
  const {
    getCurrentPosition,
    latitude,
    longitude,
    isLoading: isLocating,
  } = useGeolocation()

  // 필터 상태 (어떤 카테고리나 프로그램이 선택되었는지)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  // 현재 지도에 보여줄 맛집 리스트 상태 (실제 서비스에서는 서버에서 가져옴)
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS)
  const [isLoading] = useState(false) // 데이터를 불러오는 중인지 여부

  /**
   * 지도를 이리저리 움직여서 영역이 바뀌었을 때 실행되는 함수입니다.
   * 바뀐 영역 안에 있는 맛집들만 새로 불러올 때 사용합니다.
   */
  const handleBoundsChanged = useCallback((_bounds: MapBounds) => {
    // TODO: 새로운 영역(bounds) 내의 맛집들만 가져오는 API를 호출하는 로직이 들어갈 자리입니다.
  }, [])

  /** 마커를 클릭했을 때 해당 맛집을 '선택' 상태로 만듭니다. */
  const handleMarkerClick = useCallback(
    (restaurantId: string) => {
      selectRestaurant(restaurantId)
    },
    [selectRestaurant]
  )

  /** '내 위치' 버튼을 눌렀을 때 지도를 사용자의 현재 위치로 이동시킵니다. */
  const handleMyLocation = useCallback(() => {
    getCurrentPosition()
    if (latitude && longitude && mapRef.current) {
      mapRef.current.panTo(latitude, longitude)
    }
  }, [getCurrentPosition, latitude, longitude])

  /** 현재 수많은 맛집 중에서 사용자가 '선택'한 맛집 하나를 찾습니다. */
  const selectedRestaurant = useMemo(() => {
    return restaurants.find((r) => r.id === selectedRestaurantId) ?? null
  }, [restaurants, selectedRestaurantId])

  /** 선택된 카테고리에 맞는 맛집들만 골라냅니다. */
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (selectedCategory && r.category !== selectedCategory) return false
      // TODO: 방송 프로그램별로도 필터링하는 로직이 추가될 예정입니다.
      return true
    })
  }, [restaurants, selectedCategory])

  return (
    <div className="flex h-full flex-col">
      {/* 상단 헤더 영역 */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* 데스크탑에서만 보여주는 왼쪽 맛집 리스트 사이드바 */}
        {isDesktop && (
          <Sidebar restaurants={filteredRestaurants} isLoading={isLoading} />
        )}

        {/* 메인 지도 화면 영역 */}
        <main className="relative flex-1">
          {/* 모바일에서만 지도 위에 떠 있는 카테고리 필터 버튼들 */}
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

          {/* 실제 네이버 지도 컴포넌트 */}
          <NaverMap
            restaurants={filteredRestaurants}
            onBoundsChanged={handleBoundsChanged}
            onMarkerClick={handleMarkerClick}
            selectedRestaurantId={selectedRestaurantId}
          />

          {/* 지도를 컨트롤하는 버튼들 (확대, 축소, 내위치) */}
          <MapControls
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onMyLocation={handleMyLocation}
            isLocating={isLocating}
          />

          {/* 데스크탑: 마커를 눌렀을 때 지도 위에 뜨는 맛집 요약 카드 */}
          {isDesktop && selectedRestaurant && (
            <OverlayCard
              restaurant={selectedRestaurant}
              onClose={() => selectRestaurant(null)}
            />
          )}
        </main>
      </div>

      {/* 모바일: 마커를 눌렀을 때 화면 아래에서 올라오는 상세 정보창 */}
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

/**
 * 프로젝트의 공식 메인 페이지(/)입니다.
 * Suspense를 사용해 지도를 불러오는 동안 로딩 화면을 보여줍니다.
 */
export default function Home() {
  return (
    <Suspense fallback={<Loading size="lg" text="지도를 불러오는 중..." />}>
      <MapPage />
    </Suspense>
  )
}
