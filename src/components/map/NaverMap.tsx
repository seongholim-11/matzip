"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import Script from "next/script"

import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from "@/lib/constants/categories"
import { getMarkerColor } from "@/lib/constants/colors"
import type { MapBounds, Restaurant } from "@/types/model"

export interface NaverMapRef {
  panTo: (lat: number, lng: number) => void
  zoomIn: () => void
  zoomOut: () => void
  setZoom: (zoom: number) => void
}

interface NaverMapProps {
  restaurants?: Restaurant[]
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  userLocation?: { lat: number; lng: number } | null
  accuracy?: number | null
  onBoundsChanged?: (bounds: MapBounds) => void
  onMarkerClick?: (restaurantId: string) => void
  selectedRestaurantId?: string | null
}

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || ""

/**
 * 네이버 지도 API를 사용하여 지도를 화면에 그리고 제어하는 컴포넌트입니다.
 */
export const NaverMap = forwardRef<NaverMapRef, NaverMapProps>(
  (
    {
      restaurants = [],
      initialCenter = DEFAULT_MAP_CENTER,
      initialZoom = DEFAULT_MAP_ZOOM,
      userLocation,
      accuracy,
      onBoundsChanged,
      onMarkerClick,
      selectedRestaurantId,
    },
    ref
  ) => {
    const mapRef = useRef<HTMLDivElement>(null) // 지도가 그려질 HTML 엘리먼트 참조
    const mapInstanceRef = useRef<naver.maps.Map | null>(null) // 실제 네이버 지도 객체
    const markersRef = useRef<naver.maps.Marker[]>([]) // 현재 지도에 표시된 마커들의 배열
    const userMarkerRef = useRef<naver.maps.Marker | null>(null) // 사용자 현재 위치 마커
    const userCircleRef = useRef<naver.maps.Circle | null>(null) // 사용자 위치 오차 범위 원
    const [isReady, setIsReady] = useState(false) // 지도가 준비되었는지 여부

    // 외부에서 지도 객체에 접근할 수 있도록 methods 노출
    useImperativeHandle(ref, () => ({
      panTo: (lat: number, lng: number) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(new naver.maps.LatLng(lat, lng))
        }
      },
      zoomIn: () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1)
        }
      },
      zoomOut: () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1)
        }
      },
      setZoom: (zoom: number) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(zoom)
        }
      },
    }))

    /**
     * 지도를 초기에 설정하는 함수입니다.
     */
    const initMap = useCallback(() => {
      if (!mapRef.current || !window.naver?.maps) return

      interface ExtendedMapOptions extends naver.maps.MapOptions {
        useStyleMap?: boolean
      }

      // 지도가 처음 켜질 때의 옵션(중심 위치, 확대 레벨 등)을 설정합니다.
      const mapOptions: ExtendedMapOptions = {
        center: new naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: initialZoom,
        minZoom: 6,
        maxZoom: 21,
        zoomControl: false, // 기본 줌 버튼 숨김 (커스텀 버튼 사용)
        mapDataControl: false,
        scaleControl: false,
        logoControl: true, // 네이버 로고 표시
        logoControlOptions: {
          position: naver.maps.Position.BOTTOM_LEFT,
        },
        useStyleMap: true, // 최신 벡터 지도 엔진 활성화 (모바일에서 훨씬 선명함)
      }

      const map = new naver.maps.Map(mapRef.current, mapOptions)
      mapInstanceRef.current = map

      /**
       * 사용자가 지도를 움직여서 '멈췄을 때'(idle 상태) 실행됩니다.
       * 현재 화면에 보이는 영역(동서남북 좌표)을 부모 컴포넌트에 알려줍니다.
       */
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

    /**
     * 사용자 위치 표시 마커 관리
     */
    useEffect(() => {
      if (!isReady || !mapInstanceRef.current) return

      if (userLocation) {
        const position = new naver.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        )

        // 1. 마커 관리
        if (!userMarkerRef.current) {
          userMarkerRef.current = new naver.maps.Marker({
            position,
            map: mapInstanceRef.current,
            icon: {
              content: `
                <div class="user-marker">
                  <div class="user-marker-pulse"></div>
                  <div class="user-marker-dot"></div>
                </div>
              `,
              size: new naver.maps.Size(24, 24),
              anchor: new naver.maps.Point(12, 12),
            },
            zIndex: 100,
          })
        } else {
          userMarkerRef.current.setPosition(position)
        }

        // 2. 오차 범위 원 관리
        if (accuracy) {
          if (!userCircleRef.current) {
            userCircleRef.current = new naver.maps.Circle({
              map: mapInstanceRef.current,
              center: position,
              radius: accuracy,
              fillColor: "#3b82f6",
              fillOpacity: 0.1,
              strokeWeight: 0,
              clickable: false,
              zIndex: 90,
            })
          } else {
            userCircleRef.current.setCenter(position)
            userCircleRef.current.setRadius(accuracy)
          }
        }
      } else {
        // 위치 정보가 없으면 마커와 원 제거
        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null)
          userMarkerRef.current = null
        }
        if (userCircleRef.current) {
          userCircleRef.current.setMap(null)
          userCircleRef.current = null
        }
      }
    }, [userLocation, accuracy, isReady])

    /**
     * 맛집 리스트가 바뀌거나 지도가 준비되면 마커를 새로 그립니다.
     */
    useEffect(() => {
      if (!isReady || !mapInstanceRef.current) return

      // 1. 기존에 그려져 있던 마커들을 지도에서 모두 지웁니다.
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      // 2. 새로운 맛집 리스트를 돌면서 마커를 하나씩 생성합니다.
      restaurants.forEach((restaurant) => {
        // 첫 번째 추천 정보의 채널명을 확인하여 색상 결정
        const channelName = restaurant.recommendations?.[0]?.source?.name
        const markerColor = getMarkerColor(channelName)
        const isSelected = selectedRestaurantId === restaurant.id

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(
            restaurant.latitude,
            restaurant.longitude
          ),
          map: mapInstanceRef.current!,
          title: restaurant.name,
          zIndex: isSelected ? 1000 : 100,
          // 마커의 모양(디자인)을 직접 HTML과 CSS로 정의합니다.
          icon: {
            content: `
            <div class="marker ${isSelected ? "marker--selected" : ""}">
              ${isSelected ? '<div class="marker-pulse" style="background-color: ' + markerColor + '"></div>' : ""}
              <div class="marker-inner" style="color: ${markerColor}">
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

        /** 마커를 클릭했을 때의 동작을 정의합니다. */
        naver.maps.Event.addListener(marker, "click", () => {
          if (onMarkerClick) {
            onMarkerClick(restaurant.id)
          }
        })

        markersRef.current.push(marker)
      })
    }, [restaurants, isReady, selectedRestaurantId, onMarkerClick])

    /**
     * 목록에서 맛집이 선택되면 지도의 중심을 해당 맛집으로 부드럽게 이동시킵니다.
     */
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

    return (
      <>
        <Script
          strategy="afterInteractive"
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`}
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
            transform: scale(1.4);
          }
          .marker-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            /* color는 인라인 스타일로 동적 주입됨 */
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          }
          .marker--selected .marker-inner {
            filter: drop-shadow(0 0 12px currentColor);
            transform: scale(1.1);
            stroke: white;
            stroke-width: 1px;
          }

          .marker-pulse {
            position: absolute;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            opacity: 0.6;
            animation: marker-pulse-anim 2s infinite;
            z-index: -1;
          }

          @keyframes marker-pulse-anim {
            0% {
              transform: scale(0.8);
              opacity: 0.8;
            }
            70% {
              transform: scale(2.5);
              opacity: 0;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }

          .user-marker {
            position: relative;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .user-marker-dot {
            width: 12px;
            height: 12px;
            background-color: #3b82f6;
            border: 2px solid white;
            border-radius: 50%;
            z-index: 2;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
          }
          .user-marker-pulse {
            position: absolute;
            width: 24px;
            height: 24px;
            background-color: #3b82f6;
            border-radius: 50%;
            opacity: 0.4;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% {
              transform: scale(0.5);
              opacity: 0.8;
            }
            70% {
              transform: scale(1.5);
              opacity: 0;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </>
    )
  }
)

NaverMap.displayName = "NaverMap"
