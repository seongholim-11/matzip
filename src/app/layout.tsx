import type { Metadata, Viewport } from "next"

import { Providers } from "@/components/common/Providers"

import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://matzip.example.com"), // TODO: 실서비스 도메인으로 변경 필요
  title: {
    default: "방송 맛집 지도 - TV와 유튜브 맛집을 한눈에",
    template: "%s | 방송 맛집 지도",
  },
  description:
    "TV 프로그램(성시경 먹을텐데, 맛있는 녀석들, 또간집 등)과 유튜브에 소개된 전국 맛집 정보를 지도에서 쉽게 찾아보세요.",
  keywords: [
    "맛집",
    "방송맛집",
    "성시경",
    "먹을텐데",
    "또간집",
    "이영자",
    "지도",
    "추천",
    "서울맛집",
  ],
  authors: [{ name: "Matzip Team" }],
  creator: "Matzip Team",
  publisher: "Matzip Team",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://matzip.example.com",
    siteName: "방송 맛집 지도",
    title: "방송 맛집 지도 - TV와 유튜브 맛집을 한눈에",
    description:
      "TV와 유튜브에 소개된 맛집을 지도에서 탐색하세요. 믿을 수 있는 미식 가이드.",
    images: [
      {
        url: "/og-image.png", // public 폴더에 이미지 필요
        width: 1200,
        height: 630,
        alt: "방송 맛집 지도 메인 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "방송 맛집 지도",
    description: "TV와 유튜브 맛집을 지도에서 확인하세요.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
}

/**
 * 앱 전체의 기본 뼈대가 되는 레이아웃 파일입니다.
 * 모든 페이지는 이 레이아웃 안의 {children} 부분에 나타나게 됩니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="h-dvh overflow-hidden">
        {/* Providers로 감싸서 앱 전체에서 React Query 등을 쓸 수 있게 함 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
