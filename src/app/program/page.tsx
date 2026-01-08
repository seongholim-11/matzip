import { Tv, Youtube } from "lucide-react"
import Link from "next/link"

import type { Program } from "@/types/model"

// Mock 프로그램 데이터
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
  {
    id: "p4",
    name: "허영만의 백반기행",
    channel: "TV조선",
    type: "TV",
    logo_url: null,
    description:
      "만화가 허영만이 전국 방방곡곡 숨겨진 백반집을 찾아 떠나는 미식 여행",
  },
]

export const metadata = {
  title: "프로그램 목록 | 방송 맛집 지도",
  description: "TV와 유튜브에서 맛집을 소개하는 프로그램들을 모아봤습니다.",
}

export default function ProgramListPage() {
  const tvPrograms = MOCK_PROGRAMS.filter((p) => p.type === "TV")
  const youtubePrograms = MOCK_PROGRAMS.filter((p) => p.type === "YOUTUBE")

  return (
    <div className="bg-background min-h-dvh">
      {/* 헤더 */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <Tv className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">방송 맛집 지도</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">프로그램 목록</h1>

        {/* TV 프로그램 */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <Tv className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">TV 프로그램</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {tvPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>

        {/* 유튜브 채널 */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-bold">유튜브 채널</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {youtubePrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={`/program/${program.id}`}
      className="group bg-card hover:border-primary rounded-xl border p-5 transition-all hover:shadow-lg"
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            program.type === "TV" ? "bg-blue-100" : "bg-red-100"
          }`}
        >
          {program.type === "TV" ? (
            <Tv className="h-6 w-6 text-blue-600" />
          ) : (
            <Youtube className="h-6 w-6 text-red-600" />
          )}
        </div>
        <div>
          <h3 className="group-hover:text-primary font-bold">{program.name}</h3>
          <p className="text-muted-foreground text-sm">{program.channel}</p>
        </div>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {program.description}
      </p>
    </Link>
  )
}
