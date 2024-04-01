import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_WATCHLATER: APIMAP = {
  saveToWatchLater: {
    url: 'https://api.bilibili.com/x/v2/history/toview/add',
    _fetch: {
      method: 'post',
    },
    afterHandle: AHS.J_D,
  },
  removeFromWatchLater: {
    url: 'https://api.bilibili.com/x/v2/history/toview/del',
    _fetch: {
      method: 'post',
    },
    afterHandle: AHS.J_D,
  },
  getAllWatchLaterList: {
    url: 'https://api.bilibili.com/x/v2/history/toview',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  clearAllWatchLater: {
    url: 'https://api.bilibili.com/x/v2/history/toview/clear',
    _fetch: {
      method: 'post',
    },
    afterHandle: AHS.J_D,
  },
}

export default API_WATCHLATER
