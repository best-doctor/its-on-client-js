# @bestdoctor/its-on-client

TypeScript клиент для ItsOn.

## Установка

`$ yarn add @bestdoctor/its-on-client`

или

`$ npm i -S @bestdoctor/its-on-client`

## Пример использование

Инициализация клиента
```typescript
import { ItsOnClient, Flags } from '@bestdoctor/its-on-client'

const serializedFlags = process.env._ITS_ON_FLAGS_
const prefetchedFlags = serializedFlags ? JSON.parse(serializedFlags) as Flags : undefined

export const itsOnClient = new ItsOnClient({
  url: String(process.env.ITS_ON_URL),
  prefetchedFlags,
  debugFlags: {
    'some-debug-flag': true
  }
})

export const isActive = (flag: string) => itsOnClient.isActive(flag)
```

Инициализация клиента с ограничением флагов типизацией
```typescript
import { ItsOnClient, Flags } from '@bestdoctor/its-on-client'

type ProjectFlags = 'some-flag' | 'another-flag' | 'some-awesome-flag'
or
enum ProjectFlags = {
  SOME_FLAG,
  ANOTHER_FLAG,
  NEW_ANOTHER_FLAG,
}

const serializedFlags = process.env._ITS_ON_FLAGS_
const prefetchedFlags = serializedFlags ? JSON.parse(serializedFlags) as Flags : undefined

export const itsOnClient = new ItsOnClient<ProjectFlags>({
  url: String(process.env.ITS_ON_URL),
  prefetchedFlags,
})

export const isActive = (flag: ProjectFlags) => itsOnClient.isActive(flag)
```

Загрузка флагов в головном компоненте
```typescript
useEffect(() => {
  itsOnClient.fetchFlags().then(() => {
    setIsFlagsLoaded(true)
  })
}, [])
```

## Вспомогательные функции

```javascript
logFlag: (flag: string) => void
```
Вывод в консоль текущего значения флага

```javascript
logAllFlags: () => void
```
Вывод в консоль всех флагов

```javascript
logDebugFlags: () => void
```
Вывод в консоль всех отладочных флагов
