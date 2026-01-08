import { NextResponse } from "next/server"

import type { Program } from "@/types/model"

// Mock 프로그램 데이터
const MOCK_PROGRAMS: Program[] = [
  {
    id: "p1",
    name: "맛있는 녀석들",
    channel: "MBC",
    type: "TV",
    logo_url: null,
    description: "대한민국 대표 먹방 프로그램",
  },
  {
    id: "p2",
    name: "성시경의 먹을텐데",
    channel: "유튜브",
    type: "YOUTUBE",
    logo_url: null,
    description: "성시경이 직접 찾아가는 맛집 리뷰",
  },
  {
    id: "p3",
    name: "풍자 또간집",
    channel: "유튜브",
    type: "YOUTUBE",
    logo_url: null,
    description: "풍자가 다시 찾은 맛집",
  },
  {
    id: "p4",
    name: "허영만의 백반기행",
    channel: "TV조선",
    type: "TV",
    logo_url: null,
    description: "허영만이 찾아가는 전국 백반 맛집",
  },
]

export async function GET() {
  return NextResponse.json({
    items: MOCK_PROGRAMS,
    total: MOCK_PROGRAMS.length,
  })
}
