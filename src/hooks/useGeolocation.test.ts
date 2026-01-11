import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { useGeolocation } from "./useGeolocation"

describe("useGeolocation hook", () => {
  // navigator.geolocation 객체를 모의(Mock) 처리합니다.
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  }

  beforeEach(() => {
    // 전역 객체인 navigator를 모의 객체로 대체합니다.
    vi.stubGlobal("navigator", {
      geolocation: mockGeolocation,
    })
    mockGeolocation.getCurrentPosition.mockReset()
  })

  // 훅이 처음 렌더링될 때 기본 상태값들이 올바른지 확인합니다.
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.latitude).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  // 위치 정보 요청이 성공했을 때 위도, 경도 정보가 상태에 반영되는지 확인합니다.
  it("should update state on successful position retrieval", async () => {
    const mockPosition = {
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
        accuracy: 10,
      },
    }

    // getCurrentPosition 호출 시 성공 콜백을 즉시 실행하도록 설정합니다.
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success(mockPosition)
    )

    const { result } = renderHook(() => useGeolocation())

    // 훅의 함수를 호출할 때는 act로 감싸서 상태 업데이트를 보장합니다.
    await act(async () => {
      result.current.getCurrentPosition()
    })

    expect(result.current.latitude).toBe(37.5665)
    expect(result.current.longitude).toBe(126.978)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  // 위치 정보 권한이 거부되었을 때 에러 메시지가 상태에 반영되는지 확인합니다.
  it("should handle permission denied error", async () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED 상수값
      PERMISSION_DENIED: 1,
    }

    // getCurrentPosition 호출 시 실패 콜백을 실행하도록 설정합니다.
    mockGeolocation.getCurrentPosition.mockImplementation((_, error) =>
      error(mockError)
    )

    const { result } = renderHook(() => useGeolocation())

    await act(async () => {
      result.current.getCurrentPosition()
    })

    expect(result.current.error).toBe("위치 정보 접근 권한이 거부되었습니다.")
    expect(result.current.isLoading).toBe(false)
  })
})
