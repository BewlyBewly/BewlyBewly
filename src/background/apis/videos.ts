import browser from 'webextension-polyfill'
import { API_URL, APP_URL } from '.'

export const setupVideosAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    /** Recommend Videos */
    // if (message.contentScriptQuery === 'getRecommendVideos') {
    //   // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E8%8E%B7%E5%8F%96%E9%A6%96%E9%A1%B5%E5%86%85%E5%AE%B9
    //   const url = `${APP_URL}/x/feed/index?build=1&idx=${message.idx}&appkey=27eb53fc9058f8c3&access_key=${message.accessKey}`
    //   return fetch(url)
    //     .then(response => response.json())
    //     .then(data => data)
    //     .catch(error => console.error(error))
    // }
    if (message.contentScriptQuery === 'getRecommendVideos') {
      const url = `${API_URL}/x/web-interface/index/top/feed/rcmd?fresh_idx=${message.refreshIdx}&feed_version=V1&fresh_type=4&ps=30&plat=1`
      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }

    /** Submit a video that is not of interest */
    if (message.contentScriptQuery === 'submitDislike') {
      // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E6%8F%90%E4%BA%A4%E4%B8%8D%E5%96%9C%E6%AC%A2
      let url = `${APP_URL}/x/feed/dislike?access_key=${message.accessKey}
        &goto=${message.goto}
        &id=${message.id}
        &mid=${message.mid}
        &reason_id=${message.reasonID}
        &rid=${message.rid}
        &tag_id=${message.tagID}
        &build=5000000`

      // remove url empty spaces
      url = url.replace(/\s+/g, '')

      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }

    /** Unsubmit a video that is not of interest */
    if (message.contentScriptQuery === 'undoDislike') {
      // https://github.com/indefined/UserScripts/blob/master/bilibiliHome/bilibiliHome.API.md#%E6%92%A4%E9%94%80%E4%B8%8D%E5%96%9C%E6%AC%A2
      let url = `${APP_URL}/x/feed/dislike/cancel?access_key=${message.accessKey}
        &goto=${message.goto}
        &id=${message.id}
        &mid=${message.mid}
        &reason_id=${message.reasonID}
        &rid=${message.rid}
        &tag_id=${message.tagID}
        &build=5000000`

      // remove url empty spaces
      url = url.replace(/\s+/g, '')

      return fetch(url)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error(error))
    }
  })
}
