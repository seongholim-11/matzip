import type { Metadata } from "next"

import type { Restaurant, RestaurantDetail } from "@/types/model"

const SITE_NAME = "방송 맛집 지도"
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://matzip.example.com"
const DEFAULT_DESCRIPTION =
  "TV 프로그램과 유튜브에 소개된 맛집들을 지도에서 찾아보세요. 성시경의 먹을텐데, 맛있는 녀석들, 풍자 또간집 등 인기 프로그램의 맛집 정보를 한눈에!"

interface SeoParams {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}

/**
 * 기본 메타데이터 생성
 */
export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/og-image.png",
  url = SITE_URL,
  noIndex = false,
}: SeoParams = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * 맛집 상세 페이지용 메타데이터 생성
 */
export function generateRestaurantMetadata(
  restaurant: Restaurant | RestaurantDetail
): Metadata {
  const title = restaurant.name
  const description = `${restaurant.name} - ${restaurant.address}. 방송에 소개된 맛집 정보를 확인하세요.`

  return generateMetadata({
    title,
    description,
    image: restaurant.thumbnail_url || undefined,
    url: `${SITE_URL}/restaurant/${restaurant.id}`,
  })
}

/**
 * 구조화된 데이터 (JSON-LD) 생성
 */
export function generateRestaurantJsonLd(restaurant: RestaurantDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      addressLocality: "대한민국",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    telephone: restaurant.phone,
    image: restaurant.thumbnail_url,
    priceRange: restaurant.price_range,
    servesCuisine: restaurant.category,
  }
}
