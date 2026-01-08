import type { Menu, Program, Restaurant, RestaurantDetail } from "./model"

// 지도 관련 Props
export interface NaverMapProps {
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  onBoundsChanged?: (bounds: {
    north: number
    south: number
    east: number
    west: number
  }) => void
  onMarkerClick?: (restaurantId: string) => void
  restaurants?: Restaurant[]
}

export interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onMyLocation: () => void
  isLocating?: boolean
}

export interface OverlayCardProps {
  restaurant: Restaurant
  onClose: () => void
  onDetailClick: () => void
}

// 맛집 관련 Props
export interface RestaurantCardProps {
  restaurant: Restaurant
  programBadge?: Program | null
  isSelected?: boolean
  onClick?: () => void
}

export interface DetailViewProps {
  restaurant: RestaurantDetail
  onClose?: () => void
}

export interface MenuListProps {
  menus: Menu[]
}

export interface ActionButtonsProps {
  restaurant: Restaurant
  onShare?: () => void
}

// 검색/필터 관련 Props
export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
}

export interface FilterChipsProps {
  selectedCategory: string | null
  selectedProgram: string | null
  onCategoryChange: (category: string | null) => void
  onProgramChange: (programId: string | null) => void
  categories: { id: string; name: string }[]
  programs: Program[]
}

// 레이아웃 관련 Props
export interface SidebarProps {
  restaurants: Restaurant[]
  selectedId: string | null
  onSelect: (id: string) => void
  isLoading?: boolean
}

export interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

// 공통 Props
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export interface ShareModalProps extends ModalProps {
  title: string
  url: string
}
