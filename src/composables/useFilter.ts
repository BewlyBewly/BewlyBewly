import { settings } from '~/logic'

const get = (obj: any, path: string[]) => path.reduce((acc, part) => acc && acc[part], obj)

export enum FilterType {
  viewCount,
  viewCountStr,
  duration,
  title,
  user,
}

type FuncMap = { [key in FilterType]: {
  func: Function
  enabledKey: string
  valueKey: string
} }

type KeyPath = Array<string>[]

export function factoryFilter(funcMap: FuncMap, filterOpt: FilterType[], keyList: KeyPath): Function {
  interface FuncParams {
    keyPath: string[]
    func: Function
    value?: number | string
  }

  const funcs: FuncParams[] = []

  filterOpt.forEach((type, index) => {
    const { func, enabledKey, valueKey } = funcMap[type]
    if ((settings.value as { [key: string]: any })[enabledKey]) {
      const funcParams: FuncParams = {
        keyPath: keyList[index],
        func,
        value: valueKey ? (settings.value as { [key: string]: any })[valueKey] : '',
      }
      // if (valueKey)
      //   funcParams.value = (settings.value as { [key: string]: any })[valueKey]
      funcs.push(funcParams)
    }
  })

  return (item: object): boolean => {
    const result = funcs.every(({ keyPath, func, value }) => {
      // const check = func(item, keyPath, value)
      // if (!check) {
      //   // console.log('当前项目被拦截! 原因: ', '目标路径值 :>> ', keyPath, '大于', value, 'currentValue :>> ', get(item, keyPath))
      //   console.log('当前项目被拦截! 原因: ', '目标路径值 :>> ', keyPath, '過濾內容', value, 'currentValue :>> ', get(item, keyPath))
      // }

      return func(item, keyPath, value)
    })
    return result
  }
}

export function useFilter(filterOpt: FilterType[], keyList: KeyPath) {
  /**
   * Compares a number value in an object with a filter value.
   * Return `true` if the number value is greater than the filter value, `false` otherwise.
   *
   * @param item - The object containing the number value.
   * @param keyPath - The path to the number value in the object.
   * @param filterValue - The filter value to compare with.
   * @returns `true` if the number value is greater than the filter value, `false` otherwise.
   */
  function compareNumber(item: any, keyPath: string[], filterValue: number) {
    return get(item, keyPath) > filterValue
  }

  /**
   * Compares a number or number string with a filter value.
   * @param item - The object to compare.
   * @param keyPath - The path to the property in the object.
   * @param filterValue - The value to compare against.
   * @returns `true` if the value is greater than the filter value, `false` otherwise.
   */
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

  // #region filter by title
  const filterByTitleStringValues: string[] = []
  const filterByTitleRegExpValues: RegExp[] = []

  settings.value.filterByTitle.forEach((item) => {
    if (item.keyword.startsWith('/') && item.keyword.endsWith('/')) {
      filterByTitleRegExpValues.push(new RegExp(item.keyword.slice(1, -1), 'i'))
    }
    else {
      filterByTitleStringValues.push(`${item.keyword}`.toUpperCase())
    }
  })

  /**
   * Compares the title of an item with the given key path.
   * @param item - The item to compare.
   * @param keyPath - The key path to access the title of the item.
   * @returns `true` if the title does not contain any of the filter keywords, `false` otherwise.
   */
  function compareTitle(item: any, keyPath: string[], _filterValue: string) {
    const value = get(item, keyPath)

    return !(filterByTitleStringValues.some(keyword => `${value}`.toUpperCase().includes(keyword))
      || filterByTitleRegExpValues.some(regex => regex.test(value)))
  }
  // #endregion

  // #region filter by user
  const filterByUserStringValues: string[] = []
  const filterByUserRegExpValues: RegExp[] = []

  settings.value.filterByUser.forEach((item) => {
    if (item.keyword.startsWith('/') && item.keyword.endsWith('/')) {
      filterByUserRegExpValues.push(new RegExp(item.keyword.slice(1, -1), 'i'))
    }
    else {
      filterByUserStringValues.push(`${item.keyword}`.toUpperCase())
    }
  })

  /**
   * Compares a given item with a key path and determines if it does not meets the filter criteria.
   * @param item - The item to compare.
   * @param keyPath - The key path to access the value in the item.
   * @returns `true` if the item does not meet the filter criteria, `false` otherwise.
   */
  function compareUser(item: any, keyPath: string[], _filterValue: string) {
    const value = get(item, keyPath)

    return !(filterByUserStringValues.includes(`${value}`.toUpperCase())
      || filterByUserRegExpValues.some(regex => regex.test(value)))
  }
  // #endregion

  const funcMap: FuncMap = {
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
    [FilterType.title]: {
      func: compareTitle,
      enabledKey: 'enableFilterByTitle',
      valueKey: '',
    },
    [FilterType.user]: {
      func: compareUser,
      enabledKey: 'enableFilterByUser',
      valueKey: '',
    },
  }

  const filter = ref<Function | null>(null)

  watch(() => [
    settings.value.enableFilterByDuration,
    settings.value.enableFilterByViewCount,
    settings.value.enableFilterByTitle,
    settings.value.enableFilterByUser,
    settings.value.filterByDuration,
    settings.value.filterByViewCount,
    settings.value.filterByTitle,
    settings.value.filterByUser,
  ], ([durationFilter, viewCountFilter, titleFilter, userFilter]) => {
    if (!durationFilter && !viewCountFilter && !titleFilter && !userFilter) {
      filter.value = null
      return
    }
    filter.value = factoryFilter(funcMap, filterOpt, keyList)
  }, { immediate: true })

  return filter
}
