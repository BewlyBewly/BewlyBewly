import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_VIDEO = {
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
  // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E6%8F%90%E4%BA%A4%E4%B8%8D%E5%96%9C%E6%AC%A2
  dislikeVideo: {
    url: 'https://app.bilibili.com/x/feed/dislike',
    _fetch: {
      method: 'get',
    },
    params: {
      access_key: '',
      goto: '',
      id: 0,
      idx: '',
      reason_id: 1,
      device: '',
      mobi_app: '',
      build: 0,
      appkey: '',
      sign: '',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E6%92%A4%E9%94%80%E4%B8%8D%E5%96%9C%E6%AC%A2
  undoDislikeVideo: {
    url: 'https://app.bilibili.com/x/feed/dislike/cancel',
    _fetch: {
      method: 'get',
    },
    params: {
      access_key: '',
      goto: '',
      id: 0,
      idx: 0,
      reason_id: 1,
      device: '',
      mobi_app: '',
      build: 0,
      sign: '',
      appkey: '',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E8%B6%85%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AFweb%E7%AB%AF
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
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/comment/list.md#%E8%8E%B7%E5%8F%96%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%8E%E7%BB%86_%E7%BF%BB%E9%A1%B5%E5%8A%A0%E8%BD%BD
  getVideoComments: {
    url: 'https://api.bilibili.com/x/v2/reply',
    _fetch: {
      method: 'get',
    },
    params: {
      csrf: '',
      type: 1,
      oid: 0,
      sort: 0,
      nohot: 0,
      pn: 1,
      ps: 20,
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/def57d7a70ed1f39080069ba0f40648ce6ce2b90/docs/video_ranking/popular.md#%E8%8E%B7%E5%8F%96%E5%BD%93%E5%89%8D%E7%83%AD%E9%97%A8%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8
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
  // https://socialsisteryi.github.io/bilibili-API-collect/docs/video/videostream_url.html#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E6%B5%81%E5%9C%B0%E5%9D%80-web%E7%AB%AF
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
      cid: 0,
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_VIDEO
