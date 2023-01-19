import browser from 'webextension-polyfill'

export const setupAnimeAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    // get popular anime list
    if (message.contentScriptQuery === 'getPopularAnimeList') {
      const url = 'https://api.bilibili.com/pgc/web/rank/list?season_type=1&day=3'
      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }
  })
}
