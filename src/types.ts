export type Flags<T extends string = string> = {
  [key in T]?: boolean
}

export interface ItsOnClientConfig<T extends string = string> {
  url: string
  debugFlags?: Flags<T>
  prefetchedFlags?: Flags<T>
}

export interface ServerResponse<T extends string = string> {
  count: number
  result: T[]
}
