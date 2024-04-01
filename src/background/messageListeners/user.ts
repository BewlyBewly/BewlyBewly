import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_USER: APIMAP = {
  getUserInfo: {
    url: 'https://api.bilibili.com/x/web-interface/nav',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  getUserStat: {
    url: 'https://api.bilibili.com/x/web-interface/nav/stat',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
}

export default API_USER
