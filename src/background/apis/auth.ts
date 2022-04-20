export const setupAuthAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getAccessKey') {
      const url = message.confirmUri
      return fetch(url)
        .then(response => ({ accessKey: `${response.url}`.match(/access_key=([0-9a-z]{32})/)![1] }))
        .catch(error => console.error(error))
    }

    if (message.contentScriptQuery === 'logout') {
      const url = `https://passport.bilibili.com/login/exit/v2?biliCSRF=${message.biliCSRF}`
      return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          biliCSRF: message.biliJct,
        }),
      })
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
