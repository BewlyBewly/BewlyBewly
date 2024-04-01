import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_MOMENT: APIMAP = {
  getTopBarNewMomentsCount: {
    url: 'https://api.bilibili.com/x/web-interface/dynamic/entrance',
    _fetch: {
      method: 'get',
    },
    params: {},
    afterHandle: AHS.J_D,
  },
  getTopBarNewMoments: {
    url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new',
    _fetch: {
      method: 'get',
    },
    params: {
      uid: '',
      typeList: '268435455',
    },
    afterHandle: AHS.J_D,
  },
  getTopbarHistoryMoments: {
    url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history',
    _fetch: {
      method: 'get',
    },
    params: {
      uid: '',
      typeList: '268435455',
      offsetDynamicID: '',
    },
    afterHandle: AHS.J_D,
  },
  getTopbarLiveMoments: {
    url: 'https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/FeedList',
    _fetch: {
      method: 'get',
    },
    params: {
      page: 1,
      pageSize: 10,
    },
    afterHandle: AHS.J_D,
  },
  getMoments: {
    url: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all',
    _fetch: {
      method: 'get',
    },
    params: {
      type: 268435455,
      offset: 0,
      updateBaseline: 0,
    },
    afterHandle: AHS.J_D,
  },

}

export default API_MOMENT
