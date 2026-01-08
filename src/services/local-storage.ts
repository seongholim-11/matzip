class LocalStorage {
  private _isAvailable: boolean

  constructor() {
    this._isAvailable = this.checkAvailability()
  }

  private checkAvailability(): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false
      }
      const testKey = "__local_storage_test__"
      window.localStorage.setItem(testKey, "test")
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  setItem(key: string, value: unknown): void {
    if (this._isAvailable) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  getItem<T>(key: string): T | null {
    if (this._isAvailable) {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  }

  removeItem(key: string): void {
    if (this._isAvailable) {
      window.localStorage.removeItem(key)
    }
  }

  clear(): void {
    if (this._isAvailable) {
      window.localStorage.clear()
    }
  }

  get available(): boolean {
    return this._isAvailable
  }
}

export const localStorage = new LocalStorage()
