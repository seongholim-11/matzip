"use client"

import { useCallback, useState } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  isLoading: boolean
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
}

/**
 * 사용자의 현재 GPS 위치(위도, 경도)를 가져오는 기능을 제공하는 훅입니다.
 */
export function useGeolocation(
  options: UseGeolocationOptions = defaultOptions
) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
  })

  /** 브라우저의 전역 객체(navigator)를 이용해 위치를 요청합니다. */
  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "브라우저에서 위치 정보를 지원하지 않습니다.",
        isLoading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
        })
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근 권한이 거부되었습니다."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다."
            break
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다."
            break
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }))
      },
      {
        enableHighAccuracy: options.enableHighAccuracy,
        timeout: options.timeout,
        maximumAge: options.maximumAge,
      }
    )
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge])

  return {
    ...state,
    getCurrentPosition,
    isSupported: typeof navigator !== "undefined" && !!navigator.geolocation,
  }
}
