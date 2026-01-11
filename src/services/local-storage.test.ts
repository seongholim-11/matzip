import { describe, it, expect, beforeEach, vi } from "vitest"

import { localStorage } from "./local-storage"

describe("LocalStorage Service", () => {
  // 각 테스트 시작 전에 로컬 스토리지를 비우고 모의(Mock) 함수들을 초기화합니다.
  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  // 서비스 초기화 시 브라우저 환경에서 로컬 스토리지를 사용할 수 있는지 확인합니다.
  it("should check availability on initialization", () => {
    expect(localStorage.available).toBe(true)
  })

  // 데이터를 저장(setItem)하고 다시 가져올(getItem) 때 데이터의 무결성이 유지되는지 확인합니다.
  // 객체 데이터가 JSON으로 변환되어 저장되고 다시 객체로 변환되어 나오는지 테스트합니다.
  it("should set and get items properly", () => {
    const data = { foo: "bar" }
    localStorage.setItem("test", data)
    expect(localStorage.getItem("test")).toEqual(data)
  })

  // 존재하지 않는 키로 데이터를 요청했을 때 null을 반환하는지 확인합니다.
  it("should return null for non-existent items", () => {
    expect(localStorage.getItem("missing")).toBeNull()
  })

  // 특정 키의 데이터를 삭제했을 때 해당 데이터가 더 이상 존재하지 않는지 확인합니다.
  it("should remove items", () => {
    localStorage.setItem("test", "value")
    localStorage.removeItem("test")
    expect(localStorage.getItem("test")).toBeNull()
  })

  // clear 함수 호출 시 저장된 모든 데이터가 삭제되는지 확인합니다.
  it("should clear all items", () => {
    localStorage.setItem("a", 1)
    localStorage.setItem("b", 2)
    localStorage.clear()
    expect(localStorage.getItem("a")).toBeNull()
    expect(localStorage.getItem("b")).toBeNull()
  })
})
