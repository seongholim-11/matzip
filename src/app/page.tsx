"use client"

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

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
import type { MapBounds, Program, Restaurant } from "@/types/model"

/**
 * 메인 지도 페이지의 핵심 로직과 화면을 구성하는 컴포넌트입니다.
 */
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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  // 실제 데이터 상태
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 식당 데이터 가져오기
  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) params.append("category", selectedCategory)
      // TODO: selectedProgram 지원 시 API 업데이트 필요

      const response = await fetch(`/api/restaurants?${params.toString()}`)
      const data = await response.json()
      setRestaurants(data.items || [])
    } catch (error) {
      // TODO: 에러 처리 UI 구현
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  // 프로그램 목록 가져오기
  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch("/api/sources")
      const data = await response.json()
      setPrograms(data || [])
    } catch (error) {
      // TODO: 에러 처리 UI 구현
    }
  }, [])

  // 초기 로드 및 필터 변경 시 호출
  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  const handleBoundsChanged = useCallback((_bounds: MapBounds) => {
    // TODO: Bounds 기반 페칭 구현
  }, [])

  const handleMarkerClick = useCallback(
    (restaurantId: string) => {
      selectRestaurant(restaurantId)
    },
    [selectRestaurant]
  )

  const handleMyLocation = useCallback(() => {
    getCurrentPosition()
    if (latitude && longitude && mapRef.current) {
      mapRef.current.panTo(latitude, longitude)
    }
  }, [getCurrentPosition, latitude, longitude])

  const selectedRestaurant = useMemo(() => {
    return restaurants.find((r) => r.id === selectedRestaurantId) ?? null
  }, [restaurants, selectedRestaurantId])

  const filteredRestaurants = useMemo(() => {
    // API에서 이미 필터링되어 오지만, 프로그램 필터는 프론트엔드에서 처리하거나 API를 확장할 수 있음
    return restaurants
  }, [restaurants])

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
                programs={programs}
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
