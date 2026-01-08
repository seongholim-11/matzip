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

export const useUIStore = create<UIState>((set) => ({
  // 초기 상태
  isSidebarOpen: true,
  isDrawerOpen: false,
  selectedRestaurantId: null,
  isShareModalOpen: false,
  shareModalData: null,
  isSearchFocused: false,

  // 사이드바 액션
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // 드로어 액션 (모바일)
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  // 맛집 선택
  selectRestaurant: (id) =>
    set({
      selectedRestaurantId: id,
      isDrawerOpen: id !== null,
    }),

  // 공유 모달
  openShareModal: (title, url) =>
    set({
      isShareModalOpen: true,
      shareModalData: { title, url },
    }),
  closeShareModal: () =>
    set({
      isShareModalOpen: false,
      shareModalData: null,
    }),

  // 검색 포커스
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),
}))
