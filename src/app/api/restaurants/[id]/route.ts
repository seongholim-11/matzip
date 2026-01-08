import { NextResponse } from "next/server"

import type { RestaurantDetail } from "@/types/model"

// Mock 상세 데이터
const MOCK_RESTAURANT_DETAIL: RestaurantDetail = {
  id: "1",
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
      restaurant_id: "1",
      name: "골뱅이 소면",
      price: 15000,
      is_main: true,
      image_url: null,
    },
    {
      id: "m2",
      restaurant_id: "1",
      name: "무침회",
      price: 20000,
      is_main: false,
      image_url: null,
    },
  ],
  appearances: [
    {
      id: "a1",
      restaurant_id: "1",
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Mock: id로 맛집 찾기 (실제로는 Supabase 조회)
  if (id === "1" || id === "2" || id === "3") {
    return NextResponse.json({
      data: { ...MOCK_RESTAURANT_DETAIL, id },
      error: null,
    })
  }

  return NextResponse.json(
    { data: null, error: "Restaurant not found" },
    { status: 404 }
  )
}
