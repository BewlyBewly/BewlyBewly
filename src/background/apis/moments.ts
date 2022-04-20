import { API_URL } from '.'

export const setupMomentsAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getNewMomentsCount') {
      const url = `${API_URL}/x/web-interface/dynamic/entrance`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }

    if (message.contentScriptQuery === 'getNewMoments') {
      const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=${message.uid}
        &type_list=${message.typeList}`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }

    if (message.contentScriptQuery === 'getHistoryMoments') {
      const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history?uid=${message.uid}
        &type_list=${message.typeList}
        &offset_dynamic_id=${message.offsetDynamicID}`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }

    if (message.contentScriptQuery === 'getLiveMoments') {
      const url = `https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/FeedList?page=${message.page}&pagesize=${message.pageSize}`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
