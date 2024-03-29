import browser from 'webextension-polyfill'
import { apiListenerFactory } from '../utils'
import API_ANIME from './anime'
import { setupAuthMsgLstnr } from './auth'
import { setupVideoMsgLstnr } from './video'
import { setupUserMsgLstnr } from './user'
import { setupSearchMsgLstnr } from './search'
import { setupNotificationMsgLstnr } from './notification'
import { setupMomentMsgLstnr } from './moment'
import API_HISTORY from './history'
import { setupFavoriteMsgLstnr } from './favorite'
import { setupWatchLaterMsgLstnr } from './watchLater'
import { setupRankingMsgLstnr } from './ranking'

export function setupAllMsgLstnrs() {
  setupAuthMsgLstnr()
  setupVideoMsgLstnr()
  setupUserMsgLstnr()
  setupSearchMsgLstnr()
  setupNotificationMsgLstnr()
  setupMomentMsgLstnr()
  setupFavoriteMsgLstnr()
  setupWatchLaterMsgLstnr()
  setupRankingMsgLstnr()

  // 上面的会全部删除, 每个文件只保留定义API 的对象, 在这里进行mixin
  // 然后整个开始监听

  const FullAPI = Object.assign({}, API_ANIME, API_HISTORY)

  const handleMessage = apiListenerFactory(FullAPI)
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}
