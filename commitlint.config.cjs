module.exports = {
  rules: {
    // 제목(subject) 규칙
    "subject-empty": [2, "never"], // 제목은 반드시 존재해야 함
    "subject-full-stop": [2, "never", "."], // 제목 끝에 마침표(.) 사용 금지

    // 타입(type) 규칙
    "type-enum": [
      // 허용되는 커밋 타입 목록
      2,
      "always",
      [
        "feat", // 새로운 기능
        "fix", // 버그 수정
        "docs", // 문서 수정
        "style", // 코드 스타일 (포맷팅, 세미콜론 등)
        "refactor", // 코드 리팩토링
        "test", // 테스트 추가/수정
        "build", // 빌드 시스템/의존성
        "ci", // CI 설정
        "perf", // 성능 개선
        "chore", // 기타 변경사항
      ],
    ],
    "type-empty": [2, "never"], // 타입 필수 입력
    "type-case": [2, "always", "lower-case"], // 타입은 소문자만

    // 본문(body) 규칙
    "body-empty": [0, "never"], // 본문은 선택사항 (0 = 비활성)
    "body-leading-blank": [2, "always"], // 제목과 본문 사이 빈 줄 필수

    // 푸터(footer) 규칙
    "footer-leading-blank": [2, "always"], // 본문과 푸터 사이 빈 줄 필수
  },
}
