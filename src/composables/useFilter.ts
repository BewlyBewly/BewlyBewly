import { settings } from '~/logic'

const get = (obj: any, path: string[]) => path.reduce((acc, part) => acc && acc[part], obj)

function compareNumber(item: any, keyPath: string[], filterValue: number) {
  return get(item, keyPath) > filterValue
}

function compareNumberString(item: any, keyPath: string[], filterValue: number) {
  const value = get(item, keyPath)

  // for example: `1.2万`, `1.2萬`, `-` (indicates no data)
  if (typeof value === 'string' && (value.includes('万') || value.includes('萬'))) {
    const processedValue = value.replace(/万|萬/g, '')
    return Number(processedValue) * 10000 > filterValue
  }

  const numericValue = Number(value)
  return !Number.isNaN(numericValue) && numericValue > filterValue
}

export enum FilterType {
  viewCount,
  viewCountStr,
  duration,
}

const funcMap = {
  [FilterType.viewCount]: {
    func: compareNumber,
    enabledKey: 'enableFilterByViewCount',
    valueKey: 'filterByViewCount',
  },
  [FilterType.duration]: {
    func: compareNumber,
    enabledKey: 'enableFilterByDuration',
    valueKey: 'filterByDuration',
  },
  [FilterType.viewCountStr]: {
    func: compareNumberString,
    enabledKey: 'enableFilterByViewCount',
    valueKey: 'filterByViewCount',
  },
}

type KeyPath = Array<string>[]

export function factoryFilter(filterOpt: FilterType[], keyList: KeyPath): Function {
  const funcs: {
    keyPath: string[]
    func: Function
    value: number | string
  }[] = []

  filterOpt.forEach((type, index) => {
    const { func, enabledKey, valueKey } = funcMap[type]
    if ((settings.value as { [key: string]: any })[enabledKey]) {
      funcs.push({
        keyPath: keyList[index],
        func,
        value: (settings.value as { [key: string]: any })[valueKey],
      })
    }
  })

  return (item: object): boolean => {
    const result = funcs.every(({ keyPath, func, value }) => {
      // const check = func(item, keyPath, value)
      // if (!check) {
      //   console.log('当前项目被拦截! 原因: ', '目标路径值 :>> ', keyPath, '大于', value, 'currentValue :>> ', get(item, keyPath))
      // }
      return func(item, keyPath, value)
    })
    return result
  }
}

export function useFilter(filterOpt: FilterType[], keyList: KeyPath) {
  const filter = ref<Function | null>(null)

  watch(() => [
    settings.value.enableFilterByDuration,
    settings.value.enableFilterByViewCount,
    settings.value.filterByDuration,
    settings.value.filterByViewCount,
  ], ([isD, isV]) => {
    if (!isD && !isV) {
      filter.value = null
      return
    }
    filter.value = factoryFilter(filterOpt, keyList)
  }, { immediate: true })

  return filter
}
