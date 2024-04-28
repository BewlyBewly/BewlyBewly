import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_USER = {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/e379d904c2753fa30e9083f59016f07e89d19467/docs/login/login_info.md#%E5%AF%BC%E8%88%AA%E6%A0%8F%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF
  getUserInfo: {
    url: 'https://api.bilibili.com/x/web-interface/nav',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  getUserStat: {
    url: 'https://api.bilibili.com/x/web-interface/nav/stat',
    _fetch: {
      method: 'get',
    },
    afterHandle: AHS.J_D,
  },
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/ed9ac01b6769430aa3f12ad02c2ed337a96924eb/docs/user/relation.md#操作用户关系
  relationModify: {
    url: 'https://api.bilibili.com/x/relation/modify',
    _fetch: {
      method: 'post',
    },
    params: {
      // access_key: '', // app only
      fid: '',
      act: 1,
      re_src: 11,
    },
    afterHandle: AHS.J_D,
  },
} satisfies APIMAP

export default API_USER
