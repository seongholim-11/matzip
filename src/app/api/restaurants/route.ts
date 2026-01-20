import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * 맛집 목록을 가져오는 API 핸들러입니다. (GET 요청 처리)
 * Supabase 데이터베이스에서 데이터를 조회하며 검색어, 카테고리 필터링 및 페이지네이션을 수행합니다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createServerSupabaseClient()

  const keyword = searchParams.get("keyword")
  const category = searchParams.get("category")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const from = (page - 1) * limit
  const to = from + limit - 1

  // 기본 쿼리 구성: 카테고리 정보를 포함하여 조회
  const programs = searchParams.get("programs")

  // 프로그램 필터가 있으면 inner join을 사용하여 해당 프로그램에 속한 식당만 조회
  const recommendationsJoin = programs
    ? "restaurant_recommendations!inner(source_id)"
    : "restaurant_recommendations(source_id)"

  let query = supabase.from("restaurants").select(
    `
      id,
      name,
      address,
      road_address,
      phone,
      price_range,
      parking,
      thumbnail_url,
      created_at,
      location,
      category:categories(name),
      ${recommendationsJoin}
    `,
    { count: "exact" }
  )

  // 키워드 검색 (이름 또는 주소)
  if (keyword) {
    query = query.or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
  }

  // 카테고리 필터
  if (category) {
    query = query.filter("categories.name", "eq", category)
  }

  // 프로그램 필터 (멀티 선택)
  if (programs) {
    const programIds = programs.split(",")
    query = query.in("restaurant_recommendations.source_id", programIds)
  }

  // 페이지네이션 및 정렬
  query = query.order("created_at", { ascending: false }).range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  interface SupabaseRestaurant {
    id: string
    name: string
    address: string
    road_address: string
    phone: string
    price_range: string
    parking: boolean
    thumbnail_url: string
    created_at: string
    location: { coordinates: [number, number] } | null
    category: { name: string } | null
  }

  // 데이터 가공: nested category와 PostGIS geography 데이터를 평탄화(flatten)합니다.
  const items = ((data as unknown as SupabaseRestaurant[]) || []).map((r) => {
    // PostGIS geography (POINT) 파싱 (GeoJSON 형태 혹은 WKT일 수 있으나 supabase-js는 보통 파싱을 요구함)
    // 여기서는 간단하게 SQL에서 추출하는 대신 JS에서 처리하거나 SQL query를 수정할 수 있음.
    // 하지만 select 절에서 직접 위경도를 가져오는 것이 더 깔끔함.

    // 만약 location이 문자열(WKT)로 온다면 파싱이 필요함.
    // 여기서는 supabase-js의 기본 반환 형식을 고려하여 안전하게 처리합니다.
    return {
      ...r,
      category: r.category?.name || "기타",
      // PostGIS Point 데이터는 보통 { type: 'Point', coordinates: [lng, lat] } 형식으로 옴
      latitude: r.location?.coordinates ? r.location.coordinates[1] : null,
      longitude: r.location?.coordinates ? r.location.coordinates[0] : null,
      location: undefined, // 원본 location 필드는 제거
    }
  })

  return NextResponse.json({
    items,
    total: count || 0,
    page,
    limit,
  })
}
