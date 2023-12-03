import browser from 'webextension-polyfill'

function handleMessage(message: any) {
  if (message.contentScriptQuery === 'getTopbarNewMomentsCount') {
    const url = 'https://api.bilibili.com/x/web-interface/dynamic/entrance'
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }

  // v2 get moment list
  // else if (message.contentScriptQuery === 'getTopbarNewMoments') {
  //   // type: video | article
  //   const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/nav?type=${message.type}&update_baseline=${message.updateBaseline}`
  //   return fetch(url)
  //     .then(response => response.json())
  //     .then(data => (data))
  //     .catch(error => console.error(error))
  // }
  // else if (message.contentScriptQuery === 'getTopbarLiveMoments') {
  //   const url = `https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/FeedList?page=${message.page}&pagesize=10`
  //   return fetch(url)
  //     .then(response => response.json())
  //     .then(data => (data))
  //     .catch(error => console.error(error))
  // }

  else if (message.contentScriptQuery === 'getTopbarNewMoments') {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=${message.uid}
    &type_list=${message.typeList}`
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }

  else if (message.contentScriptQuery === 'getTopbarHistoryMoments') {
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_history?uid=${message.uid}
    &type_list=${message.typeList}
    &offset_dynamic_id=${message.offsetDynamicID}`
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }

  else if (message.contentScriptQuery === 'getTopbarLiveMoments') {
    const url = `https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/FeedList?page=${message.page}&pagesize=${message.pageSize}`
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }

  // https://socialsisteryi.github.io/bilibili-API-collect/docs/dynamic/all.html#%E8%8E%B7%E5%8F%96%E5%8A%A8%E6%80%81%E5%88%97%E8%A1%A8
  else if (message.contentScriptQuery === 'getMoments') {
    const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=${message.type}&offset=${message.offset}&update_baseline=${message.updateBaseline}`
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}

export function setupMomentMsgLstnr() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}
