"use client"

import { MapPin, Search, Utensils } from "lucide-react"

interface EmptyStateProps {
  type?: "search" | "location" | "default"
  title?: string
  description?: string
}

const icons = {
  search: Search,
  location: MapPin,
  default: Utensils,
}

const defaultContent = {
  search: {
    title: "검색 결과가 없습니다",
    description: "다른 검색어로 다시 시도해보세요.",
  },
  location: {
    title: "이 지역에 맛집이 없습니다",
    description: "지도를 이동해서 다른 지역을 탐색해보세요.",
  },
  default: {
    title: "표시할 맛집이 없습니다",
    description: "조건을 변경하거나 지도를 이동해보세요.",
  },
}

/**
 * 맛집 목록이 없거나 검색 결과가 없을 때 보여주는 안내 화면입니다.
 * 상황(type)에 따라 다른 아이콘과 문구를 보여줍니다.
 */
export function EmptyState({
  type = "default",
  title,
  description,
}: EmptyStateProps) {
  const Icon = icons[type]
  const content = defaultContent[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <Icon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-semibold">
        {title ?? content.title}
      </h3>
      <p className="text-muted-foreground max-w-[280px] text-sm">
        {description ?? content.description}
      </p>
    </div>
  )
}
