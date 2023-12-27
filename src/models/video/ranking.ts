// https://app.quicktype.io/?l=ts

export interface RankingResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  note: string
  list: List[]
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
  short_link_v2: string
  first_frame: string
  pub_location?: string
  bvid: string
  score: number
  enable_vt: number
  up_from_v2?: number
  season_id?: number
  others?: List[]
  attribute?: number
  attribute_v2?: number
  charging_pay?: ChargingPay
}

export interface ChargingPay {
  level: number
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
