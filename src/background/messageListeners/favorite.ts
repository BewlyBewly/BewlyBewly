import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_FAVORITE = {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/fav/info.md#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%88%9B%E5%BB%BA%E7%9A%84%E6%89%80%E6%9C%89%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BF%A1%E6%81%AF
  getFavoriteCategories: {
    url: 'https://api.bilibili.com/x/v3/fav/folder/created/list-all',
    _fetch: {
      method: 'get',
    },
    params: {
      up_mid: '',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/fav/list.md#%E8%8E%B7%E5%8F%96%E6%94%B6%E8%97%8F%E5%A4%B9%E5%86%85%E5%AE%B9%E6%98%8E%E7%BB%86%E5%88%97%E8%A1%A8
  getFavoriteResources: {
    url: 'https://api.bilibili.com/x/v3/fav/resource/list',
    _fetch: {
      method: 'get',
    },
    params: {
      media_id: -1,
      pn: 1,
      ps: 20,
      keyword: '',
      order: 'mtime',
      type: 0,
      tid: 0,
      platform: 'web',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/fav/action.md#%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%86%85%E5%AE%B9
  patchDelFavoriteResources: {
    url: 'https://api.bilibili.com/x/v3/fav/resource/batch-del',
    _fetch: {
      method: 'post',
    },
    params: {
      resources: '',
      media_id: 0,
      csrf: '',
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_FAVORITE
