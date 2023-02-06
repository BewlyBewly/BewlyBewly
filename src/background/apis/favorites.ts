import browser from 'webextension-polyfill'

export const setupFavoritesAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/fav/info.md#%E8%8E%B7%E5%8F%96%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%88%9B%E5%BB%BA%E7%9A%84%E6%89%80%E6%9C%89%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BF%A1%E6%81%AF
    if (message.contentScriptQuery === 'getFavoriteCategories') {
      const url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${message.mid}&jsonp=jsonp`
      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }
    // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/fav/list.md#%E8%8E%B7%E5%8F%96%E6%94%B6%E8%97%8F%E5%A4%B9%E5%86%85%E5%AE%B9%E6%98%8E%E7%BB%86%E5%88%97%E8%A1%A8
    else if (message.contentScriptQuery === 'getFavoriteResources') {
      const url = `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${message.mediaId}&pn=${message.pageNum}&ps=20&keyword=${message.keyword}&order=mtime&type=0&tid=0&platform=web&jsonp=jsonp`
      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }
  })
}
