"use client"

import { useEffect, useState } from "react"

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

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // 필터가 변경되면 페이지를 1페이지로 초기화
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedPrograms])

  // 현재 페이지에 보여줄 데이터
  const paginatedRestaurants = restaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(restaurants.length / itemsPerPage)

  // 페이지 이동 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 페이지 이동 시 리스트 최상단으로 스크롤 (선택 사항)
    const listElement = document.getElementById("sidebar-list")
    if (listElement) {
      listElement.scrollTop = 0
    }
  }

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
              전체 {restaurants.length}개 중 {paginatedRestaurants.length}개
              표시 ({currentPage}/{totalPages} 페이지)
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
          <div id="sidebar-list" className="flex-1 overflow-y-auto">
            {isLoading ? (
              <Loading text="맛집 정보를 가져오는 중입니다..." />
            ) : restaurants.length === 0 ? (
              <EmptyState type="location" /> // 결과가 없을 때 보여주는 화면
            ) : (
              <div className="divide-y pb-4">
                {/* 각 맛집 데이터를 한 장씩 카드로 그려줍니다. */}
                {paginatedRestaurants.map((restaurant) => (
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

          {/* 페이지네이션 컨트롤 */}
          {!isLoading && restaurants.length > 0 && (
            <div className="border-t p-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="hover:bg-muted rounded p-1 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex max-w-[240px] flex-wrap justify-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // 10페이지 이하라면 모두 표시
                      if (totalPages <= 10) return true

                      // 현재 페이지 주변(±2), 첫 페이지, 마지막 페이지만 표시
                      return (
                        Math.abs(currentPage - page) < 3 ||
                        page === 1 ||
                        page === totalPages
                      )
                    })
                    .map((page, index, array) => {
                      // 페이지 번호 사이에 갭이 있다면 ... 을 표시하는 로직이 필요하지만
                      // 우선은 간단하게 버튼만 나열 (사용자가 번호를 원함)
                      // 필요하다면 추후 ... 추가

                      const showEllipsis =
                        index > 0 && page - array[index - 1] > 1

                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && (
                            <span className="text-muted-foreground mx-1 text-xs">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`h-8 min-w-[32px] rounded px-2 text-sm transition-colors ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground font-bold"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      )
                    })}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="hover:bg-muted rounded p-1 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  )
}
