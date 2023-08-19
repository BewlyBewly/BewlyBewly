import browser from 'webextension-polyfill'

export function setupVideoMsgLstnr() {
  browser.runtime.onConnect.addListener(() => {
    browser.runtime.onMessage.addListener((message) => {
    // #region APP端api，遺棄
    /** Recommend Videos */
    // if (message.contentScriptQuery === 'getRecommendVideos') {
    //   // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E8%8E%B7%E5%8F%96%E9%A6%96%E9%A1%B5%E5%86%85%E5%AE%B9
    //   const url = `${APP_URL}/x/feed/index?build=1&idx=${message.idx}&appkey=27eb53fc9058f8c3&access_key=${message.accessKey}`
    //   return fetch(url)
    //     .then(response => response.json())
    //     .then(data => data)
    //     .catch(error => console.error(error))
    // }
    // /** Submit a video that is not of interest */
    // else if (message.contentScriptQuery === 'submitDislike') {
    //   // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E6%8F%90%E4%BA%A4%E4%B8%8D%E5%96%9C%E6%AC%A2
    //   let url = `https://app.bilibili.com/x/feed/dislike?access_key=${message.accessKey}
    //     &goto=${message.goto}
    //     &id=${message.id}
    //     &mid=${message.mid}
    //     &reason_id=${message.reasonID}
    //     &rid=${message.rid}
    //     &tag_id=${message.tagID}
    //     &build=5000000`

      //   // remove url empty spaces
      //   url = url.replace(/\s+/g, '')

      //   return fetch(url)
      //     .then(response => response.json())
      //     .then(data => data)
      //     .catch(error => console.error(error))
      // }

      // /** Undo a video that is not of interest */
      // else if (message.contentScriptQuery === 'undoDislike') {
      //   // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E6%92%A4%E9%94%80%E4%B8%8D%E5%96%9C%E6%AC%A2
      //   let url = `https://app.bilibili.com/x/feed/dislike/cancel?access_key=${message.accessKey}
      //     &goto=${message.goto}
      //     &id=${message.id}
      //     &mid=${message.mid}
      //     &reason_id=${message.reasonID}
      //     &rid=${message.rid}
      //     &tag_id=${message.tagID}
      //     &build=5000000`

      //   // remove url empty spaces
      //   url = url.replace(/\s+/g, '')

      //   return fetch(url)
      //     .then(response => response.json())
      //     .then(data => data)
      //     .catch(error => console.error(error))
      // }
      // #endregion

      if (message.contentScriptQuery === 'getRecommendVideos') {
        const url = `https://api.bilibili.com/x/web-interface/index/top/feed/rcmd?fresh_idx=${message.refreshIdx}&feed_version=V2&fresh_type=4&ps=30&plat=1`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      else if (message.contentScriptQuery === 'getAppRecommendVideos') {
        const url = `https://app.bilibili.com/x/feed/index?build=1&idx=${message.idx}&appkey=27eb53fc9058f8c3&access_key=${message.accessKey}`
        // const url = `https://app.bilibili.com/x/v2/feed/index?build=72100100&idx=${message.idx}&appkey=27eb53fc9058f8c3&access_key=${message.accessKey}`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/info.md#%E8%8E%B7%E5%8F%96%E8%A7%86%E9%A2%91%E8%B6%85%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AFweb%E7%AB%AF
      else if (message.contentScriptQuery === 'getVideoInfo') {
        const url = `https://api.bilibili.com/x/web-interface/view/detail?${message.aid ? `aid=${message.aid}` : `bvid=${message.bvid}`}`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
      // https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/comment/list.md#%E8%8E%B7%E5%8F%96%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%8E%E7%BB%86_%E7%BF%BB%E9%A1%B5%E5%8A%A0%E8%BD%BD
      else if (message.contentScriptQuery === 'getVideoComments') {
        const url = `https://api.bilibili.com/x/v2/reply?csrf=${message.csrf}&type=1&oid=${message.oid}&sort=${message.sort ?? 0}&nohot=${message.nohot ?? 0}&pn=${message.pn ?? 1}&ps=${message.ps ?? 20}`
        return fetch(url)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error(error))
      }
    })
  })
}
