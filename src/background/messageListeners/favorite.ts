import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_FAVORITE: APIMAP = {
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
  getFavoriteResources: {
    url: 'https://api.bilibili.com/x/v3/fav/resource/list',
    _fetch: {
      method: 'get',
    },
    params: {
      media_id: '',
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
  patchDelFavoriteResources: {
    url: 'https://api.bilibili.com/x/v3/fav/resource/batch-del',
    _fetch: {
      method: 'post',
    },
    params: {
      resources: '',
      media_id: '',
      csrf: '',
    },
    afterHandle: AHS.J_D,
  },
}

export default API_FAVORITE
