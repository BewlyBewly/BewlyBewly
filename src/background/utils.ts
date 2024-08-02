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
export type APIType = API | APIFunction
interface APIMAP {
  [key: string]: APIType
}
// 工厂函数API_LISTENER_FACTORY
function apiListenerFactory(API_MAP: APIMAP) {
  return (message: Message, sender?: any, sendResponse?: Function) => {
    const contentScriptQuery = message.contentScriptQuery
    // 检测是否有contentScriptQuery
    if (!contentScriptQuery || !API_MAP[contentScriptQuery])
      return console.error(`Cannot find this contentScriptQuery: ${contentScriptQuery}`)
    if (API_MAP[contentScriptQuery] instanceof Function)
      return (API_MAP[contentScriptQuery] as APIFunction)(message, sender, sendResponse)

    try {
      let { contentScriptQuery, ...rest } = message
      // rest above two part body or params
      rest = rest || {}

      let { _fetch, url, params = {}, afterHandle } = API_MAP[contentScriptQuery] as API
      const { method, headers, body } = _fetch as _FETCH
      const isGET = method.toLocaleLowerCase() === 'get'
      // merge params and body
      const targetParams = Object.assign({}, params)
      let targetBody = Object.assign({}, body)
      Object.keys(rest).forEach((key) => {
        if (body && body[key] !== undefined)
          targetBody[key] = rest[key]
        else
          targetParams[key] = rest[key]
      })

      // generate params
      if (Object.keys(targetParams).length) {
        const urlParams = new URLSearchParams()
        for (const key in targetParams)
          targetParams[key] && urlParams.append(key, targetParams[key])
        url += `?${urlParams.toString()}`
      }
      // generate body
      if (!isGET) {
        targetBody = (headers && headers['Content-Type'] && headers['Content-Type'].includes('application/x-www-form-urlencoded'))
          ? new URLSearchParams(targetBody)
          : JSON.stringify(targetBody)
      }
      // get cant take body
      const fetchOpt = { method, headers }
      !isGET && Object.assign(fetchOpt, { body: targetBody })

      // fetch and after handle
      let baseFunc = fetch(url, fetchOpt)
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
  type _FETCH,
  AHS,
  type API,
  apiListenerFactory,
  type APIMAP,
  type FetchAfterHandler,
  type Message,
  sendResponseHandler,
  toData,
  toJsonHandler,
}
