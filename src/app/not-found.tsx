import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-6">
        찾으시는 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-medium transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
