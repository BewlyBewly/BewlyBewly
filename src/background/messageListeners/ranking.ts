import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_RANKING = {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/7873a79022a5606e2391d93b411a05576a0df111/docs/video_ranking/ranking.md#%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%BA%E8%A7%86%E9%A2%91%E6%8E%92%E8%A1%8C%E6%A6%9C%E5%88%97%E8%A1%A8
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
    url: 'https://api.bilibili.com/pgc/season/rank/web/list',
    _fetch: {
      method: 'get',
    },
    params: {
      season_type: 1,
      day: 3,
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_RANKING
