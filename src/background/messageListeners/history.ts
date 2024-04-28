import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_HISTORY = {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/history.md#%E8%8E%B7%E5%8F%96%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%88%97%E8%A1%A8_web%E7%AB%AF
  getHistoryList: {
    url: 'https://api.bilibili.com/x/web-interface/history/cursor',
    _fetch: {
      method: 'get',
    },
    params: {
      ps: 20,
      type: '',
      view_at: 0,
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
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/history.md#%E5%88%A0%E9%99%A4%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
  deleteHistoryItem: {
    url: 'https://api.bilibili.com/x/v2/history/delete',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        kid: '',
        csrf: '',
      },
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/history.md#%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
  clearAllHistory: {
    url: 'https://api.bilibili.com/x/v2/history/clear',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        csrf: '',
      },
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/history.md#%E6%9F%A5%E8%AF%A2%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%81%9C%E7%94%A8%E7%8A%B6%E6%80%81
  getHistoryPauseStatus: {
    url: 'https://api.bilibili.com/x/v2/history/shadow',
    _fetch: {
      method: 'get',
    },
    params: {},
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/history.md#%E5%81%9C%E7%94%A8%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95
  setHistoryPauseStatus: {
    url: 'https://api.bilibili.com/x/v2/history/shadow/set',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        switch: false,
        csrf: '',
      },
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_HISTORY
