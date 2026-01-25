import { renderHook, act } from "@testing-library/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { useQueryParams } from "./useQueryParams"

// Next.js의 navigation 훅들을 모의(Mock) 처리합니다.
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}))

describe("useQueryParams hook", () => {
  const mockPush = vi.fn()
  const mockPathname = "/test"

  beforeEach(() => {
    // 각 훅이 반환할 기본값들을 설정합니다.
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(usePathname).mockReturnValue(mockPathname)
    // 초기 쿼리 파라미터가 ?a=1&b=2 인 상태를 시뮬레이션합니다.
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("a=1&b=2") as unknown as ReturnType<
        typeof useSearchParams
      >
    )
  })

  // 훅이 현재 URL의 쿼리 파라미터를 객체 형태로 잘 파싱하는지 확인합니다.
  it("should parse initial search parameters", () => {
    const { result } = renderHook(() => useQueryParams())
    expect(result.current.params).toEqual({ a: "1", b: "2" })
    expect(result.current.get("a")).toBe("1")
  })

  // 단일 파라미터를 업데이트했을 때 router.push가 올바른 URL로 호출되는지 확인합니다.
  it("should update a parameter", () => {
    const { result } = renderHook(() => useQueryParams())
    act(() => {
      result.current.set("c", "3")
    })
    expect(mockPush).toHaveBeenCalledWith("/test?a=1&b=2&c=3", {
      scroll: false,
    })
  })

  // 파라미터 값을 null로 설정했을 때 해당 키가 삭제되는지 확인합니다.
  it("should remove a parameter when value is null", () => {
    const { result } = renderHook(() => useQueryParams())
    act(() => {
      result.current.set("a", null)
    })
    expect(mockPush).toHaveBeenCalledWith("/test?b=2", { scroll: false })
  })

  // 여러 개의 파라미터를 동시에 업데이트(수정, 삭제, 추가)했을 때 결과 URL이 올바른지 확인합니다.
  it("should update multiple parameters at once", () => {
    const { result } = renderHook(() => useQueryParams())
    act(() => {
      result.current.setMultiple({ a: "10", b: null, c: "30" })
    })
    expect(mockPush).toHaveBeenCalledWith("/test?a=10&c=30", { scroll: false })
  })

  // 모든 쿼리 파라미터를 초기화했을 때 기본 경로만 남는지 확인합니다.
  it("should clear all parameters", () => {
    const { result } = renderHook(() => useQueryParams())
    act(() => {
      result.current.clear()
    })
    expect(mockPush).toHaveBeenCalledWith("/test", { scroll: false })
  })
})
