export default class StateStorage<T = unknown> {
  constructor(
    readonly storage: Storage = localStorage,
    readonly key = `${StateStorage.name}.root-state`,
  ) {}

  get(): T | undefined {
    try {
      const [state, integrity]: [unknown, unknown] =
        JSON.parse(this.storage.getItem(this.key) ?? 'null') ?? []
      if (!state) return

      const stateJSON = JSON.stringify(state)
      if (integrityOf(stateJSON) !== integrity) {
        throw 'wrong integrity'
      }

      return state as T
    } catch (e) {
      console.warn(e)

      this.clear()
    }
  }

  set(state: T): void {
    try {
      const stateJSON = JSON.stringify(state)
      const integrity = integrityOf(stateJSON)

      this.storage.setItem(
        this.key,
        `[${stateJSON},${JSON.stringify(integrity)}]`,
      )
      console.debug(`${this.key}: saved`)
    } catch (e) {
      console.warn(e)
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(this.key)
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
