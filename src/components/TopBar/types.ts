// https://github.com/SocialSisterYi/bilibili-API-collect/blob/e379d904c2753fa30e9083f59016f07e89d19467/docs/login/login_info.md#%E5%AF%BC%E8%88%AA%E6%A0%8F%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF
export interface UserInfo {
  face: string // avatar
  level_info: {
    current_level: number
    current_min: number
    current_exp: number
    next_exp: number
  }
  mid: number
  money: number // 硬幣
  uname: string // username
  vip: {
    status: number // 1 is vip
  }
  wallet: {
    mid: number
    bcoin_balance: number // b幣
  }
  is_senior_member: boolean
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

export interface FavoriteCategory {
  id: number
  fid: number
  mid: number
  attr: number
  title: string
  fav_state: number
  media_count: number
}

// https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/fav/list.md#%E8%8E%B7%E5%8F%96%E6%94%B6%E8%97%8F%E5%A4%B9%E5%86%85%E5%AE%B9%E6%98%8E%E7%BB%86%E5%88%97%E8%A1%A8
export interface FavoriteResource {
  id: number
  type: number // 2：视频稿件 12：音频 21：视频合集
  title: string
  cover: string
  intro: string
  page: number // 视频分P数
  duration: number // 音频/视频时长
  /** UP主信息 */
  upper: {
    mid: number
    name: string
    face: string
  }
  /** 状态数 */
  cnt_info: {
    collect: number // 收藏数
    play: number // 播放数
    danmaku: number // 弹幕数
  }
  link: string
  ctime: number // 投稿时间
  pubtime: number // 发布时间
  fav_time: number // 收藏时间
  bv_id: string
  bvid: string
}
