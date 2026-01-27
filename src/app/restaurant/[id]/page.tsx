import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DetailView } from "@/components/restaurant/DetailView"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { RestaurantDetail } from "@/types/model"

// Supabase join types
interface SupabaseRestaurantResponse {
  id: string
  name: string
  category_id: string
  category: { name: string } | null
  address: string
  road_address: string
  latitude: number
  longitude: number
  phone: string | null
  price_range: string | null
  thumbnail_url: string | null
  parking: boolean
  created_at: string
  recommendations: {
    id: string
    video_url: string | null
    episode_info: string | null
    featured_date: string | null
    source: {
      id: string
      name: string
      type: "TV" | "YOUTUBE" | "Other"
      description: string | null
      platform_url: string | null
    } | null
  }[]
}

// 실제 데이터 가져오기 함수
async function getRestaurant(id: string): Promise<RestaurantDetail | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("restaurants")
    .select(
      `
      *,
      category:categories(name),
      recommendations:restaurant_recommendations(
        *,
        source:sources(*)
      )
    `
    )
    .eq("id", id)
    .eq("is_delete", false)
    .single()

  if (error || !data) {
    return null
  }

  const r = data as unknown as SupabaseRestaurantResponse

  // Transform to Domain Model
  const restaurantDetail: RestaurantDetail = {
    id: r.id,
    name: r.name,
    category: r.category?.name || "기타",
    address: r.address,
    road_address: r.road_address,
    latitude: r.latitude,
    longitude: r.longitude,
    phone: r.phone,
    business_hours: null, // DB에 영업시간 컬럼이 없음 (현재 스키마 기준)
    price_range: r.price_range,
    thumbnail_url: r.thumbnail_url,
    parking: r.parking,
    created_at: r.created_at,
    menus: [], // DB에 메뉴 정보 없음
    appearances: r.recommendations.map((rec) => ({
      id: rec.id,
      restaurant_id: r.id,
      program_id: rec.source?.id || "",
      episode: rec.episode_info,
      air_date: rec.featured_date,
      youtube_link: rec.video_url,
      featured_menu: null,
      program: rec.source
        ? {
            id: rec.source.id,
            name: rec.source.name,
            channel: "Unknown", // Schema doesn't have channel column
            type:
              rec.source.type === "TV" || rec.source.type === "YOUTUBE"
                ? rec.source.type
                : "TV",
            logo_url: null,
            description: rec.source.description,
          }
        : undefined,
    })),
    // 상위 호환성 유지를 위해 recommendations 필드도 보존
    recommendations: r.recommendations.map((rec) => ({
      source: {
        id: rec.source?.id || "",
        name: rec.source?.name || "",
      },
    })),
  }

  return restaurantDetail
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const restaurant = await getRestaurant(id)

  if (!restaurant) {
    return {
      title: "맛집을 찾을 수 없습니다",
      robots: { index: false, follow: false },
    }
  }

  const broadcastNames = restaurant.appearances
    .map((a) => a.program?.name)
    .filter(Boolean)
    .join(", ")

  const title = `${restaurant.name} - ${restaurant.category} 맛집`
  const description = `${restaurant.name} (${restaurant.category}) - ${restaurant.road_address}. ${broadcastNames ? `방영 프로그램: ${broadcastNames}.` : ""} 리뷰와 위치 정보를 확인하세요.`
  const images = restaurant.thumbnail_url
    ? [restaurant.thumbnail_url]
    : ["/og-image.png"]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images.map((url) => ({ url, width: 1200, height: 630 })),
      type: "article",
    },
    alternates: {
      canonical: `/restaurant/${id}`,
    },
  }
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const restaurant = await getRestaurant(id)

  if (!restaurant) {
    notFound()
  }

  // JSON-LD 구조화된 데이터 생성
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    image: restaurant.thumbnail_url ? [restaurant.thumbnail_url] : [],
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.road_address || restaurant.address,
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    url: `https://matzip.example.com/restaurant/${restaurant.id}`,
    telephone: restaurant.phone,
    priceRange: restaurant.price_range || "가격 정보 없음",
    servesCuisine: restaurant.category,
  }

  return (
    <div className="bg-background min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 헤더 */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex h-14 items-center gap-4 border-b px-4 backdrop-blur">
        <Link
          href="/"
          className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 truncate text-lg font-bold">{restaurant.name}</h1>
      </header>

      {/* 콘텐츠 */}
      <main className="mx-auto max-w-2xl px-4 pt-6 pb-24">
        <DetailView restaurant={restaurant} />
      </main>
    </div>
  )
}
