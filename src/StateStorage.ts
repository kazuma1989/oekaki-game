export default class StateStorage<T> {
  constructor(
    readonly storage: Storage = localStorage,
    readonly key = `${StateStorage.name}.root-state`,
  ) {}

  get(): T | undefined {
    try {
      return JSON.parse(this.storage.getItem(this.key) ?? 'null')
    } catch (e) {
      console.warn(e)
      this.storage.removeItem(this.key)

      return undefined
    }
  }

  set(state: T): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(state))
    } catch (e) {
      console.warn(e)
    }
  }
}
