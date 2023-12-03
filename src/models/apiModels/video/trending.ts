// https://app.quicktype.io/?l=ts

export interface TrendingResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  list: List[]
  no_more: boolean
}

export interface List {
  aid: number
  videos: number
  tid: number
  tname: string
  copyright: number
  pic: string
  title: string
  pubdate: number
  ctime: number
  desc: string
  state: number
  duration: number
  mission_id?: number
  rights: { [key: string]: number }
  owner: Owner
  stat: { [key: string]: number }
  dynamic: string
  cid: number
  dimension: Dimension
  season_id?: number
  short_link_v2: string
  first_frame: string
  pub_location: string
  bvid: string
  season_type: number
  is_ogv: boolean
  ogv_info: null
  enable_vt: number
  ai_rcmd: null
  rcmd_reason: RcmdReason
  up_from_v2?: number
}

export interface Dimension {
  width: number
  height: number
  rotate: number
}

export interface Owner {
  mid: number
  name: string
  face: string
}

export interface RcmdReason {
  content: string
  corner_mark: number
}
