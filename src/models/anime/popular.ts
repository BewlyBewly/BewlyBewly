export interface PopularAnimeResult {
  code: number
  message: string
  result: Result
}

export interface Result {
  list: List[]
  note: string
}

export interface List {
  badge: string
  badge_info: BadgeInfo
  badge_type: number
  copyright: string
  cover: string
  enable_vt: boolean
  icon_font: IconFont
  new_ep: NewEp
  rank: number
  rating: string
  season_id: number
  ss_horizontal_cover: string
  stat: Stat
  title: string
  url: string
}

export interface BadgeInfo {
  bg_color: string
  bg_color_night: string
  text: string
}

export interface IconFont {
  name: string
  text: string
}

export interface NewEp {
  cover: string
  index_show: string
}

export interface Stat {
  danmaku: number
  follow: number
  series_follow: number
  view: number
}
