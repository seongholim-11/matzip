const axios = require("axios")

// [변수 설정] 이 부분을 수정하며 테스트하세요!
const program = "성시경의 먹을텐데"
const keyword = "여의도 화목순대국"

async function testNaverSearch(prog, kw) {
  const searchQuery = `${kw}` // 필요 시 '${prog} ${kw}' 로 조합 가능

  console.log(`\n🔍 검색 시작: [${prog}] ${searchQuery}`)
  console.log("--------------------------------------------")

  try {
    const response = await axios.get(
      "https://openapi.naver.com/v1/search/local.json",
      {
        headers: {
          "X-Naver-Client-Id": "Gb0G9AUQ8Yc7DbK6c0YR",
          "X-Naver-Client-Secret": "uHCRXL6Gav",
        },
        params: {
          query: searchQuery,
          display: 5, // 검색 결과 5개까지 확인
          start: 1,
          sort: "random", // 유사도 순
        },
      }
    )

    const items = response.data.items

    if (items.length > 0) {
      items.forEach((item, index) => {
        console.log(`[결과 ${index + 1}]`)
        console.log(`📌 식당명: ${item.title.replace(/<[^>]*>?/gm, "")}`) // HTML 태그 제거
        console.log(`📍 주소: ${item.roadAddress || item.address}`)
        console.log(`🗺️ 좌표(TM128): X=${item.mapx}, Y=${item.mapy}`)
        console.log(`🔗 링크: ${item.link || "없음"}`)
        console.log("--------------------------------------------")
      })
    } else {
      console.log("❌ 검색 결과가 없습니다. 키워드를 확인해주세요.")
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `⚠️ 에러 발생: ${error.response.status} - ${error.response.data.errorMessage}`
      )
    } else {
      console.error("⚠️ 에러 발생:", error.message)
    }
  }
}

testNaverSearch(program, keyword)
