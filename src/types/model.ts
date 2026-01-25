/**
 * 맛집(식당) 정보에 대한 데이터 구조를 정의합니다.
 */
export interface Restaurant {
  id: string // 맛집의 고유 식별자 (ID)
  name: string // 맛집 이름
  category: string // 카테고리 (예: 한식, 일식 등)
  address: string // 지번 주소
  road_address: string // 도로명 주소
  latitude: number // 위도 (지도의 세로 좌표)
  longitude: number // 경도 (지도의 가로 좌표)
  phone: string | null // 전화번호 (없을 수도 있음)
  business_hours: BusinessHours | null // 영업시간 (없을 수도 있음)
  price_range: string | null // 가격대 (예: 1~2만원)
  thumbnail_url: string | null // 대표 이미지 링크
  parking: boolean // 주차 가능 여부 (true/false)
  created_at: string // 데이터가 생성된 날짜와 시간
  recommendations?: {
    source: {
      id: string
      name: string
    }
  }[] // 추천 소스 정보 (채널 정보 포함)
}

/**
 * 영업시간 정보를 담는 구조입니다. 요일별로 열고 닫는 시간을 저장합니다.
 */
export interface BusinessHours {
  [day: string]: {
    // "월", "화" 등의 요일이 키가 됩니다.
    open: string // 오픈 시간 (예: "09:00")
    close: string // 마감 시간 (예: "22:00")
    breakStart?: string // 브레이크 타임 시작 (선택 사항)
    breakEnd?: string // 브레이크 타임 종료 (선택 사항)
    closed?: boolean // 휴무 여부 (true인 경우 휴무)
  }
}

/**
 * 방송 혹은 유튜브 프로그램 정보를 정의합니다.
 */
export interface Program {
  id: string // 프로그램 고유 ID
  name: string // 프로그램 이름
  channel: string // 채널명 (예: SBS, tvN, 유튜브 채널명)
  type: "TV" | "YOUTUBE" // 매체 종류 (TV 방송인지 유튜브인지 구분)
  logo_url: string | null // 프로그램 로고 이미지 링크
  description: string | null // 프로그램에 대한 짧은 설명
}

/**
 * 특정 맛집이 어떤 프로그램에 출연했는지에 대한 정보를 정의합니다.
 */
export interface RestaurantAppearance {
  id: string // 출연 정보 고유 ID
  restaurant_id: string // 해당 맛집의 ID
  program_id: string // 해당 프로그램의 ID
  episode: string | null // 방영 회차 (예: "125회")
  air_date: string | null // 방영 날짜
  youtube_link: string | null // 유튜브 다시보기 링크
  featured_menu: string | null // 방송에서 소개된 대표 메뉴
  program?: Program // 프로그램의 상세 정보 (필요시 함께 가져옴)
}

/**
 * 맛집의 메뉴 정보를 정의합니다.
 */
export interface Menu {
  id: string // 메뉴 고유 ID
  restaurant_id: string // 해당 맛집의 ID
  name: string // 메뉴 이름
  price: number // 가격 (숫자)
  is_main: boolean // 대표 메뉴 여부
  image_url: string | null // 메뉴 사진 링크
}

/**
 * 맛집의 상세 정보입니다. 기본 정보뿐만 아니라 메뉴와 방송 출연 이력을 모두 포함합니다.
 */
export interface RestaurantDetail extends Restaurant {
  menus: Menu[] // 메뉴 목록 (배열)
  appearances: RestaurantAppearance[] // 방송 출연 이력 목록 (배열)
}

/**
 * 지도의 현재 범위를 나타내는 좌표들입니다.
 */
export interface MapBounds {
  north: number // 북쪽(위쪽) 끝 위도
  south: number // 남쪽(아래쪽) 끝 위도
  east: number // 동쪽(오른쪽) 끝 경도
  west: number // 서쪽(왼쪽) 끝 경도
}

/**
 * 지도의 상태(중심점과 확대 레벨)를 나타냅니다.
 */
export interface MapState {
  center: {
    lat: number // 중심점 위도
    lng: number // 중심점 경도
  }
  zoom: number // 확대 레벨 (숫자가 클수록 더 크게 보임)
}

/**
 * API 요청에 대한 응답을 처리할 때 사용하는 공용 구조입니다.
 */
export interface ApiResponse<T> {
  data: T | null // 성공 시 반환되는 실제 데이터 (T는 어떤 타입이든 올 수 있다는 의미)
  error: string | null // 실패 시 발생하는 에러 메시지
}

/**
 * 목록(리스트) 형태의 데이터를 요청했을 때의 응답 구조입니다.
 */
export interface ListResponse<T> {
  items: T[] // 목록에 해당하는 데이터 배열
  total: number // 전체 데이터의 개수
  page: number // 현재 페이지 번호
  limit: number // 한 페이지에 보여줄 데이터 개수
}
