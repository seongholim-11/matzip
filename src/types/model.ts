// 맛집 정보
export interface Restaurant {
  id: string
  name: string
  category: string
  address: string
  road_address: string
  latitude: number
  longitude: number
  phone: string | null
  business_hours: BusinessHours | null
  price_range: string | null
  thumbnail_url: string | null
  parking: boolean
  created_at: string
}

// 영업시간 정보
export interface BusinessHours {
  [day: string]: {
    open: string
    close: string
    breakStart?: string
    breakEnd?: string
    closed?: boolean
  }
}

// 방송 프로그램
export interface Program {
  id: string
  name: string
  channel: string
  type: "TV" | "YOUTUBE"
  logo_url: string | null
  description: string | null
}

// 방송 출연 정보
export interface RestaurantAppearance {
  id: string
  restaurant_id: string
  program_id: string
  episode: string | null
  air_date: string | null
  youtube_link: string | null
  featured_menu: string | null
  program?: Program
}

// 메뉴 정보
export interface Menu {
  id: string
  restaurant_id: string
  name: string
  price: number
  is_main: boolean
  image_url: string | null
}

// 맛집 상세 정보 (관계 포함)
export interface RestaurantDetail extends Restaurant {
  menus: Menu[]
  appearances: RestaurantAppearance[]
}

// 지도 범위
export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

// 지도 상태
export interface MapState {
  center: {
    lat: number
    lng: number
  }
  zoom: number
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// 목록 조회 응답
export interface ListResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
