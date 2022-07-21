export type Flags<T extends string = string> = {
  [key in T]?: boolean
}

export interface ItsOnClientConfig<T extends string = string> {
  url: string
  refetchTimeInterval?: number
  defaultFlags?: Flags<T>
  prefetchedFlags?: Flags<T>
}

export type FlagsSubscriber = (flags: Flags) => void

export interface ServerResponse {
  count: number
  result: string[]
}
