/**
 * 가격을 한국 원화 형식으로 포맷팅
 * @example formatPrice(15000) => "15,000원"
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @example formatDate("2024-03-15") => "2024년 3월 15일"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 날짜를 짧은 형식으로 포맷팅
 * @example formatDateShort("2024-03-15") => "2024.03.15"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

/**
 * 상대적 시간 표시
 * @example formatRelativeTime("2024-03-15T10:00:00") => "3시간 전"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) return "방금 전"
  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 30) return `${diffDays}일 전`
  if (diffMonths < 12) return `${diffMonths}개월 전`
  return `${diffYears}년 전`
}

/**
 * 전화번호 포맷팅
 * @example formatPhone("0212345678") => "02-1234-5678"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")

  if (cleaned.startsWith("02")) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`
    }
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
}

/**
 * 주소에서 동/구 추출
 * @example extractDistrict("서울특별시 강남구 역삼동 123-45") => "강남구 역삼동"
 */
export function extractDistrict(address: string): string {
  const match = address.match(/([가-힣]+[구군시])\s*([가-힣]+[동읍면리])/)
  return match
    ? `${match[1]} ${match[2]}`
    : address.split(" ").slice(0, 3).join(" ")
}

/**
 * 거리 포맷팅
 * @example formatDistance(1500) => "1.5km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}
