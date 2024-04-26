import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_SEARCH = {
  getSearchSuggestion: {
    url: 'https://s.search.bilibili.com/main/suggest',
    _fetch: {
      method: 'get',
    },
    params: {
      term: '',
      highlight: '',
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_SEARCH
