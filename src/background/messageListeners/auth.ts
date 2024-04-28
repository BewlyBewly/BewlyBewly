// 由于 sendResponse 复杂, 所以使用自定义的函数
import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_AUTH = {
  // biliJct 似乎没有使用
  logout: {
    url: 'https://passport.bilibili.com/login/exit/v2',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: {
        biliCSRF: '',
        // biliJct: '',
      },
    },
    params: {
      biliCSRF: '',
    },
    afterHandle: AHS.J_S,
  },
  getLoginQRCode: {
    url: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
    params: {
      appkey: '4409e2ce8ffd12b8',
      local_id: '0',
      ts: '0',
      sign: 'e134154ed6add881d28fbdf68653cd9c',
    },
    afterHandle: AHS.J_S,
  },
  qrCodeLogin: {
    url: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code',
    _fetch: {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
    params: {
      appkey: '4409e2ce8ffd12b8',
      auth_code: '',
      local_id: '0',
      ts: '0',
      sign: 'e134154ed6add881d28fbdf68653cd9c',
    },
    afterHandle: AHS.J_S,
  },
} satisfies APIMAP

export default API_AUTH
