"use client"

import { useCallback, useMemo } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 현재 쿼리 파라미터를 객체로 변환
  const params = useMemo(() => {
    const obj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }, [searchParams])

  // 특정 키의 값을 가져오기
  const get = useCallback(
    (key: string) => {
      return searchParams.get(key)
    },
    [searchParams]
  )

  // 단일 파라미터 업데이트
  const set = useCallback(
    (key: string, value: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (value === null) {
        current.delete(key)
      } else {
        current.set(key, value)
      }

      const search = current.toString()
      const query = search ? `?${search}` : ""

      router.push(`${pathname}${query}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // 여러 파라미터 한번에 업데이트
  const setMultiple = useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key)
        } else {
          current.set(key, value)
        }
      })

      const search = current.toString()
      const query = search ? `?${search}` : ""

      router.push(`${pathname}${query}`, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // 모든 파라미터 초기화
  const clear = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  return {
    params,
    get,
    set,
    setMultiple,
    clear,
  }
}
