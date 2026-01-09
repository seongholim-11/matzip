"use client"

import { Car, Clock, MapPin, Phone, Tv } from "lucide-react"
import Image from "next/image"

import { getCategoryName } from "@/lib/constants/categories"
import { formatPhone } from "@/lib/utils/formatting"
import type { RestaurantDetail } from "@/types/model"

import { ActionButtons } from "./ActionButtons"
import { MenuList } from "./MenuList"

interface DetailViewProps {
  restaurant: RestaurantDetail
}

/**
 * 맛집의 모든 상세 정보를 보여주는 컴포넌트입니다.
 * 사진, 방송 출연 정보, 메뉴, 영업 시간 등을 포함합니다.
 */
export function DetailView({ restaurant }: DetailViewProps) {
  return (
    <div className="space-y-6">
      {/* 상단 큰 이미지 (배경처럼 보여줌) */}
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-xl">
        {restaurant.thumbnail_url ? (
          <Image
            src={restaurant.thumbnail_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority // 이 이미지는 중요하므로 빨리 불러오도록 함
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="text-muted-foreground h-12 w-12" />
          </div>
        )}
      </div>

      {/* 기본 정보 */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="bg-muted rounded-full px-3 py-1 text-sm">
            {getCategoryName(restaurant.category)}
          </span>
          {restaurant.price_range && (
            <span className="bg-muted rounded-full px-3 py-1 text-sm">
              {restaurant.price_range}
            </span>
          )}
        </div>

        <h1 className="mb-4 text-2xl font-bold">{restaurant.name}</h1>

        {/* 방송 출연 정보 (데이터가 있는 경우에만 보여줌) */}
        {restaurant.appearances && restaurant.appearances.length > 0 && (
          <div className="mb-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-orange-700">
              <Tv className="h-4 w-4" />
              <span className="font-medium">방송 출연</span>
            </div>
            <div className="space-y-2">
              {restaurant.appearances.map((appearance) => (
                <div key={appearance.id} className="text-sm">
                  <span className="font-medium">
                    {appearance.program?.name ?? "프로그램"}
                  </span>
                  {appearance.episode && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {appearance.episode}
                    </span>
                  )}
                  {appearance.featured_menu && (
                    <p className="text-muted-foreground mt-1">
                      추천 메뉴: {appearance.featured_menu}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 위치, 전화번호, 영업시간 등 상세 내용 목록 */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{restaurant.address}</p>
              {restaurant.road_address &&
                restaurant.road_address !== restaurant.address && (
                  <p className="text-muted-foreground">
                    {restaurant.road_address}
                  </p>
                )}
            </div>
          </div>

          {restaurant.phone && (
            <div className="flex items-center gap-3">
              <Phone className="text-muted-foreground h-4 w-4" />
              <a
                href={`tel:${restaurant.phone}`}
                className="text-primary hover:underline"
              >
                {formatPhone(restaurant.phone)}
              </a>
            </div>
          )}

          {restaurant.business_hours && (
            <div className="flex items-start gap-3">
              <Clock className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div>
                {/* 월, 화, 수... 요일별 시간을 돌면서 표시 */}
                {Object.entries(restaurant.business_hours).map(
                  ([day, hours]) => (
                    <p key={day}>
                      <span className="font-medium">{day}:</span>{" "}
                      {hours.closed ? "휴무" : `${hours.open} - ${hours.close}`}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          {restaurant.parking && (
            <div className="flex items-center gap-3">
              <Car className="text-muted-foreground h-4 w-4" />
              <span>주차 가능 (방문 전 확인 권장)</span>
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 */}
      {restaurant.menus && restaurant.menus.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold">메뉴</h2>
          <MenuList menus={restaurant.menus} />
        </div>
      )}

      {/* 액션 버튼 */}
      <ActionButtons restaurant={restaurant} />
    </div>
  )
}
