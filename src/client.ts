import { Flags } from './types'

const areFlagsEqual = (flags1: Flags, obj2: Flags) =>
  Object.keys(flags1).length === Object.keys(obj2).length &&
  Object.keys(flags1).every((key) => flags1[key] === obj2[key])

const defaultConfig: { url: string; refetchInterfal?: number } = {
  url: '',
  refetchInterfal: 60 * 1000,
}

export class ItsOnClient {
  debugFlags: Flags
  serverFlags: Flags

  config: { url: string; refetchInterfal?: number } = { url: '' }

  areFlagsFetched: boolean = false

  refetchSubscribers: Array<(flags: Flags) => unknown> = []

  refetchInterval: number | undefined = undefined

  // Вынос флагов defaultFlags и prefetchedFlags в параметры обусловлен
  // переносом ответственности за сборку с библиотеки на конкретный проект
  constructor(config: { url: string; refetchInterfal?: number; defaultFlags?: Flags; prefetchedFlags?: Flags }) {
    const { defaultFlags = {}, prefetchedFlags = {}, ...restConfig } = config
    this.config = { ...defaultConfig, ...restConfig }
    this.debugFlags = defaultFlags
    this.serverFlags = prefetchedFlags
  }

  getFlagValue(flag: string): boolean {
    const formattedFlag = flag.toLowerCase()
    const localFlag = this.debugFlags[formattedFlag]

    if (typeof localFlag !== 'undefined') {
      return localFlag
    }

    return Boolean(this.serverFlags[formattedFlag])
  }

  isActive(flag: string): boolean {
    return this.getFlagValue(flag)
  }

  isNotActive(flag: string): boolean {
    return !this.getFlagValue(flag)
  }

  setDebugFlag(flag: string, value: boolean): void {
    this.debugFlags[flag] = value
  }

  setServerFlags(flags: Flags): void {
    this.serverFlags = flags
  }

  dropDebugFlags() {
    this.debugFlags = {}
  }

  async fetchFlags(): Promise<Flags> {
    try {
      const { result: rawFlags } = await fetch(this.config.url).then<{ count: number; result: string[] }>((response) =>
        response.json()
      )
      const preparedFlags: Flags = Object.fromEntries(rawFlags.map((flag) => [flag.toLowerCase(), true]))

      this.areFlagsFetched = true
      this.setServerFlags(preparedFlags)

      return preparedFlags
    } catch {
      return Promise.resolve({})
    }
  }

  refetch = async () => {
    // Не запрашиваем флаги до первой инициализации.
    if (!this.areFlagsFetched) {
      return
    }

    const oldFlags = { ...this.serverFlags }
    const newFlags = await this.fetchFlags()

    const areFlagsChanged = !areFlagsEqual(oldFlags, newFlags)

    if (!areFlagsChanged) {
      return
    }

    this.setServerFlags(newFlags)

    this.refetchSubscribers.forEach((subscriber) => {
      subscriber(newFlags)
    })
  }

  enableRefetch() {
    if (this.refetchInterval) {
      return
    }

    this.refetchInterval = window.setInterval(this.refetch, this.config.refetchInterfal)
  }

  disableRefetch() {
    clearInterval(this.refetchInterval)
    this.refetchInterval = undefined
  }

  subscribeToRefetch(callback: (flags: Flags) => unknown) {
    this.refetchSubscribers.push(callback)
  }

  unsubscribeFromRefetch(callback: (flags: Flags) => unknown) {
    this.refetchSubscribers = this.refetchSubscribers.filter((cb) => cb === callback)
  }
}
