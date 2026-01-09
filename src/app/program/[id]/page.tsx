import { ArrowLeft, Tv, Youtube } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { RestaurantCard } from "@/components/restaurant/RestaurantCard"
import type { Program, Restaurant } from "@/types/model"

// Mock 데이터
const MOCK_PROGRAMS: Program[] = [
  {
    id: "p1",
    name: "맛있는 녀석들",
    channel: "MBC",
    type: "TV",
    logo_url: null,
    description:
      "대한민국 대표 먹방 프로그램. 김준현, 문세윤, 김민경이 전국의 맛집을 찾아갑니다.",
  },
  {
    id: "p2",
    name: "성시경의 먹을텐데",
    channel: "유튜브",
    type: "YOUTUBE",
    logo_url: null,
    description:
      "가수 성시경이 직접 찾아가는 맛집 먹방. 솔직한 리뷰가 인기입니다.",
  },
  {
    id: "p3",
    name: "풍자 또간집",
    channel: "유튜브",
    type: "YOUTUBE",
    logo_url: null,
    description: "먹방 유튜버 풍자가 다시 찾은 진짜 맛집만 소개합니다.",
  },
]

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
]

/** ID로 프로그램 정보를 가져오는 (가상의) 함수입니다. */
async function getProgram(id: string): Promise<Program | null> {
  return MOCK_PROGRAMS.find((p) => p.id === id) ?? null
}

/** 해당 프로그램에 출연한 맛집 목록을 가져오는 (가상의) 함수입니다. */
async function getProgramRestaurants(
  _programId: string
): Promise<Restaurant[]> {
  // Mock: 모든 맛집 반환 (실제로는 해당 프로그램에 출연한 맛집만 DB에서 골라옵니다)
  return MOCK_RESTAURANTS
}

/**
 * 이 페이지의 제목(Title)과 설명(Description)을 동적으로 생성합니다.
 * 검색 엔진이나 링크 공유 시에 활용됩니다.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const program = await getProgram(id)

  if (!program) {
    return { title: "프로그램을 찾을 수 없습니다" }
  }

  return {
    title: `${program.name} 맛집 | 방송 맛집 지도`,
    description: program.description,
  }
}

/**
 * 특정 방송 프로그램의 상세 정보와 해당 방송에 나온 맛집들을 보여주는 페이지입니다.
 */
export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const program = await getProgram(id) // 프로그램 정보 조회

  // 프로그램이 없으면 404 페이지를 보여줍니다.
  if (!program) {
    notFound()
  }

  const restaurants = await getProgramRestaurants(id) // 맛집 목록 조회

  return (
    <div className="bg-background min-h-dvh">
      {/* 상단 네비게이션 헤더 */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 flex h-14 items-center gap-4 border-b px-4 backdrop-blur">
        <Link
          href="/program"
          className="hover:bg-muted flex h-10 w-10 items-center justify-center rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 truncate text-lg font-bold">{program.name}</h1>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 프로그램 요약 정보 카드 */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-6">
          <div className="mb-4 flex items-center gap-4">
            {/* TV인지 유튜브인지에 따른 아이콘 표시 */}
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                program.type === "TV" ? "bg-blue-100" : "bg-red-100"
              }`}
            >
              {program.type === "TV" ? (
                <Tv className="h-8 w-8 text-blue-600" />
              ) : (
                <Youtube className="h-8 w-8 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{program.name}</h2>
              <p className="text-muted-foreground">{program.channel}</p>
            </div>
          </div>
          <p className="text-muted-foreground">{program.description}</p>
        </div>

        {/* 맛집 목록 섹션 */}
        <section>
          <h3 className="mb-4 text-xl font-bold">
            소개된 맛집 ({restaurants.length})
          </h3>
          <div className="divide-y rounded-xl border">
            {/* 맛집 리스트를 순회하며 카드 형태로 보여줍니다. */}
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => {}}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
