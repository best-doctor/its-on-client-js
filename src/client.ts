import { Flags, ItsOnClientConfig, ServerResponse } from './types'

const LOG_PREFIX = '[Its On]'

export class ItsOnClient<T extends string = string> {
  debugFlags: Flags<T>

  serverFlags: Flags<T>

  url: ItsOnClientConfig['url']

  constructor(config: ItsOnClientConfig) {
    const { debugFlags = {}, prefetchedFlags = {}, url } = config

    this.url = url;

    this.debugFlags = this.prepareFlags(debugFlags);
    this.serverFlags = this.prepareFlags(prefetchedFlags);
  }

  private prepareFlags(rawFlags: Flags<T>): Flags<T> {
    const entries = Object.entries(rawFlags).map(([key, value]) => [key.toLowerCase(), value]);
    return Object.fromEntries(entries) as Flags<T>;
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

  setServerFlags(flags: Flags<T>): void {
    this.serverFlags = flags
  }

  dropDebugFlags(): void {
    this.debugFlags = {}
  }

  async fetchFlags(): Promise<Flags<T>> {
    try {
      const { result: rawFlags = [] } = await fetch(this.url).then<ServerResponse<T>>((response) => response.json())
      const preparedFlags = this.prepareFlags(Object.fromEntries(rawFlags.map((flag) => [flag, true])) as Flags<T>)

      this.setServerFlags(preparedFlags)

      return preparedFlags
    } catch {
      return Promise.resolve({})
    }
  }

  logFlag = (flag: T): void => {
    // eslint-disable-next-line no-console
    console.log(LOG_PREFIX, `${flag}: ${this.getFlagValue(flag) ? 'on' : 'off'}`)
  }

  logAllFlags = (): void => {
    // eslint-disable-next-line no-console
    console.log(LOG_PREFIX, `Flags: ${JSON.stringify({ ...this.serverFlags, ...this.debugFlags }, null, '\t')}`)
  }

  logDebugFlags = (): void => {
    // eslint-disable-next-line no-console
    console.log(LOG_PREFIX, `Debug flags: ${JSON.stringify(this.serverFlags, null, '\t')}`)
  }
}
