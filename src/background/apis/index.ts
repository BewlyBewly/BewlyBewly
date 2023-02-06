import { setupAnimeAPIs } from './anime'
import { setupAuthAPIs } from './auth'
import { setupVideosAPIs } from './videos'
import { setupUserAPIs } from './user'
import { setupSearchAPIs } from './search'
import { setupNotificationsAPIs } from './notifications'
import { setupMomentsAPIs } from './moments'
import { setupHistoryAPIs } from './history'
import { setupFavoritesAPIs } from './favorites'

export const setupAllAPIs = () => {
  setupAuthAPIs()
  setupVideosAPIs()
  setupUserAPIs()
  setupSearchAPIs()
  setupNotificationsAPIs()
  setupMomentsAPIs()
  setupHistoryAPIs()
  setupFavoritesAPIs()
  setupAnimeAPIs()
}
