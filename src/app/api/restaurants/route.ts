import { unstable_cache } from "next/cache"
import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * 맛집 목록을 가져오는 API 핸들러입니다. (GET 요청 처리)
 * Supabase 데이터베이스에서 데이터를 조회하며 검색어, 카테고리 필터링 및 페이지네이션을 수행합니다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const keyword = searchParams.get("keyword")
  const category = searchParams.get("category")
  const page = parseInt(searchParams.get("page") || "1")
  let limit = parseInt(searchParams.get("limit") || "20")
  const programs = searchParams.get("programs")

  // limit이 -1이면 전체 데이터를 가져오기 위해 매우 큰 수로 설정
  if (limit === -1) {
    limit = 10000
  }

  // 캐시 키 생성 (쿼리 파라미터 조합)
  const cacheKey = [
    "restaurants",
    keyword || "all",
    category || "all",
    programs || "all",
    page.toString(),
    limit.toString(),
  ]

  try {
    // unstable_cache를 사용하여 DB 조회 결과 캐싱
    const getCachedRestaurants = unstable_cache(
      async () => {
        const supabase = createServerSupabaseClient()
        const from = (page - 1) * limit
        const to = from + limit - 1

        // 프로그램 필터가 있으면 inner join을 사용하여 해당 프로그램에 속한 식당만 조회
        const recommendationsJoin = programs
          ? "restaurant_recommendations!inner(source_id, source:sources(id, name))"
          : "restaurant_recommendations(source_id, source:sources(id, name))"

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
            latitude,
            longitude,
            category:categories(name),
            recommendations: ${recommendationsJoin}
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
          throw new Error(error.message)
        }

        return { data, count }
      },
      cacheKey,
      {
        revalidate: 3600, // 1시간 동안 캐시 유지
        tags: ["restaurants"],
      }
    )

    const { data, count } = await getCachedRestaurants()

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
      latitude: number
      longitude: number
      category: { name: string } | null
      recommendations: any[]
    }

    // 데이터 가공
    const items = ((data as unknown as SupabaseRestaurant[]) || []).map((r) => {
      return {
        ...r,
        category: r.category?.name || "기타",
        location: undefined,
        latitude: r.latitude,
        longitude: r.longitude,
        recommendations: r.recommendations,
      }
    })

    return NextResponse.json({
      items,
      total: count || 0,
      page,
      limit,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
