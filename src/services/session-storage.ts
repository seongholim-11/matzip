/**
 * 브라우저의 세션 스토리지(Session Storage)를 안전하게 사용하기 위한 클래스입니다.
 * 세션 스토리지는 탭을 닫으면 데이터가 사라지는 임시 저장소입니다.
 */
class SessionStorage {
  private _isAvailable: boolean // 사용 가능 여부

  constructor() {
    this._isAvailable = this.checkAvailability()
  }

  /**
   * 브라우저가 세션 스토리지를 지원하는지 확인합니다.
   */
  private checkAvailability(): boolean {
    try {
      if (typeof window === "undefined" || !window.sessionStorage) {
        return false
      }
      const testKey = "__session_storage_test__"
      window.sessionStorage.setItem(testKey, "test")
      window.sessionStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * 임시 데이터를 저장합니다.
   */
  setItem(key: string, value: unknown): void {
    if (this._isAvailable) {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    }
  }

  /**
   * 저장된 임시 데이터를 가져옵니다.
   */
  getItem<T>(key: string): T | null {
    if (this._isAvailable) {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  }

  /**
   * 특정 키의 데이터를 삭제합니다.
   */
  removeItem(key: string): void {
    if (this._isAvailable) {
      window.sessionStorage.removeItem(key)
    }
  }

  /**
   * 세션 스토리지의 모든 데이터를 비웁니다.
   */
  clear(): void {
    if (this._isAvailable) {
      window.sessionStorage.clear()
    }
  }

  /**
   * 현재 세션 스토리지를 사용할 수 있는지 여부를 확인합니다.
   */
  get available(): boolean {
    return this._isAvailable
  }
}

// 인스턴스를 미리 만들어 내보냅니다.
export const sessionStorage = new SessionStorage()
