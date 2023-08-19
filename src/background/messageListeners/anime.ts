import browser from 'webextension-polyfill'

// import { getUserID } from '~/utils'

export function setupAnimeMsgLstnr() {
  browser.runtime.onConnect.addListener(() => {
    browser.runtime.onMessage.addListener((message) => {
    // get popular anime list
      if (message.contentScriptQuery === 'getPopularAnimeList') {
        const url
        = 'https://api.bilibili.com/pgc/web/rank/list?season_type=1&day=3'
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/36e250090800793b41b223b55eefdcbb9391b53e/user/space.md#%E6%9F%A5%E8%AF%A2%E7%94%A8%E6%88%B7%E8%BF%BD%E7%95%AA%E8%BF%BD%E5%89%A7%E6%98%8E%E7%BB%86
      else if (message.contentScriptQuery === 'getAnimeWatchList') {
        const url = `https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn=${message.pn}&ps=${message.ps}&vmid=${message.vmid}`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      else if (message.contentScriptQuery === 'getRecommendAnimeList') {
        const url = `https://api.bilibili.com/pgc/page/web/v3/feed?name=anime&coursor=${
        message.coursor ?? ''
      }`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/bangumi/timeline.md#%E7%95%AA%E5%89%A7%E6%88%96%E5%BD%B1%E8%A7%86%E6%97%B6%E9%97%B4%E7%BA%BF
      else if (message.contentScriptQuery === 'getAnimeTimeTable') {
        const url
        = 'https://api.bilibili.com/pgc/web/timeline?types=1&before=6&after=6'
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      else if (message.contentScriptQuery === 'getAnimeDetail') {
        const url = 'https://api.bilibili.com/pgc/view/web/season?ep_id=234406'
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
    // TODO: https://api.bilibili.com/pgc/season/index/condition?season_type=1&type=1
    })
  })
}
