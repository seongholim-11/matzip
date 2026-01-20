"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { EmptyState } from "@/components/common/EmptyState"
import { Loading } from "@/components/common/Loading"
import { RestaurantCard } from "@/components/restaurant/RestaurantCard"
import { FilterChips } from "@/components/search/FilterChips"
import { useUIStore } from "@/store/uiStore"
import type { Program, Restaurant } from "@/types/model"

/** Sidebar 컴포넌트가 받는 데이터들입니다. */
interface SidebarProps {
  restaurants: Restaurant[] // 화면에 보여줄 맛집 리스트
  isLoading?: boolean // 데이터를 불러오는 중인지 여부
  selectedCategory: string | null
  selectedPrograms: string[]
  onCategoryChange: (category: string | null) => void
  onProgramToggle: (programId: string) => void
  onProgramsClear: () => void
  programs?: Program[]
}

/**
 * 화면 왼쪽에 위치하여 맛집 목록을 보여주는 사이드바입니다.
 * 데스크탑 화면에서만 나타나며, 열고 닫을 수 있습니다.
 */
export function Sidebar({
  restaurants,
  isLoading,
  selectedCategory,
  selectedPrograms,
  onCategoryChange,
  onProgramToggle,
  onProgramsClear,
  programs,
}: SidebarProps) {
  // 전역 UI 상태를 가져와서 사용합니다.
  const {
    isSidebarOpen,
    toggleSidebar,
    selectedRestaurantId,
    selectRestaurant,
  } = useUIStore()

  return (
    <aside
      className={`bg-background relative flex h-full flex-col border-r transition-all duration-300 ${
        isSidebarOpen ? "w-[400px]" : "w-0"
      }`}
    >
      {/* 사이드바를 접거나 펼치는 화살표 버튼 */}
      <button
        onClick={toggleSidebar}
        className="bg-background hover:bg-muted absolute top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-md transition-colors"
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {isSidebarOpen && (
        <>
          {/* 상단 제목 영역 */}
          <div className="border-b p-4 pb-0">
            <h2 className="mb-1 text-lg font-bold">맛집 목록</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              현재 영역에 {restaurants.length}개의 맛집이 있습니다.
            </p>

            <FilterChips
              selectedCategory={selectedCategory}
              selectedPrograms={selectedPrograms}
              onCategoryChange={onCategoryChange}
              onProgramToggle={onProgramToggle}
              onProgramsClear={onProgramsClear}
              programs={programs}
            />
          </div>

          {/* 실제 맛집 카드 리스트 영역 */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <Loading text="맛집 정보를 가져오는 중입니다..." />
            ) : restaurants.length === 0 ? (
              <EmptyState type="location" /> // 결과가 없을 때 보여주는 화면
            ) : (
              <div className="divide-y">
                {/* 각 맛집 데이터를 한 장씩 카드로 그려줍니다. */}
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isSelected={selectedRestaurantId === restaurant.id}
                    onClick={() => selectRestaurant(restaurant.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
