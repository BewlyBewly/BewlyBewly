// 对于fetch的常见后处理
// 1. 直接返回data
// 2. json化后返回data

type FetchAfterHandler = ((data: Response) => Promise<any>) | ((data: any) => any)

function toJsonHandler(data: Response): Promise<any> {
  return data.json()
}
function toData(data: Promise<any>): Promise<any> {
  return data
}

// if need sendResponse, use this
// return a FetchAfterHandler function
function sendResponseHandler(sendResponse: Function) {
  return (data: any) => sendResponse(data)
}

// 定义后处理流
const AHS: {
  J_D: FetchAfterHandler[]
  J_S: FetchAfterHandler[]
  S: FetchAfterHandler[]
} = {
  J_D: [toJsonHandler, toData],
  J_S: [toJsonHandler, sendResponseHandler],
  S: [sendResponseHandler],
}

interface Message {
  contentScriptQuery: string
  [key: string]: any
}

interface _FETCH {
  method: string
  headers?: {
    [key: string]: any
  }
  body?: any
}

interface API {
  url: string
  _fetch: _FETCH
  params?: {
    [key: string]: any
  }
  afterHandle: ((response: Response) => Response | Promise<Response>)[]
}
// 重载API 可以为函数
type APIFunction = (message: Message, sender?: any, sendResponse?: Function) => any
type APIType = API | APIFunction
interface APIMAP {
  [key: string]: APIType
}
// 工厂函数API_LISTENER_FACTORY
function apiListenerFactory(API_MAP: APIMAP) {
  return (message: Message, sender?: any, sendResponse?: Function) => {
    const contentScriptQuery = message.contentScriptQuery
    // 检测是否有contentScriptQuery
    if (!contentScriptQuery || !API_MAP[contentScriptQuery])
      return console.error('no contentScriptQuery')
    if (API_MAP[contentScriptQuery] instanceof Function)
      return (API_MAP[contentScriptQuery] as APIFunction)(message, sender, sendResponse)

    try {
      let { contentScriptQuery, ...rest } = message
      rest = rest || {}
      const { _fetch, url, params, afterHandle } = API_MAP[contentScriptQuery] as API
      const { method, headers, body } = _fetch as _FETCH
      const targetParams = Object.assign({}, params, rest)
      let targetUrl = url
      let targetBody = Object.assign({}, body)

      if (method === 'get') {
        const urlParams = new URLSearchParams()
        for (const key in targetParams)
          urlParams.append(key, targetParams[key])
        targetUrl += `?${urlParams.toString()}`
      }
      else {
        targetBody = JSON.stringify(targetParams)
      }
      // get cant take body
      const fetchOpt = method === 'get' ? { method, headers } : { method, headers, body: targetBody }
      if (method === 'post') {
        // 检测是不是formData
        if (headers && headers['Content-Type'].startWith('application/x-www-form-urlencoded'))
          fetchOpt.body = new URLSearchParams(targetBody)
      }
      let baseFunc = fetch(targetUrl, fetchOpt)
      afterHandle.forEach((func) => {
        if (func.name === sendResponseHandler.name && sendResponse)
          // sendResponseHandler 是一个特殊的后处理函数，需要传入sendResponse
          baseFunc = baseFunc.then(sendResponseHandler(sendResponse))
        else
          baseFunc = baseFunc.then(func)
      })
      baseFunc.catch(console.error)

      return baseFunc
    }
    catch (e) {
      console.error(e)
    }
  }
}

export {
  FetchAfterHandler,
  toJsonHandler,
  toData,
  sendResponseHandler,
  AHS,
  Message,
  _FETCH,
  API,
  APIMAP,
  apiListenerFactory,
}
