import type { APIMAP } from '../../utils'
import { AHS } from '../../utils'

const API_LIVE = {
  // https://socialsisteryi.github.io/bilibili-API-collect/docs/live/follow_up_live.html#%E7%94%A8%E6%88%B7%E5%85%B3%E6%B3%A8%E7%9A%84%E6%89%80%E6%9C%89up%E7%9A%84%E7%9B%B4%E6%92%AD%E6%83%85%E5%86%B5
  getFollowingLiveList: {
    url: 'https://api.live.bilibili.com/xlive/web-ucenter/user/following',
    _fetch: {
      method: 'get',
    },
    params: {
      page: 1,
      page_size: 9,
      ignoreRecord: 1,
      hit_ab: true,
    },
    afterHandle: AHS.J_D,
  },

} satisfies APIMAP

export default API_LIVE
