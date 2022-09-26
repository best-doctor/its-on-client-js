import { Flags, FlagsSubscriber, ItsOnClientConfig, ServerResponse } from './types'

const areFlagsEqual = (flags1: Flags, flags2: Flags): boolean =>
  Object.keys(flags1).length === Object.keys(flags2).length &&
  Object.keys(flags1).every((key) => flags1[key] === flags2[key])

const DEFAULT_REFETCH_TIME_INTERVAL = 60 * 1000

export class ItsOnClient<T extends string = string> {
  debugFlags: Flags<T>

  serverFlags: Flags<T>

  url: ItsOnClientConfig['url']

  refetchTimeInterval: ItsOnClientConfig['refetchTimeInterval']

  areFlagsInited = false

  refetchSubscribers: FlagsSubscriber[] = []

  refetchInterval: number | undefined = undefined

  // Вынос флагов debugFlags и prefetchedFlags в параметры обусловлен
  // переносом ответственности за сборку с библиотеки на конкретный проект
  constructor(config: ItsOnClientConfig) {
    const { debugFlags = {}, prefetchedFlags = {}, refetchTimeInterval, url } = config

    this.url = url
    this.refetchTimeInterval = refetchTimeInterval || DEFAULT_REFETCH_TIME_INTERVAL

    this.debugFlags = debugFlags
    this.serverFlags = prefetchedFlags
  }

  getFlagValue(flag: T): boolean {
    const formattedFlag = flag.toLowerCase() as T
    const debugFlag = this.debugFlags[formattedFlag]

    if (typeof debugFlag !== 'undefined') {
      return debugFlag
    }

    return Boolean(this.serverFlags[formattedFlag])
  }

  isActive(flag: T): boolean {
    return this.getFlagValue(flag)
  }

  isNotActive(flag: T): boolean {
    return !this.getFlagValue(flag)
  }

  setDebugFlag(flag: T, value: boolean): void {
    this.debugFlags[flag.toLowerCase() as T] = value
  }

  setServerFlags(flags: Flags): void {
    this.serverFlags = flags
  }

  dropDebugFlags(): void {
    this.debugFlags = {}
  }

  async fetchFlags(): Promise<Flags> {
    try {
      const { result: rawFlags } = await fetch(this.url).then<ServerResponse>((response) => response.json())
      const preparedFlags: Flags = Object.fromEntries(rawFlags.map((flag) => [flag.toLowerCase(), true]))

      this.areFlagsInited = true
      this.setServerFlags(preparedFlags)

      return preparedFlags
    } catch {
      return Promise.resolve({})
    }
  }

  refetch = async (): Promise<void> => {
    // Не перезапрашиваем флаги до первой инициализации.
    if (!this.areFlagsInited) {
      return
    }

    const newFlags = await this.fetchFlags()

    const areFlagsChanged = !areFlagsEqual(this.serverFlags, newFlags)

    if (!areFlagsChanged) {
      return
    }

    this.setServerFlags(newFlags)

    this.refetchSubscribers.forEach((subscriber) => {
      subscriber(newFlags)
    })
  }

  enableRefetch(): void {
    if (this.refetchInterval) {
      return
    }

    this.refetchInterval = window.setInterval(() => { this.refetch(); }, this.refetchTimeInterval)
  }

  disableRefetch(): void {
    clearInterval(this.refetchInterval)
    this.refetchInterval = undefined
  }

  subscribeToRefetch(callback: FlagsSubscriber): void {
    this.refetchSubscribers.push(callback)
  }

  unsubscribeFromRefetch(callback: FlagsSubscriber): void {
    this.refetchSubscribers = this.refetchSubscribers.filter((cb) => cb === callback)
  }
}
