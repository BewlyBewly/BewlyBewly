import { settings } from '~/logic'

const get = (obj: any, path: string[]) => path.reduce((acc, part) => acc && acc[part], obj)

function compareNumber(item: any, keyPath: string[], filterValue: number) {
  return get(item, keyPath) > filterValue
}

export enum FilterType {
  views,
  duration,
}

const funcMap = {
  [FilterType.views]: {
    func: compareNumber,
    enabledKey: 'isFilterByView',
    valueKey: 'filterByView',
  },
  [FilterType.duration]: {
    func: compareNumber,
    enabledKey: 'isFilterByDuration',
    valueKey: 'filterByDuration',
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
      // let check = func(item, keyPath, value)
      // if (!check) {
      //   console.log('当前项目被拦截! 原因: ', '目标路径值 :>> ', keyPath, '大于', value, 'currentValue :>> ', get(item, keyPath));
      // }
      return func(item, keyPath, value)
    })
    return result
  }
}

export function useFilter(filterOpt: FilterType[], keyList: KeyPath) {
  const filter = ref<Function | null>(null)

  watch(() => [
    settings.value.isFilterByDuration,
    settings.value.isFilterByView,
    settings.value.filterByDuration,
    settings.value.filterByView,
  ], ([isD, isV]) => {
    if (!isD && !isV) {
      filter.value = null
      return
    }
    filter.value = factoryFilter(filterOpt, keyList)
  }, { immediate: true })

  return filter
}
