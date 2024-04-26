import browser from 'webextension-polyfill'
import { apiListenerFactory } from '../utils'

import API_AUTH from './auth'
import API_ANIME from './anime'
import API_HISTORY from './history'
import API_FAVORITE from './favorite'
import API_MOMENT from './moment'
import API_NOTIFICATION from './notification'
import API_RANKING from './ranking'
import API_SEARCH from './search'
import API_USER from './user'
import API_VIDEO from './video'
import API_WATCHLATER from './watchLater'

export const API_COLLECTION = {
  AUTH: API_AUTH,
  ANIME: API_ANIME,
  HISTORY: API_HISTORY,
  FAVORITE: API_FAVORITE,
  MOMENT: API_MOMENT,
  NOTIFICATION: API_NOTIFICATION,
  RANKING: API_RANKING,
  SEARCH: API_SEARCH,
  USER: API_USER,
  VIDEO: API_VIDEO,
  WATCHLATER: API_WATCHLATER,
}

// Merge all API objects into one
const FullAPI = Object.assign({}, API_AUTH, API_ANIME, API_HISTORY, API_FAVORITE, API_MOMENT, API_NOTIFICATION, API_RANKING, API_SEARCH, API_USER, API_VIDEO, API_WATCHLATER)
// Create a message listener for each API
const handleMessage = apiListenerFactory(FullAPI)

export function setupAllMsgLstnrs() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}
