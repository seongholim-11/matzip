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
import { NaverMap, type NaverMapRef } from "@/components/map/NaverMap"
import { OverlayCard } from "@/components/map/OverlayCard"
import { FilterChips } from "@/components/search/FilterChips"
import { useGeolocation } from "@/hooks/useGeolocation"
import { useIsDesktop } from "@/hooks/useMediaQuery"
import { logger } from "@/services/logger"
import { useUIStore } from "@/store/uiStore"
import type { MapBounds, Program, Restaurant } from "@/types/model"

/**
 * 메인 지도 페이지의 핵심 로직과 화면을 구성하는 컴포넌트입니다.
 */
function MapPage() {
  const isDesktop = useIsDesktop()
  const mapRef = useRef<NaverMapRef | null>(null)

  const { selectedRestaurantId, selectRestaurant, isDrawerOpen, closeDrawer } =
    useUIStore()

  const {
    getCurrentPosition,
    latitude,
    longitude,
    timestamp,
    accuracy,
    isLoading: isLocating,
  } = useGeolocation()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])

  // 실제 데이터 상태
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 최초 로드 시 위치 정보 요청 및 자동 중앙 정렬 여부 관리
  const [hasInitialCentered, setHasInitialCentered] = useState(false)

  // 앱 접속 시 위치 정보 요청
  useEffect(() => {
    getCurrentPosition()
  }, [getCurrentPosition])

  // 현재 위치가 확보되면 지도를 해당 위치로 이동 (전체 로드 중 1회 또는 내 위치 버튼 클릭 시)
  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      // 내 위치 버튼 클릭 혹은 최초 1회 자동 이동
      if (!hasInitialCentered) {
        mapRef.current.panTo(latitude, longitude)
        setHasInitialCentered(true)
      } else if (timestamp) {
        // 이미 1회 수행된 이후에는 수동 버튼 클릭(timestamp 갱신) 시에만 이동
        mapRef.current.panTo(latitude, longitude)
      }
    }
  }, [latitude, longitude, timestamp, hasInitialCentered])

  // 식당 데이터 가져오기
  const fetchRestaurants = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.append("limit", "-1") // 전체 데이터 가져오기
      if (selectedCategory) params.append("category", selectedCategory)
      if (selectedPrograms.length > 0) {
        params.append("programs", selectedPrograms.join(","))
      }

      const response = await fetch(`/api/restaurants?${params.toString()}`)
      const data = await response.json()
      setRestaurants(data.items || [])
    } catch (error) {
      // TODO: 에러 처리 UI 구현
      logger.error("Failed to fetch restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, selectedPrograms])

  // 프로그램 목록 가져오기
  const fetchPrograms = useCallback(async () => {
    try {
      const response = await fetch("/api/sources")
      if (!response.ok) {
        throw new Error("Failed to fetch sources")
      }
      const data = await response.json()

      if (Array.isArray(data)) {
        setPrograms(data)
      } else {
        setPrograms([])
      }
    } catch (error) {
      // TODO: 에러 처리 UI 구현
      logger.error("Failed to fetch programs:", error)
      setPrograms([])
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
  }, [getCurrentPosition])

  const handleProgramToggle = useCallback((programId: string) => {
    setSelectedPrograms((prev) => {
      if (prev.includes(programId)) {
        return prev.filter((id) => id !== programId)
      } else {
        return [...prev, programId]
      }
    })
  }, [])

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
          <Sidebar
            restaurants={filteredRestaurants}
            isLoading={isLoading}
            selectedCategory={selectedCategory}
            selectedPrograms={selectedPrograms}
            onCategoryChange={setSelectedCategory}
            onProgramToggle={handleProgramToggle}
            onProgramsClear={() => setSelectedPrograms([])}
            programs={programs}
          />
        )}

        {/* 메인 지도 화면 영역 */}
        <main className="relative flex-1">
          {/* 모바일에서만 지도 위에 떠 있는 카테고리 필터 버튼들 */}
          {!isDesktop && (
            <div className="from-background absolute top-0 right-0 left-0 z-10 bg-gradient-to-b to-transparent p-4 pb-8">
              <FilterChips
                selectedCategory={selectedCategory}
                selectedPrograms={selectedPrograms}
                onCategoryChange={setSelectedCategory}
                onProgramToggle={handleProgramToggle}
                onProgramsClear={() => setSelectedPrograms([])}
                programs={programs}
              />
            </div>
          )}

          {/* 실제 네이버 지도 컴포넌트 */}
          <NaverMap
            ref={mapRef}
            restaurants={filteredRestaurants}
            userLocation={
              latitude && longitude ? { lat: latitude, lng: longitude } : null
            }
            accuracy={accuracy}
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

          {/* 마커를 눌렀을 때 지도 위에 뜨는 맛집 요약 카드 */}
          {selectedRestaurant && (
            <OverlayCard
              restaurant={selectedRestaurant}
              onClose={() => selectRestaurant(null)}
            />
          )}
        </main>
      </div>
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
