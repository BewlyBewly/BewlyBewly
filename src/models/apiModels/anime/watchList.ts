export interface WatchListResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  list: List[]
  pn: number
  ps: number
  total: number
}

export interface List {
  season_id: number
  media_id: number
  season_type: number
  season_type_name: SeasonTypeName
  title: string
  cover: string
  total_count: number
  is_finish: number
  is_started: number
  is_play: number
  badge: Badge
  badge_type: number
  rights: Rights
  stat: Stat
  new_ep: FirstEpInfo
  rating: Rating
  square_cover: string
  season_status: number
  season_title: string
  badge_ep: BadgeEp
  media_attr: number
  season_attr: number
  evaluate: string
  areas: Area[]
  subtitle: string
  first_ep: number
  can_watch: number
  series: Series
  publish: Publish
  mode: number
  section: Section[]
  url: string
  badge_info: BadgeInfo
  renewal_time?: string
  first_ep_info: FirstEpInfo
  formal_ep_count: number
  short_url: string
  badge_infos?: BadgeInfos
  season_version: SeasonVersion
  subtitle_14?: string
  viewable_crowd_type: number
  summary: string
  styles: string[]
  follow_status: number
  is_new: number
  progress: string
  both_follow: boolean
  producers?: Producer[]
  horizontal_cover_16_9?: string
  horizontal_cover_16_10?: string
  config_attrs?: ConfigAttrs
  subtitle_25?: string
}

export interface Area {
  id: number
  name: Name
}

export enum Name {
  中国大陆 = '中国大陆',
  日本 = '日本',
}

export enum Badge {
  Empty = '',
  会员专享 = '会员专享',
  独家 = '独家',
}

export enum BadgeEp {
  Empty = '',
  会员 = '会员',
}

export interface BadgeInfo {
  text?: Badge
  bg_color: BgColor
  bg_color_night: BgColorNight
  img?: string
  multi_img: MultiImg
}

export enum BgColor {
  Fb7299 = '#FB7299',
  The00C0Ff = '#00C0FF',
}

export enum BgColorNight {
  Bb5B76 = '#BB5B76',
  The0B91Be = '#0B91BE',
}

export interface MultiImg {
  color: string
  medium_remind: string
}

export interface BadgeInfos {
  content_attr?: BadgeInfo
  vip_or_pay?: BadgeInfo
}

export interface ConfigAttrs {
  highlight_ineffective_hd?: HighlightIneffective
  highlight_ineffective_ott?: HighlightIneffective
  highlight_ineffective_pink?: HighlightIneffective
  cc_on_lock?: CcOnLock
}

export interface CcOnLock {
  type_url: string
  value: string
}

export interface HighlightIneffective {
  type_url: string
}

export interface FirstEpInfo {
  id: number
  cover: string
  title: string
  long_title?: string
  pub_time: Date
  duration: number
  index_show?: string
}

export interface Producer {
  mid: number
  type: number
  is_contribute?: number
}

export interface Publish {
  pub_time: Date
  pub_time_show: string
  release_date: Date
  release_date_show: string
  pub_time_show_db?: string
}

export interface Rating {
  score: number
  count: number
}

export interface Rights {
  allow_review: number
  is_selection: number
  selection_style: number
  demand_end_time: DemandEndTime
  is_rcmd?: number
  allow_preview?: number
  allow_bp?: number
  allow_bp_rank?: number
}

export interface DemandEndTime {
}

export enum SeasonTypeName {
  国创 = '国创',
  番剧 = '番剧',
}

export enum SeasonVersion {
  Movie = 'movie',
  Tv = 'tv',
}

export interface Section {
  section_id: number
  season_id: number
  limit_group: number
  watch_platform: number
  copyright: Copyright
  ban_area_show?: number
  episode_ids: number[]
  type?: number
  title?: string
  attr?: number
}

export enum Copyright {
  Bilibili = 'bilibili',
  Dujia = 'dujia',
  Ugc = 'ugc',
}

export interface Series {
  series_id: number
  title: string
  season_count: number
  new_season_id: number
  series_ord: number
}

export interface Stat {
  follow: number
  view: number
  danmaku: number
  reply: number
  coin: number
  series_follow: number
  series_view: number
  likes: number
  favorite: number
}
