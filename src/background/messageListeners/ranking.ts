import browser from 'webextension-polyfill'

function handleMessage(message: any) {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/7873a79022a5606e2391d93b411a05576a0df111/docs/video_ranking/ranking.md#%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%BA%E8%A7%86%E9%A2%91%E6%8E%92%E8%A1%8C%E6%A6%9C%E5%88%97%E8%A1%A8
  if (message.contentScriptQuery === 'getRankingVideos') {
    const url = `https://api.bilibili.com/x/web-interface/ranking/v2?rid=${message.rid ?? 0}&type=${message.type ?? 'all'}`
    return fetch(url)
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
  }
  else if (message.contentScriptQuery === 'getRankingPgc') {
    const url = `https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${message.seasonType}`
    return fetch(url)
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.error(error))
  }
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}

export function setupRankingMsgLstnr() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}
