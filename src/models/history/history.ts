export interface HistoryResult {
  code: number
  message: string
  ttl: number
  data: Data
}

export interface Data {
  cursor: Cursor
  tab: Tab[]
  list: List[]
}

export interface Cursor {
  max: number
  view_at: number
  business: Business | string
  ps: number
}

export enum Business {
  ARCHIVE = 'archive',
  PGC = 'pgc',
  LIVE = 'live',
  ARTICLE = 'article',
  ARTICLE_LIST = 'article-list',
}

export interface List {
  title: string
  long_title: string
  cover: string
  covers: null
  uri: string
  history: History
  videos: number
  author_name: string
  author_face: string
  author_mid: number
  view_at: number
  progress: number
  badge: string
  show_title: string
  duration: number
  current: string
  total: number
  new_desc: string
  is_finish: number
  is_fav: number
  kid: number
  tag_name: string
  live_status: number
}

export interface History {
  oid: number
  epid: number
  bvid: string
  page: number
  cid: number
  part: string
  business: Business
  dt: number
}

export interface Tab {
  type: string
  name: string
}
