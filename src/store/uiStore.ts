import { create } from "zustand"

interface UIState {
  // 사이드바/드로어 상태
  isSidebarOpen: boolean
  isDrawerOpen: boolean

  // 선택된 맛집
  selectedRestaurantId: string | null

  // 모달 상태
  isShareModalOpen: boolean
  shareModalData: { title: string; url: string } | null

  // 검색 상태
  isSearchFocused: boolean

  // 액션
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void

  openDrawer: () => void
  closeDrawer: () => void

  selectRestaurant: (id: string | null) => void

  openShareModal: (title: string, url: string) => void
  closeShareModal: () => void

  setSearchFocused: (focused: boolean) => void
}

/**
 * 앱 전체에서 공통으로 쓰이는 UI 상태(사이드바 열림 여부, 선택된 맛집 등)를 관리하는 저장소입니다.
 */
export const useUIStore = create<UIState>((set) => ({
  // 초기 상태 (앱이 처음 켜졌을 때의 값들)
  isSidebarOpen: true, // 사이드바가 열려있는지
  isDrawerOpen: false, // 모바일 상세창이 열려있는지
  selectedRestaurantId: null, // 현재 선택된 맛집의 ID
  isShareModalOpen: false, // 공유 창이 열려있는지
  shareModalData: null, // 공유할 이름과 주소
  isSearchFocused: false, // 검색창에 커서가 가있는지

  // 사이드바 열고 닫기
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // 모바일 상세창(드로어) 열고 닫기
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  /** 맛집을 선택하면 해당 맛집의 ID를 저장하고, 모바일에선 하단 창(Drawer)을 자동으로 엽니다. */
  selectRestaurant: (id) =>
    set({
      selectedRestaurantId: id,
      isDrawerOpen: id !== null,
    }),

  /** 공유 창을 엽니다. 제목과 주소가 필요합니다. */
  openShareModal: (title, url) =>
    set({
      isShareModalOpen: true,
      shareModalData: { title, url },
    }),

  /** 공유 창을 닫고 데이터를 초기화합니다. */
  closeShareModal: () =>
    set({
      isShareModalOpen: false,
      shareModalData: null,
    }),

  /** 검색창의 포커스 상태를 업데이트합니다. */
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),
}))
