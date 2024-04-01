import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_RANKING: APIMAP = {
  getRankingVideos: {
    url: 'https://api.bilibili.com/x/web-interface/ranking/v2',
    _fetch: {
      method: 'get',
    },
    params: {
      rid: 0,
      type: 'all',
    },
    afterHandle: AHS.J_D,
  },
  getRankingPgc: {
    url: 'https://api.bilibili.com/pgc/web/rank/list',
    _fetch: {
      method: 'get',
    },
    params: {
      season_type: 1,
    },
    afterHandle: AHS.J_D,
  },
}

export default API_RANKING
