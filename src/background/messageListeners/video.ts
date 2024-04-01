import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_VIDEO: APIMAP = {
  getRecommendVideos: {
    url: 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  getAppRecommendVideos: {
    url: 'https://app.bilibili.com/x/v2/feed/index',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  dislikeVideo: {
    url: 'https://api.bilibili.com/x/feed/dislike',
    _fetch: {
      method: 'post',
    },
    afterHandle: AHS.J_D,
  },
  getVideoInfo: {
    url: 'https://api.bilibili.com/x/web-interface/view/detail',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  getVideoComments: {
    url: 'https://api.bilibili.com/x/v2/reply',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  getPopularVideos: {
    url: 'https://api.bilibili.com/x/web-interface/popular',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  getVideoPreview: {
    url: 'https://api.bilibili.com/x/player/wbi/playurl',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
}

export default API_VIDEO
