import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_ANIME = {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/36e250090800793b41b223b55eefdcbb9391b53e/user/space.md#%E6%9F%A5%E8%AF%A2%E7%94%A8%E6%88%B7%E8%BF%BD%E7%95%AA%E8%BF%BD%E5%89%A7%E6%98%8E%E7%BB%86
  getPopularAnimeList: {
    url: 'https://api.bilibili.com/pgc/web/rank/list',
    _fetch: {
      method: 'get',
    },
    params: {
      season_type: 1,
      day: 3,
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/36e250090800793b41b223b55eefdcbb9391b53e/user/space.md#%E6%9F%A5%E8%AF%A2%E7%94%A8%E6%88%B7%E8%BF%BD%E7%95%AA%E8%BF%BD%E5%89%A7%E6%98%8E%E7%BB%86
  getAnimeWatchList: {
    url: 'https://api.bilibili.com/x/space/bangumi/follow/list',
    _fetch: {
      method: 'get',
    },
    params: {
      pn: 1,
      ps: 15,
      type: 1,
      follow_status: 0,
      vmid: '',
    },
    afterHandle: AHS.J_D,
  },
  getRecommendAnimeList: {
    url: 'https://api.bilibili.com/pgc/page/web/v3/feed',
    _fetch: {
      method: 'get',
    },
    params: {
      coursor: 0,
      name: 'anime',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/bangumi/timeline.md#%E7%95%AA%E5%89%A7%E6%88%96%E5%BD%B1%E8%A7%86%E6%97%B6%E9%97%B4%E7%BA%BF
  getAnimeTimeTable: {
    url: 'https://api.bilibili.com/pgc/web/timeline',
    _fetch: {
      method: 'get',
    },
    params: {
      types: 1,
      before: 6,
      after: 6,
    },
    afterHandle: AHS.J_D,
  },
  getAnimeDetail: {
    url: 'https://api.bilibili.com/pgc/view/web/season',
    _fetch: {
      method: 'get',
    },
    params: {
      // ep_id: '234406',
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_ANIME
