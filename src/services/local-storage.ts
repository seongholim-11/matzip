/**
 * 브라우저의 로컬 스토리지(Local Storage)를 안전하게 사용하기 위한 클래스입니다.
 * 로컬 스토리지는 브라우저를 껐다 켜도 데이터가 유지됩니다.
 */
class LocalStorage {
  private _isAvailable: boolean // 로컬 스토리지를 사용할 수 있는 상태인지 저장

  constructor() {
    this._isAvailable = this.checkAvailability()
  }

  /**
   * 브라우저가 로컬 스토리지를 지원하는지, 그리고 현재 사용 가능한지 확인합니다.
   */
  private checkAvailability(): boolean {
    try {
      // 서버 사이드 렌더링(Next.js) 환경에서는 window가 없으므로 false 반환
      if (typeof window === "undefined" || !window.localStorage) {
        return false
      }
      // 실제로 데이터를 쓰고 지워보며 권한이나 용량 문제가 없는지 테스트
      const testKey = "__local_storage_test__"
      window.localStorage.setItem(testKey, "test")
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * 데이터를 저장합니다.
   * @param key 저장할 이름
   * @param value 저장할 값 (객체나 배열 등 모든 타입 가능)
   */
  setItem(key: string, value: unknown): void {
    if (this._isAvailable) {
      // 자바스크립트 객체를 문자열(JSON)로 변환하여 저장합니다.
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  /**
   * 저장된 데이터를 가져옵니다.
   * @param key 가져올 데이터의 이름
   * @returns 파싱된 데이터 혹은 null
   */
  getItem<T>(key: string): T | null {
    if (this._isAvailable) {
      const item = window.localStorage.getItem(key)
      // 문자열로 저장된 JSON을 다시 자바스크립트 객체로 변환하여 반환합니다.
      return item ? JSON.parse(item) : null
    }
    return null
  }

  /**
   * 특정 키의 데이터를 삭제합니다.
   */
  removeItem(key: string): void {
    if (this._isAvailable) {
      window.localStorage.removeItem(key)
    }
  }

  /**
   * 로컬 스토리지의 모든 데이터를 비웁니다.
   */
  clear(): void {
    if (this._isAvailable) {
      window.localStorage.clear()
    }
  }

  /**
   * 현재 로컬 스토리지를 사용할 수 있는지 여부를 반환합니다.
   */
  get available(): boolean {
    return this._isAvailable
  }
}

// 어디서든 편하게 쓸 수 있도록 미리 인스턴스를 만들어 내보냅니다.
export const localStorage = new LocalStorage()
