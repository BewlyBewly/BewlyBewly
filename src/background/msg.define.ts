// 这个文件不要引用其他文件，我怕打包时候会把引用的部分也打包成两分
// en: This file should not reference other files, I am afraid that the referenced part will also be packaged into two parts when packaging

enum AUTH {
  LOGOUT = 'logout',
  GET_LOGIN_QR_CODE = 'getLoginQRCode',
  QR_CODE_LOGIN = 'qrCodeLogin',
}
enum ANIME {
  GET_ANIME = 'getAnime',
  GET_ANIME_WATCH_LIST = 'getAnimeWatchList',
  GET_RECOMMEND_ANIME_LIST = 'getRecommendAnimeList',
  GET_ANIME_TIME_TABLE = 'getAnimeTimeTable',
  GET_ANIME_DETAIL = 'getAnimeDetail',
  GET_POPULAR_ANIME_LIST = 'getPopularAnimeList',
}
enum FAVORITE {
  GET_FAVORITE_CATEGORIES = 'getFavoriteCategories',
  GET_FAVORITE_RESOURCES = 'getFavoriteResources',
  PATCH_DEL_FAVORITE_RESOURCES = 'patchDelFavoriteResources',
}
enum HISTORY {
  GET_HISTORY_LIST = 'getHistoryList',
  SEARCH_HISTORY_LIST = 'searchHistoryList',
  DELETE_HISTORY_ITEM = 'deleteHistoryItem',
  CLEAR_ALL_HISTORY = 'clearAllHistory',
  GET_HISTORY_PAUSE_STATUS = 'getHistoryPauseStatus',
  SET_HISTORY_PAUSE_STATUS = 'setHistoryPauseStatus',
}
enum MOMENT {
  GET_TOP_BAR_NEW_MOMENTS_COUNT = 'getTopBarNewMomentsCount',
  GET_TOP_BAR_MOMENTS = 'getTopBarMoments',
  GET_TOP_BAR_LIVE_MOMENTS = 'getTopBarLiveMoments',
  GET_MOMENTS = 'getMoments',
}
enum NOTIFICATION {
  GET_UNREAD_MSG = 'getUnreadMsg',
  GET_UNREAD_DM = 'getUnreadDm',
}
enum RANKING {
  GET_RANKING_VIDEOS = 'getRankingVideos',
  GET_RANKING_PGC = 'getRankingPgc',
}
enum SEARCH {
  GET_SEARCH_SUGGESTION = 'getSearchSuggestion',
}
enum USER {
  GET_USER_INFO = 'getUserInfo',
  GET_USER_STAT = 'getUserStat',
  RELATION_MODIFY = 'relationModify',
}
enum VIDEO {
  GET_RECOMMEND_VIDEOS = 'getRecommendVideos',
  GET_APP_RECOMMEND_VIDEOS = 'getAppRecommendVideos',
  DISLIKE_VIDEO = 'dislikeVideo',
  UNDO_DISLIKE_VIDEO = 'undoDislikeVideo',
  GET_VIDEO_INFO = 'getVideoInfo',
  GET_VIDEO_COMMENTS = 'getVideoComments',
  GET_POPULAR_VIDEOS = 'getPopularVideos',
  GET_VIDEO_PREVIEW = 'getVideoPreview',
}
enum WATCHLATER {
  SAVE_TO_WATCH_LATER = 'saveToWatchLater',
  REMOVE_FROM_WATCH_LATER = 'removeFromWatchLater',
  GET_ALL_WATCH_LATER_LIST = 'getAllWatchLaterList',
  CLEAR_ALL_WATCH_LATER = 'clearAllWatchLater',
}

const API = {
  AUTH,
  ANIME,
  FAVORITE,
  HISTORY,
  MOMENT,
  NOTIFICATION,
  RANKING,
  SEARCH,
  USER,
  VIDEO,
  WATCHLATER,
}

export default API
