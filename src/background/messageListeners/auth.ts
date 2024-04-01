// 由于 sendResponse 复杂, 所以使用自定义的函数
import type { APIMAP } from '../utils'
import { AHS } from '../utils'

const API_AUTH: APIMAP = {
  getAccessKey: {
    url: '',
    _fetch: {
      method: 'get',
    },
    params: {
      confirmUri: '',
    },
    afterHandle: [(responce) => {
      const accessKey = `${responce.url}`.match(/access_key=([0-9a-z]{32})/)![1]
      return new Response(accessKey)
    }, ...AHS.S],
  },
  // biliJct 似乎没有使用
  logout: {
    url: '',
    _fetch: {
      method: 'post',
    },
    params: {
      biliCSRF: '',
      biliJct: '',
    },
    afterHandle: AHS.J_S,
  },
  getLoginQRCode: {
    url: '',
    _fetch: {
      method: 'post',
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
    url: '',
    _fetch: {
      method: 'post',
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
}

export default API_AUTH
