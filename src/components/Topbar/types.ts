export interface UserInfo {
  face: string // avatar
  level_info: {
    current_level: number
    current_min: number
    current_exp: number
    next_exp: string
  }
  mid: number
  money: number // 硬幣
  uname: string // username
  wallet: {
    mid: number
    bcoin_balance: number // b幣
  }
}

/**
 * Number of follower, following and published posts by user
 */
export interface UserStat {
  dynamic_count: number
  follower: number
  following: number
}

// https://github.com/SocialSisterYi/bilibili-API-collect/blob/63da4454309e2599269125e24a6940b1feecedef/message/msg.md#%E6%9C%AA%E8%AF%BB%E6%B6%88%E6%81%AF%E6%95%B0
export interface UnReadMessage {
  at: number
  chat: number
  like: number
  reply: number
  sys_msg: number
  up: number
}

export interface UnReadDm {
  // https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread?build=0&mobi_app=web&unread_type=0
  unfollow_unread: number
  follow_unread: number
  unfollow_push_msg: number
  dustbin_push_msg: number
  dustbin_unread: number
  biz_msg_unfollow_unread: number
  biz_msg_follow_unread: number
}

export enum MomentType {
  Video = 8,
  Article = 64,
  Bangumi = 512,
  PGC = 4097,
  Movie = 4098,
  TvShow = 4099,
  ChineseAnime = 4100,
  Documentary = 4101,
}

export interface MomentItem {
  type?: MomentType
  id: number
  uid: number
  name: string
  face: string
  aid?: number
  bvid?: string
  episode_id?: number
  url: string
  ctime?: number
  title: string
  cover: string
  dynamic_id_str?: string
  isNew: boolean
}

// https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/history&toview/history.md#%E8%8E%B7%E5%8F%96%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%88%97%E8%A1%A8_web%E7%AB%AF
export enum HistoryType {
  Archive = 'archive', // archive：稿件
  PGC = 'pgc', // pgc：剧集 (番剧 / 影视)
  Live = 'live', // live：直播
  ArticleList = 'article-list', // article-list：文集
  Article = 'article', // article：文章
}

export interface HistoryItem {
  title: string
  cover: string
  covers?: Array<string>
  history: {
    business: HistoryType
    epid?: number
    bvid?: string
    part?: string
    oid: number
  }
  author_name: string
  author_face: string
  author_mid: string
  view_at: number
  progress: number
  duration: number
  kid: number
  live_status: 0 | 1 // 0：未开播 1：已开播
}
