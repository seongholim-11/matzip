"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import Script from "next/script"

import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/lib/constants/categories"
import type { MapBounds, Restaurant } from "@/types/model"

interface NaverMapProps {
  restaurants?: Restaurant[]
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  onBoundsChanged?: (bounds: MapBounds) => void
  onMarkerClick?: (restaurantId: string) => void
  selectedRestaurantId?: string | null
}

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || ""

export function NaverMap({
  restaurants = [],
  initialCenter = DEFAULT_MAP_CENTER,
  initialZoom = DEFAULT_MAP_ZOOM,
  onBoundsChanged,
  onMarkerClick,
  selectedRestaurantId,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const markersRef = useRef<naver.maps.Marker[]>([])
  const [isReady, setIsReady] = useState(false)

  // 지도 초기화
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.naver?.maps) return

    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
      zoom: initialZoom,
      minZoom: 6,
      maxZoom: 21,
      zoomControl: false,
      mapDataControl: false,
      scaleControl: false,
      logoControl: true,
      logoControlOptions: {
        position: naver.maps.Position.BOTTOM_LEFT,
      },
    }

    const map = new naver.maps.Map(mapRef.current, mapOptions)
    mapInstanceRef.current = map

    // 지도 이동 완료 시 bounds 업데이트
    naver.maps.Event.addListener(map, "idle", () => {
      if (onBoundsChanged) {
        const bounds = map.getBounds() as naver.maps.LatLngBounds
        const ne = bounds.getNE()
        const sw = bounds.getSW()
        onBoundsChanged({
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng(),
        })
      }
    })

    setIsReady(true)
  }, [initialCenter, initialZoom, onBoundsChanged])

  // 마커 생성/업데이트
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // 새 마커 생성
    restaurants.forEach((restaurant) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          restaurant.latitude,
          restaurant.longitude
        ),
        map: mapInstanceRef.current!,
        title: restaurant.name,
        icon: {
          content: `
            <div class="marker ${selectedRestaurantId === restaurant.id ? "marker--selected" : ""}">
              <div class="marker-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
          `,
          size: new naver.maps.Size(36, 36),
          anchor: new naver.maps.Point(18, 36),
        },
      })

      naver.maps.Event.addListener(marker, "click", () => {
        if (onMarkerClick) {
          onMarkerClick(restaurant.id)
        }
      })

      markersRef.current.push(marker)
    })
  }, [restaurants, isReady, selectedRestaurantId, onMarkerClick])

  // 선택된 맛집으로 지도 이동
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !selectedRestaurantId) return

    const selectedRestaurant = restaurants.find(
      (r) => r.id === selectedRestaurantId
    )
    if (selectedRestaurant) {
      mapInstanceRef.current.panTo(
        new naver.maps.LatLng(
          selectedRestaurant.latitude,
          selectedRestaurant.longitude
        )
      )
    }
  }, [selectedRestaurantId, restaurants, isReady])

  // 외부에서 지도 객체 접근용 함수들
  const panTo = useCallback((lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(new naver.maps.LatLng(lat, lng))
    }
  }, [])

  const setZoom = useCallback((zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [])

  const zoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1)
    }
  }, [])

  const zoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1)
    }
  }, [])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_CLIENT_ID}`}
        onReady={initMap}
      />
      <div ref={mapRef} className="h-full w-full" />

      <style jsx global>{`
        .marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .marker:hover,
        .marker--selected {
          transform: scale(1.2);
        }
        .marker-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #f97316;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        .marker--selected .marker-inner {
          color: #dc2626;
        }
      `}</style>
    </>
  )
}
