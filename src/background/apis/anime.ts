import browser from 'webextension-polyfill'

export const setupAnimeAPIs = () => {
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
    else if (message.contentScriptQuery === 'getRecommendAnimeList') {
      const url
        = `https://api.bilibili.com/pgc/page/web/v3/feed?name=anime&coursor=${message.cursor ?? ''}`
      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }
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
  })
}
