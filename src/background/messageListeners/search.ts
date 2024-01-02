import browser from 'webextension-polyfill'

function handleMessage(message: any) {
  if (message.contentScriptQuery === 'getSearchSuggestion') {
    // https://s.search.bilibili.com/main/suggest?func=suggest&suggest_type=accurate&sub_type=tag&main_ver=v1&highlight=&userid=&bangumi_acc_num=1&special_acc_num=1&topic_acc_num=1&upuser_acc_num=3&tag_num=10&special_num=10&bangumi_num=10&upuser_num=3&term=d&rnd=0.7285191795638684&buvid=40F8F3A8-86A1-56D8-1441-81A406B6D83127491infoc
    const url = `https://s.search.bilibili.com/main/suggest?func=suggest&suggest_type=accurate&sub_type=tag&main_ver=v1&highlight=&userid=&bangumi_acc_num=1&special_acc_num=1&topic_acc_num=1&upuser_acc_num=3&tag_num=10&special_num=10&bangumi_num=10&upuser_num=3&term=${message.term}&buvid=40F8F3A8-86A1-56D8-1441-81A406B6D83127491infoc`
    return fetch(url, {
      credentials: 'include',
      mode: 'cors',
    })
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}

export function setupSearchMsgLstnr() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}
