import md5 from 'md5'

/**
 * 为请求参数进行 APP 签名
 * https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/sign/APP.html#typescript-javascript
 */
type Params = Record<string, any>

export function appSign(params: Params, appkey: string, appsec: string): string {
  params.appkey = appkey
  const searchParams = new URLSearchParams(params)
  searchParams.sort()
  return md5(searchParams.toString() + appsec)
}
