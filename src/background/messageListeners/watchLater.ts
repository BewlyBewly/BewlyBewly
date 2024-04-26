import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_WATCHLATER = {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B
  saveToWatchLater: {
    url: 'https://api.bilibili.com/x/v2/history/toview/add',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        aid: 0,
        csrf: '',
      },
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E5%88%A0%E9%99%A4%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%A7%86%E9%A2%91
  removeFromWatchLater: {
    url: 'https://api.bilibili.com/x/v2/history/toview/del',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        viewed: false,
        csrf: '',
      },
    },
    params: {
      aid: 0,
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E8%8E%B7%E5%8F%96%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8
  getAllWatchLaterList: {
    url: 'https://api.bilibili.com/x/v2/history/toview',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#%E6%B8%85%E7%A9%BA%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8
  clearAllWatchLater: {
    url: 'https://api.bilibili.com/x/v2/history/toview/clear',
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
} satisfies APIMAP

export default API_WATCHLATER
