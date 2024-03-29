import type { APIMAP, _FETCH } from '../utils'
import { AHS } from '../utils'

const API_HISTORY: APIMAP = {
  getHistoryList: {
    url: 'https://api.bilibili.com/x/web-interface/history/cursor',
    _fetch: {
      method: 'get',
    },
    params: {
      ps: 20,
      type: '',
      view_at: '',
    },
    afterHandle: AHS.J_D,
  },
  searchHistoryList: {
    url: 'https://api.bilibili.com/x/web-goblin/history/search',
    _fetch: {
      method: 'get',
    },
    params: {
      pn: 1,
      keyword: '',
      business: 'all',
    },
    afterHandle: AHS.J_D,
  },
  deleteHistoryItem: {
    url: 'https://api.bilibili.com/x/v2/history/delete',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
    params: {
      kid: '',
      csrf: '',
    },
    afterHandle: AHS.J_D,
  },
  clearAllHistory: {
    url: 'https://api.bilibili.com/x/v2/history/clear',
    _fetch: {
      method: 'post',
    },
    params: {
      csrf: '',
    },
    afterHandle: AHS.J_D,
  },
  getHistoryPauseStatus: {
    url: 'https://api.bilibili.com/x/v2/history/shadow',
    _fetch: {
      method: 'get',
    },
    params: {},
    afterHandle: AHS.J_D,
  },
  setHistoryPauseStatus: {
    url: 'https://api.bilibili.com/x/v2/history/shadow/set',
    _fetch: {
      method: 'post',
    },
    params: {
      switch: '',
      csrf: '',
    },
    afterHandle: AHS.J_D,
  },
}

export default API_HISTORY
