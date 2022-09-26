# @bestdoctor/its-on-client

TypeScript клиент для ItsOn.

## Установка

`$ yarn add @bestdoctor/its-on-client`

или

`$ npm i -S @bestdoctor/its-on-client`

## Пример использование базового клиента

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
  debugFlags: {
    'some-debug-flag': true
  }
})

itsOnClient.enableRefetch()

itsOnClient.subscribeToRefetch((flags) => console.log('new flags', flags))

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

const flagsToLowerCase = (input: Flags): Flags =>
  Object.fromEntries(Object.entries(input).map(([flag, value]) => [flag.toLowerCase(), value]))

const serializedFlags = process.env._ITS_ON_FLAGS_
const prefetchedFlags = serializedFlags ? flagsToLowerCase(JSON.parse(serializedFlags) as Flags) : undefined

export const itsOnClient = new ItsOnClient<ProjectFlags>({
  url: String(process.env.ITS_ON_URL),
  prefetchedFlags,
  refetchInterfal: 60 * 1000,
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

## Пример использование браузерного клиента
Интерфейс аналогичен базовому клиенту, данный клиент дополнительно добавляет в ```window``` функции работы с флагами из консоли браузера:

```javascript
setFlag: (flag, value: boolean) => void
```
Установка значения флага, по умолчанию устанавливается true

```javascript
disableFlag: (flag: string) => void
```
Отключение флага, эквивалентно вызову ```setFlag(flag, false)```

```javascript
getFlag: (flag: string) => void
```
Вывод в консоль текущего значения флага

```javascript
getAllFlags: () => void
```
Вывод в консоль всех флагов

```javascript
getDebugFlags: () => void
```
Вывод в консоль всех отладочных флагов
