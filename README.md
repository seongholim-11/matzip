# Next.js Boilerplate 2508

Next.js 보일러플레이트입니다.

## 주요 기능

### 핵심 기술

- **Next.js 15** - App Router를 사용하는 React 프레임워크
- **React 19** - 동시성 기능을 포함한 최신 React
- **TypeScript** - 타입 안전 개발
- **Tailwind CSS v4** - 유틸리티 우선 CSS 프레임워크

### UI & 컴포넌트

- **shadcn/ui** - 고품질의 커스터마이징 가능한 UI 컴포넌트
- **Radix UI** - 헤드리스, 접근성 기반 컴포넌트 프리미티브
- **Lucide React** - 아름다운 아이콘 라이브러리
- **Class Variance Authority** - 타입 안전 variant 처리

### 개발 도구

- **ESLint** - 커스텀 규칙을 포함한 코드 린팅
- **Prettier** - import 정렬을 포함한 코드 포맷팅
- **Husky** - Git hooks 자동화
- **Commitlint** - Conventional commit 메시지 검증
- **lint-staged** - 프리커밋 코드 포맷팅

### 서비스 & 유틸리티

- **Storage Wrappers** - 타입 안전 localStorage 및 sessionStorage
- **Logger Service** - 구조화된 로깅 유틸리티
- **Utility Functions** - Tailwind 클래스 병합 헬퍼

## 시작하기

### 필수 조건

- Node.js 18+
- pnpm (권장 패키지 매니저)

### 설치

1. 저장소 클론:

```bash
git clone <your-repo-url>
cd boilerplate-nextjs-2508
```

2. 의존성 설치:

```bash
pnpm install
```

3. 개발 서버 시작:

```bash
pnpm dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

## 사용 가능한 스크립트

| 스크립트     | 설명                         |
| ------------ | ---------------------------- |
| `pnpm dev`   | Turbopack으로 개발 서버 시작 |
| `pnpm build` | 프로덕션용 빌드              |
| `pnpm start` | 프로덕션 서버 시작           |
| `pnpm lint`  | ESLint 실행                  |
| `pnpm ui`    | shadcn/ui 컴포넌트 추가      |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈 페이지
├── components/
│   └── ui/                # shadcn/ui 컴포넌트
│       └── button.tsx     # 버튼 컴포넌트
├── lib/
│   └── utils.ts           # 유틸리티 함수
└── services/
    ├── local-storage.ts   # LocalStorage 래퍼
    ├── session-storage.ts # SessionStorage 래퍼
    └── logger.ts          # 로거 서비스
```

## 개발 가이드라인

### 코드 품질

- **ESLint 규칙**: 서비스 사용 패턴을 강제하는 커스텀 규칙
- **Console 금지**: 직접적인 `console` 호출 대신 `logger` 서비스 사용
- **Storage 접근**: 직접적인 `localStorage`/`sessionStorage` 대신 래퍼 서비스 사용

### 커밋 컨벤션

커밋 메시지는 자동으로 검증됩니다.

형식: `<type>(<scope>): <description>`

타입:

- `feat` - 새로운 기능
- `fix` - 버그 수정
- `docs` - 문서
- `style` - 코드 포맷팅
- `refactor` - 코드 리팩토링
- `test` - 테스트
- `build` - 빌드 시스템
- `ci` - CI 설정
- `perf` - 성능 개선
- `chore` - 기타 변경사항

### 컴포넌트 추가

새로운 shadcn/ui 컴포넌트 추가:

```bash
pnpm ui add <component-name>
```

### Storage 서비스

더 나은 에러 처리를 위해 제공된 storage 래퍼를 사용하세요.

```typescript
import { localStorage } from "@/services/local-storage"
import { sessionStorage } from "@/services/session-storage"

// 데이터 저장
localStorage.setItem("key", { data: "value" })
sessionStorage.setItem("temp", "temporary data")

// 타입 안전한 데이터 가져오기
const data = localStorage.getItem<{ data: string }>("key")
const temp = sessionStorage.getItem<string>("temp")

// 가용성 확인
if (localStorage.available) {
  // localStorage 사용 안전
}
```

### 로깅

console 대신 logger 서비스를 사용하세요.

```typescript
import { logger } from "@/services/logger"

logger.info("애플리케이션 시작됨")
logger.warn("이것은 경고입니다")
logger.error("문제가 발생했습니다", error)
logger.debug("디버그 정보", data)
```

## 설정

### Tailwind CSS

- **버전**: v4 (최신)
- **기능**: CSS 변수, 다크 모드 지원
- **플러그인**: 애니메이션, 폼 스타일

### ESLint

- **규칙**: Next.js 권장 + TypeScript + Prettier
- **커스텀 규칙**: 서비스 사용 패턴 강제
- **파일별 설정**: 서비스 파일에 대한 완화된 규칙

### Prettier

- **Import 정렬**: React 우선, 서드파티, 로컬 순
- **Tailwind 플러그인**: 자동 클래스 정렬
- **설정**: 2 스페이스, 세미콜론 없음, 더블 쿼트
# matzip
