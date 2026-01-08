import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", // Next.js 권장 규칙 (이미 eslint-config-next 포함)
    "next/typescript", // TypeScript 지원
    "prettier" // Prettier 충돌 방지 (마지막에!)
  ),
  // 커스텀 규칙 추가 가능
  ...compat.config({
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // _로 시작하는 매개변수는 무시
          varsIgnorePattern: "^_", // _로 시작하는 변수는 무시
        },
      ],
      // console 직접 호출 금지
      "no-console": "error",
      // localStorage, sessionStorage 직접 호출 금지
      "no-restricted-globals": [
        "error",
        {
          name: "localStorage",
          message:
            "Use localStorageWrapper from '@/services/localStorage' instead of direct localStorage access.",
        },
        {
          name: "sessionStorage",
          message:
            "Use sessionStorageWrapper from '@/services/sessionStorage' instead of direct sessionStorage access.",
        },
      ],
    },
  }),
  // services 폴더 내에서는 예외 허용
  {
    files: ["src/services/**/*.ts"],
    rules: {
      "no-console": "off",
      "no-restricted-globals": "off",
    },
  },
]

export default eslintConfig
