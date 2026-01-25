/**
 * 채널별 테마 색상을 정의합니다.
 */
export const CHANNEL_COLORS: Record<string, string> = {
  // 기본 색상
  default: "#f97316", // 주황색 (기본값)

  // 주요 채널/프로그램 매핑 (방송사 또는 프로그램 이름 키워드)
  성시경: "#ea580c", // 진한 주황
  먹을텐데: "#ea580c",
  백종원: "#1d4ed8", // 파랑
  배고파: "#1d4ed8",
  요리비책: "#1d4ed8",
  최자로드: "#b91c1c", // 빨강
  최자: "#b91c1c",
  풍자: "#db2777", // 핑크
  또간집: "#db2777",
  정육왕: "#b45309", // 갈색 (Brownish/Amber) - 고기 테마
  허영만: "#15803d", // 초록
  백반기행: "#15803d",
  홍석천: "#7c3aed", // 보라
  이원일: "#7c3aed",
  전현무계획: "#0ea5e9", // 하늘색
  "토요일은 밥이 좋아": "#eab308", // 노랑
  수요미식회: "#16a34a", // 초록
  "맛있는 녀석들": "#9333ea", // 보라
}

/**
 * 채널명에 따라 적절한 마커 색상을 반환합니다.
 */
export function getMarkerColor(channelName?: string): string {
  if (!channelName) return CHANNEL_COLORS.default

  // 이름에 키워드가 포함되어 있는지 확인
  for (const [keyword, color] of Object.entries(CHANNEL_COLORS)) {
    if (channelName.includes(keyword)) {
      return color
    }
  }

  return CHANNEL_COLORS.default
}
