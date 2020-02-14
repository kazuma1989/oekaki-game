export default class StateStorage<T> {
  constructor(
    readonly storage: Storage = localStorage,
    readonly key = `${StateStorage.name}.root-state`,
    readonly integrityKey = `${StateStorage.name}.integrity`,
  ) {}

  get(): T | undefined {
    try {
      const value = this.storage.getItem(this.key)
      if (!value) return

      const integrity = this.storage.getItem(this.integrityKey)
      if (integrity !== integrityOf(value)) {
        console.debug(`${this.key}: wrong integrity`)
        return
      }

      return JSON.parse(value)
    } catch (e) {
      console.warn(e)

      this.storage.removeItem(this.key)
      this.storage.removeItem(this.integrityKey)
    }
  }

  set(state: T): void {
    try {
      const value = JSON.stringify(state)
      this.storage.setItem(this.key, value)
      this.storage.setItem(this.integrityKey, integrityOf(value))
    } catch (e) {
      console.warn(e)
    }
  }
}

function integrityOf(str: string): string {
  return (2147483648 + hashCodeOf(str)).toString(36)
}

// https://stackoverflow.com/a/8076436
function hashCodeOf(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)

    hash = (hash << 5) - hash + c
    hash = hash & hash // Convert to 32bit integer
  }

  return hash
}
