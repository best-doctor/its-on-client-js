# @bestdoctor/its-on-client

Клиент для ItsOn.

## Установка

`$ yarn add @bestdoctor/its-on-client`

## Пример использование

Инициализация клиента
```typescript
import { ItsOnClient, Flags } from '@bestdoctor/its-on-client'

const flagsToLowerCase = (input: Flags): Flags =>
  Object.fromEntries(Object.entries(input).map(([flag, value]) => [flag.toLowerCase(), value]))

const serializedFlags = process.env._ITS_ON_FLAGS_
const prefetchedFlags = serializedFlags ? flagsToLowerCase(JSON.parse(serializedFlags) as Flags) : undefined

export const itsOnClient = new ItsOnClient({
  url: String(process.env.ITS_ON_URL),
  prefetchedFlags,
  refetchInterfal: 60 * 1000,
  defaultFlags: {
    'some-default-flag': true
  }
})

itsOnClient.enableRefetch()

itsOnClient.subscribeToRefetch((flags) => console.log('new flags', flags))

export const isActive = (flag: string) => itsOnClient.isActive(flag)
```

Загрузка флагов в головном компоненте
```typescript
useEffect(() => {
  itsOnClient.fetchFlags().then(() => {
    setIsFlagsLoaded(true)
  })
}, [])
```

