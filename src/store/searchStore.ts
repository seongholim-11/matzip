import { create } from "zustand"

interface SearchState {
  keyword: string
  setKeyword: (keyword: string) => void
  resetKeyword: () => void
}

/**
 * 검색 키워드를 관리하는 전역 상태 저장소입니다.
 * 헤더의 검색창과 메인 지도의 데이터 필터링을 연결합니다.
 */
export const useSearchStore = create<SearchState>((set) => ({
  keyword: "",
  setKeyword: (keyword: string) => set({ keyword }),
  resetKeyword: () => set({ keyword: "" }),
}))
