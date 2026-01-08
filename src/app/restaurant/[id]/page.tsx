import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DetailView } from "@/components/restaurant/DetailView"
import type { RestaurantDetail } from "@/types/model"

// Mock 데이터 가져오기 함수
async function getRestaurant(id: string): Promise<RestaurantDetail | null> {
  // TODO: 실제 API 호출로 교체
  const mockRestaurant: RestaurantDetail = {
    id,
    name: "을지로 골뱅이",
    category: "korean",
    address: "서울특별시 중구 을지로 157",
    road_address: "서울특별시 중구 을지로3가",
    latitude: 37.5665,
    longitude: 126.99,
    phone: "02-2267-1234",
    business_hours: {
      월: { open: "11:00", close: "22:00" },
      화: { open: "11:00", close: "22:00" },
      수: { open: "11:00", close: "22:00" },
      목: { open: "11:00", close: "22:00" },
      금: { open: "11:00", close: "22:00" },
      토: { open: "11:00", close: "22:00" },
      일: { open: "11:00", close: "22:00", closed: true },
    },
    price_range: "1~2만원",
    thumbnail_url: null,
    parking: false,
    created_at: new Date().toISOString(),
    menus: [
      {
        id: "m1",
        restaurant_id: id,
        name: "골뱅이 소면",
        price: 15000,
        is_main: true,
        image_url: null,
      },
      {
        id: "m2",
        restaurant_id: id,
        name: "무침회",
        price: 20000,
        is_main: false,
        image_url: null,
      },
    ],
    appearances: [
      {
        id: "a1",
        restaurant_id: id,
        program_id: "p1",
        episode: "241회",
        air_date: "2024-01-15",
        youtube_link: "https://youtube.com/watch?v=example",
        featured_menu: "골뱅이 소면",
        program: {
          id: "p1",
          name: "맛있는 녀석들",
          channel: "MBC",
          type: "TV",
          logo_url: null,
          description: null,
        },
      },
    ],
  }

  // 간단한 검증 (실제로는 DB 조회)
  if (!id || id.length > 100) return null
  return mockRestaurant
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
    return { title: "맛집을 찾을 수 없습니다" }
  }

  return {
    title: `${restaurant.name} | 방송 맛집 지도`,
    description: `${restaurant.name} - ${restaurant.address}. 방송에 소개된 맛집 정보를 확인하세요.`,
    openGraph: {
      title: restaurant.name,
      description: `${restaurant.address} - ${restaurant.category}`,
      images: restaurant.thumbnail_url ? [restaurant.thumbnail_url] : [],
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

  return (
    <div className="bg-background min-h-dvh">
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
