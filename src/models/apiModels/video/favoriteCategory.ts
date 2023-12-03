export interface FavoritesCategoryResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  count: number
  list: List[]
  season: null
}

export interface List {
  id: number
  fid: number
  mid: number
  attr: number
  title: string
  fav_state: number
  media_count: number
}
