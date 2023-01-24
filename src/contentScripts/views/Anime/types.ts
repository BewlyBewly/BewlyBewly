export interface PopularAnime {
  badge: '独家' | '会员抢先' | '会员专享' | '出品'
  badge_info: {
    bg_color: string
    bg_color_night: string
    text: string
  }
  badge_type: number
  copyright: string
  cover: string // 豎向封面
  new_ep: {
    cover: string
    index_show: string
  }
  rank: number // 排名
  rating: string // 評分
  season_id: number
  ss_horizontal_cover: string // 橫向封面
  stat: {
    danmaku: number // 彈幕
    follow: number // 訂閲
    series_follow: number // 當前系列訂閲？？？
    view: number // 觀看數
  }
  title: string
  url: string
}

export interface RecommendAnimeItem {
  cover: string
  episode_id: number
  evaluate: string
  hover: {
    img: string
    text: string[]
  }
  link: string
  rank_id: number
  rating: string
  rating_count: number
  report: object
  season_id: number
  season_type: number
  stat: {
    danmaku: number
    duration: number
    view: number
  }
  sub_title: string
  text: string[]
  title: string
  user_status: {
    follow: number
  }
}
