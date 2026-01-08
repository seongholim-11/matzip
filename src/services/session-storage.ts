class SessionStorage {
  private _isAvailable: boolean

  constructor() {
    this._isAvailable = this.checkAvailability()
  }

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

  setItem(key: string, value: unknown): void {
    if (this._isAvailable) {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    }
  }

  getItem<T>(key: string): T | null {
    if (this._isAvailable) {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  }

  removeItem(key: string): void {
    if (this._isAvailable) {
      window.sessionStorage.removeItem(key)
    }
  }

  clear(): void {
    if (this._isAvailable) {
      window.sessionStorage.clear()
    }
  }

  get available(): boolean {
    return this._isAvailable
  }
}

export const sessionStorage = new SessionStorage()
