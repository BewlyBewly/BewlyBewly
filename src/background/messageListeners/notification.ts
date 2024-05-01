import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_NOTIFICATION = {
  getUnreadMsg: {
    url: 'https://api.bilibili.com/x/msgfeed/unread',
    _fetch: {
      method: 'get',
    },
    params: {
      build: 0,
      mobi_app: 'web',
    },
    afterHandle: AHS.J_D,
  },
  getUnreadDm: {
    url: 'https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread',
    _fetch: {
      method: 'get',
    },
    params: {
      build: 0,
      mobi_app: 'web',
      unread_type: 0,
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_NOTIFICATION
