"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { EmptyState } from "@/components/common/EmptyState"
import { Loading } from "@/components/common/Loading"
import { RestaurantCard } from "@/components/restaurant/RestaurantCard"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/store/uiStore"
import type { Restaurant } from "@/types/model"

interface SidebarProps {
  restaurants: Restaurant[]
  isLoading?: boolean
}

export function Sidebar({ restaurants, isLoading }: SidebarProps) {
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
      {/* 토글 버튼 */}
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
          {/* 헤더 */}
          <div className="border-b p-4">
            <h2 className="text-lg font-bold">맛집 목록</h2>
            <p className="text-muted-foreground text-sm">
              {restaurants.length}개의 맛집
            </p>
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <Loading text="맛집을 불러오는 중..." />
            ) : restaurants.length === 0 ? (
              <EmptyState type="location" />
            ) : (
              <div className="divide-y">
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
