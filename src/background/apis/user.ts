import { API_URL } from '.'

export const setupUserAPIs = () => {
  browser.runtime.onMessage.addListener((message) => {
    if (message.contentScriptQuery === 'getUserInfo') {
      const url = `${API_URL}/x/web-interface/nav`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }

    if (message.contentScriptQuery === 'getUserStat') {
      const url = `${API_URL}/x/web-interface/nav/stat`
      return fetch(url)
        .then(response => response.json())
        .then(data => (data))
        .catch(error => console.error(error))
    }
  })
}
