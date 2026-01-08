export const CATEGORIES = [
  { id: "korean", name: "한식", icon: "🍚" },
  { id: "chinese", name: "중식", icon: "🥟" },
  { id: "japanese", name: "일식", icon: "🍣" },
  { id: "western", name: "양식", icon: "🍝" },
  { id: "chicken", name: "치킨", icon: "🍗" },
  { id: "pizza", name: "피자", icon: "🍕" },
  { id: "burger", name: "버거", icon: "🍔" },
  { id: "asian", name: "아시안", icon: "🍜" },
  { id: "meat", name: "고기", icon: "🥩" },
  { id: "seafood", name: "해산물", icon: "🦐" },
  { id: "snack", name: "분식", icon: "🍢" },
  { id: "cafe", name: "카페", icon: "☕" },
  { id: "dessert", name: "디저트", icon: "🍰" },
  { id: "etc", name: "기타", icon: "🍽️" },
] as const

export type CategoryId = (typeof CATEGORIES)[number]["id"]

export const getCategoryById = (id: string) => {
  return CATEGORIES.find((cat) => cat.id === id)
}

export const getCategoryName = (id: string) => {
  return getCategoryById(id)?.name ?? "기타"
}

// 가격대 상수
export const PRICE_RANGES = [
  { id: "under10k", name: "만원 미만", min: 0, max: 10000 },
  { id: "10k-20k", name: "1~2만원", min: 10000, max: 20000 },
  { id: "20k-30k", name: "2~3만원", min: 20000, max: 30000 },
  { id: "over30k", name: "3만원 이상", min: 30000, max: Infinity },
] as const

// 기본 지도 설정
export const DEFAULT_MAP_CENTER = {
  lat: 37.5665, // 서울시청
  lng: 126.978,
}

export const DEFAULT_MAP_ZOOM = 14

export const MAP_ZOOM_RANGE = {
  min: 6,
  max: 21,
}
