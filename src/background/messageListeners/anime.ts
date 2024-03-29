import type { APIMAP, _FETCH } from '../utils'
import { AHS } from '../utils'

const API_ANIME: APIMAP = {
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
      coursor: '',
      name: 'anime',
    },
    afterHandle: AHS.J_D,
  },
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
      ep_id: '234406',
    },
    afterHandle: AHS.J_D,
  },

}

export default API_ANIME
