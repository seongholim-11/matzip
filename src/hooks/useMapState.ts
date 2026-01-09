"use client"

import { useCallback, useState } from "react"

import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_ZOOM_RANGE,
} from "@/lib/constants/categories"
import type { MapBounds, MapState } from "@/types/model"

interface UseMapStateOptions {
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
}

/**
 * 지도의 중심 위치와 확대 레벨(줌) 상태를 관리하는 훅입니다.
 */
export function useMapState(options: UseMapStateOptions = {}) {
  const [mapState, setMapState] = useState<MapState>({
    center: options.initialCenter ?? DEFAULT_MAP_CENTER, // 기본 중심 좌표
    zoom: options.initialZoom ?? DEFAULT_MAP_ZOOM, // 기본 줌 레벨
  })

  const [bounds, setBounds] = useState<MapBounds | null>(null)

  // 중심 좌표 변경
  const setCenter = useCallback((lat: number, lng: number) => {
    setMapState((prev) => ({
      ...prev,
      center: { lat, lng },
    }))
  }, [])

  // 줌 레벨 변경
  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.min(
      Math.max(zoom, MAP_ZOOM_RANGE.min),
      MAP_ZOOM_RANGE.max
    )
    setMapState((prev) => ({
      ...prev,
      zoom: clampedZoom,
    }))
  }, [])

  // 줌 인
  const zoomIn = useCallback(() => {
    setZoom(mapState.zoom + 1)
  }, [mapState.zoom, setZoom])

  // 줌 아웃
  const zoomOut = useCallback(() => {
    setZoom(mapState.zoom - 1)
  }, [mapState.zoom, setZoom])

  // 지도 범위 업데이트
  const updateBounds = useCallback((newBounds: MapBounds) => {
    setBounds(newBounds)
  }, [])

  // 기본 위치로 리셋
  const reset = useCallback(() => {
    setMapState({
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    })
  }, [])

  return {
    ...mapState,
    bounds,
    setCenter,
    setZoom,
    zoomIn,
    zoomOut,
    updateBounds,
    reset,
  }
}
