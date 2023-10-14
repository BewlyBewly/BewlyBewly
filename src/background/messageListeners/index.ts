import { setupAnimeMsgLstnr } from './anime'
import { setupAuthMsgLstnr } from './auth'
import { setupVideoMsgLstnr } from './video'
import { setupUserMsgLstnr } from './user'
import { setupSearchMsgLstnr } from './search'
import { setupNotificationMsgLstnr } from './notification'
import { setupMomentMsgLstnr } from './moment'
import { setupHistoryMsgLstnr } from './history'
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
  setupHistoryMsgLstnr()
  setupFavoriteMsgLstnr()
  setupAnimeMsgLstnr()
  setupWatchLaterMsgLstnr()
  setupRankingMsgLstnr()
}
