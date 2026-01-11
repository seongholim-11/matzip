import { describe, it, expect } from "vitest"

import { cn } from "./utils"

describe("cn utility", () => {
  // 여러 개의 클래스 문자열이 주어졌을 때, 공백으로 구분된 하나의 문자열로 합쳐지는지 확인합니다.
  it("should merge class names", () => {
    expect(cn("a", "b")).toBe("a b")
  })

  // 불리언 조건에 따라 클래스가 포함되거나 제외되는지 확인합니다. (clsx의 기능)
  it("should handle conditional classes", () => {
    expect(cn("a", true && "b", false && "c")).toBe("a b")
  })

  // 동일한 스타일 속성(예: px-2와 px-4)이 중복될 경우, 나중에 오는 클래스가 우선순위를 갖는지 확인합니다. (twMerge의 기능)
  it("should merge tailwind classes properly", () => {
    expect(cn("px-2 py-2", "px-4")).toBe("py-2 px-4")
  })

  // undefined나 null 값이 전달되어도 에러 없이 무시되는지 확인합니다.
  it("should handle undefined and null", () => {
    expect(cn("a", undefined, null)).toBe("a")
  })
})
