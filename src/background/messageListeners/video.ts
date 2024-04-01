import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_VIDEO: APIMAP = {
  getRecommendVideos: {
    url: 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd',
    _fetch: {
      method: 'get',
    },
    params: {
      fresh_idx: 0,
      feed_version: 'V2',
      fresh_type: 4,
      ps: 30,
      plat: 1,
    },
    afterHandle: AHS.J_D,
  },
  getAppRecommendVideos: {
    url: 'https://app.bilibili.com/x/v2/feed/index',
    _fetch: {
      method: 'get',
    },
    params: {
      build: 74800100,
      device: 'pad',
      mobi_app: 'iphone',
      c_locate: 'CN',
      s_locale: 'zh-CN',
      idx: 0,
      appkey: '27eb53fc9058f8c3',
      access_key: '',
    },
    afterHandle: AHS.J_D,
  },
  dislikeVideo: {
    url: 'https://api.bilibili.com/x/feed/dislike',
    _fetch: {
      method: 'post',
    },
    params: {
      access_key: '',
      appkey: '27eb53fc9058f8c3',
      feedback_id: '',
      reason_id: 1,
    },
    afterHandle: AHS.J_D,
  },
  getVideoInfo: {
    url: 'https://api.bilibili.com/x/web-interface/view/detail',
    _fetch: {
      method: 'get',
    },
    params: {
      aid: '',
      bvid: '',
    },
    afterHandle: AHS.J_D,
  },
  getVideoComments: {
    url: 'https://api.bilibili.com/x/v2/reply',
    _fetch: {
      method: 'get',
    },
    params: {
      csrf: '',
      type: 1,
      oid: '',
      sort: 0,
      nohot: 0,
      pn: 1,
      ps: 20,
    },
    afterHandle: AHS.J_D,
  },
  getPopularVideos: {
    url: 'https://api.bilibili.com/x/web-interface/popular',
    _fetch: {
      method: 'get',
    },
    params: {
      pn: 1,
      ps: 20,
    },
    afterHandle: AHS.J_D,
  },
  getVideoPreview: {
    url: 'https://api.bilibili.com/x/player/wbi/playurl',
    _fetch: {
      method: 'get',
    },
    params: {
      qn: 32,
      fnver: 0,
      fnval: 1,
      bvid: '',
      cid: '',
    },
    afterHandle: AHS.J_D,
  },
}

export default API_VIDEO
