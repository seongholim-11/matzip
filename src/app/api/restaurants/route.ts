import { NextResponse } from "next/server"

import type { Restaurant } from "@/types/model"

// Mock 데이터 (실제로는 Supabase에서 조회)
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "을지로 골뱅이",
    category: "korean",
    address: "서울특별시 중구 을지로 157",
    road_address: "서울특별시 중구 을지로3가",
    latitude: 37.5665,
    longitude: 126.99,
    phone: "02-2267-1234",
    business_hours: null,
    price_range: "1~2만원",
    thumbnail_url: null,
    parking: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "광화문 미진",
    category: "korean",
    address: "서울특별시 종로구 세종대로 175",
    road_address: "서울특별시 종로구 세종로",
    latitude: 37.5723,
    longitude: 126.9769,
    phone: "02-735-7890",
    business_hours: null,
    price_range: "만원 미만",
    thumbnail_url: null,
    parking: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "명동 칼국수",
    category: "korean",
    address: "서울특별시 중구 명동길 25",
    road_address: "서울특별시 중구 명동2가",
    latitude: 37.5636,
    longitude: 126.9859,
    phone: "02-776-5678",
    business_hours: null,
    price_range: "만원 미만",
    thumbnail_url: null,
    parking: false,
    created_at: new Date().toISOString(),
  },
]

/**
 * 맛집 목록을 가져오는 API 핸들러입니다. (GET 요청 처리)
 * 검색어, 카테고리, 페이지네이션 등의 조건을 처리합니다.
 */
export async function GET(request: Request) {
  // URL에서 쿼리 파라미터(예: ?keyword=피자)를 추출합니다.
  const { searchParams } = new URL(request.url)

  const _lat = searchParams.get("lat")
  const _lng = searchParams.get("lng")
  const _radius = searchParams.get("radius")
  const keyword = searchParams.get("keyword")
  const category = searchParams.get("category")
  const _programId = searchParams.get("program_id")
  const page = parseInt(searchParams.get("page") || "1") // 기본값 1페이지
  const limit = parseInt(searchParams.get("limit") || "20") // 한 페이지에 20개씩

  // 전체 맛집 목록에서 필터링을 시작합니다.
  let filteredRestaurants = [...MOCK_RESTAURANTS]

  // 키워드 검색 기능 (이름이나 주소에 키워드가 포함되어 있는지 확인)
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    filteredRestaurants = filteredRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerKeyword) ||
        r.address.toLowerCase().includes(lowerKeyword)
    )
  }

  // 카테고리 필터 기능 (예: '한식'만 보기)
  if (category) {
    filteredRestaurants = filteredRestaurants.filter(
      (r) => r.category === category
    )
  }

  // TODO: 위치 기반 필터링 (위도, 경도, 반경 활용)
  // TODO: 방송 프로그램 필터링

  // 요청한 페이지에 맞는 데이터만 잘라냅니다. (페이지네이션)
  const startIndex = (page - 1) * limit
  const paginatedRestaurants = filteredRestaurants.slice(
    startIndex,
    startIndex + limit
  )

  // 결과 데이터와 함께 전체 개수, 현재 페이지 정보를 응답으로 보냅니다.
  return NextResponse.json({
    items: paginatedRestaurants,
    total: filteredRestaurants.length,
    page,
    limit,
  })
}
