import type { Menu, Program, Restaurant, RestaurantDetail } from "./model"

/**
 * 네이버 지도 컴포넌트(`NaverMap`)에서 사용하는 데이터 정보(Props)입니다.
 */
export interface NaverMapProps {
  initialCenter?: { lat: number; lng: number } // 처음에 지도가 보여줄 중심 위치 (선택 사항)
  initialZoom?: number // 처음에 지도가 보여줄 확대 정도 (선택 사항)
  onBoundsChanged?: (bounds: {
    // 지도의 영역(동서남북)이 바뀔 때 실행할 함수
    north: number
    south: number
    east: number
    west: number
  }) => void
  onMarkerClick?: (restaurantId: string) => void // 지도 위 마커(아이콘)를 클릭했을 때 실행할 함수
  restaurants?: Restaurant[] // 지도에 표시할 맛집 목록
}

/**
 * 지도의 확대/축소 및 내 위치 찾기 버튼 부모 컴포넌트(`MapControls`)의 속성입니다.
 */
export interface MapControlsProps {
  onZoomIn: () => void // [+] 버튼 클릭 시 확대
  onZoomOut: () => void // [-] 버튼 클릭 시 축소
  onMyLocation: () => void // 내 위치 버튼 클릭 시 현재 위치로 이동
  isLocating?: boolean // 현재 내 위치를 찾는 중인지 나타내는 상태
}

/**
 * 지도 마커 위에 작게 나타나는 카드(`OverlayCard`)의 속성입니다.
 */
export interface OverlayCardProps {
  restaurant: Restaurant // 카드에 보여줄 맛집 정보
  onClose: () => void // 닫기 버튼 클릭 시
  onDetailClick: () => void // '상세보기' 클릭 시
}

/**
 * 맛집 목록에서 한 개의 맛집을 보여주는 카드(`RestaurantCard`)의 속성입니다.
 */
export interface RestaurantCardProps {
  restaurant: Restaurant // 맛집 정보
  programBadge?: Program | null // 어떤 프로그램에 나왔는지 표시할 뱃지 정보
  isSelected?: boolean // 현재 이 카드가 선택되었는지 여부
  onClick?: () => void // 카드를 클릭했을 때
}

/**
 * 맛집 상세 페이지나 모달(`DetailView`)의 속성입니다.
 */
export interface DetailViewProps {
  restaurant: RestaurantDetail // 메뉴와 방송 정보를 포함한 상세 데이터
  onClose?: () => void // 닫기 버튼 클릭 시
}

/**
 * 메뉴 목록을 보여주는 부분(`MenuList`)의 속성입니다.
 */
export interface MenuListProps {
  menus: Menu[] // 보여줄 메뉴 리스트
}

/**
 * 맛집 정보에서 사용하는 각종 버튼들(`ActionButtons`)의 속성입니다.
 */
export interface ActionButtonsProps {
  restaurant: Restaurant // 버튼 클릭 시 활용할 맛집 정보
  onShare?: () => void // 공유 버튼 클릭 시 실행할 함수
}

/**
 * 검색창 컴포넌트(`SearchBar`)의 속성입니다.
 */
export interface SearchBarProps {
  value: string // 검색창에 입력된 텍스트
  onChange: (value: string) => void // 글자가 바뀔 때마다 실행할 함수
  onSearch: () => void // 검색 버튼이나 엔터를 눌렀을 때 실행할 함수
  placeholder?: string // 아무것도 입력 안 했을 때 보여줄 문구
}

/**
 * 카테고리나 프로그램별로 골라보는 필터 칩(`FilterChips`)의 속성입니다.
 */
export interface FilterChipsProps {
  selectedCategory: string | null // 현재 선택된 카테고리 ID
  selectedProgram: string | null // 현재 선택된 프로그램 ID
  onCategoryChange: (category: string | null) => void // 카테고리 선택 시 실행
  onProgramChange: (programId: string | null) => void // 프로그램 선택 시 실행
  categories: { id: string; name: string }[] // 보여줄 카테고리 전체 목록
  programs: Program[] // 보여줄 프로그램 전체 목록
}

/**
 * 화면 옆쪽 리스트 영역(`Sidebar`)의 속성입니다.
 */
export interface SidebarProps {
  restaurants: Restaurant[] // 리스트로 보여줄 맛집들
  selectedId: string | null // 현재 선택된 맛집의 ID
  onSelect: (id: string) => void // 맛집을 선택했을 때 실행
  isLoading?: boolean // 데이터를 불러오는 중인지 여부
}

/**
 * 모바일에서 아래에서 올라오는 창(`MobileDrawer`)의 속성입니다.
 */
export interface MobileDrawerProps {
  isOpen: boolean // 창이 열려 있는지
  onClose: () => void // 창을 닫을 때
  children: React.ReactNode // 창 안에 들어갈 내용들
}

/**
 * 공통적으로 사용하는 팝업창(`Modal`)의 속성입니다.
 */
export interface ModalProps {
  isOpen: boolean // 모달이 열려 있는지
  onClose: () => void // 모달을 닫을 때
  children: React.ReactNode // 모달 내용
}

/**
 * 공유하기 팝업(`ShareModal`)의 속성입니다.
 */
export interface ShareModalProps extends ModalProps {
  title: string // 공유할 제목
  url: string // 공유할 주소
}
